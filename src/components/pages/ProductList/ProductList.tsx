import AddIcon from "@mui/icons-material/Add";
import {
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TextField,
} from "@mui/material";
import BottomFab from "@src/components/atoms/BottomFab";
import TagIcon from "@src/components/atoms/TagIcon";
import EditableRow from "@src/components/molecules/EditableRow";
import SortableHead from "@src/components/molecules/SortableHead";
import ConfirmDialog from "@src/components/organisms/ConfirmDialog";
import useDelete from "@src/repository/useDelete.ts";
import useProducts from "@src/repository/useProducts.ts";
import { setProductIdToEdit, setProductToDeleteId } from "@src/store/GlobalSlice.ts";
import { useAppDispatch, useAppSelector } from "@src/store/store.ts";
import { HUNDRED, PRODUCT_TYPE } from "@src/utils/constants.ts";
import { formatCurrency, includesString } from "@src/utils/functions.ts";
import useSortedData from "@src/utils/hooks/useSortedData.ts";
import routes from "@src/utils/routes.ts";
import { MappedProduct } from "@src/utils/types.ts";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const COLUMNS = [
  "name",
  "tag",
  "calories",
  "proteins",
  "fats",
  "saturatedFats",
  "carbohydrates",
  "sugar",
  "fiber",
  "salt",
  "portion",
  "cost",
  "type",
] satisfies (keyof MappedProduct)[];

function ProductList() {
  const { t } = useTranslation(["ProductList", "ProductForm"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { productToDeleteId } = useAppSelector((state) => state.global);
  const [macroPerPortion, setMacroPerPortion] = useState(true);
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const { data } = useProducts();
  const { mutate: deleteProduct } = useDelete("products");
  const filteredProducts = data.filter((product) => {
    const nameFilterMatches = includesString(product.name, nameFilter);
    const typeFilterMatches = typeFilter === "" || product.type === typeFilter;
    return nameFilterMatches && typeFilterMatches;
  });

  const processValue = (value: number, productType: string) => {
    if (productType === PRODUCT_TYPE.spice) return null;
    return value;
  };

  const mappedProducts = filteredProducts.map((product) => {
    if (!macroPerPortion) return product;
    const portionMultiplier = product.portion / HUNDRED;
    return {
      ...product,
      calories: processValue(product.calories * portionMultiplier, product.type),
      proteins: processValue(product.proteins * portionMultiplier, product.type),
      fats: processValue(product.fats * portionMultiplier, product.type),
      saturatedFats: processValue(product.saturatedFats * portionMultiplier, product.type),
      carbohydrates: processValue(product.carbohydrates * portionMultiplier, product.type),
      sugar: processValue(product.sugar * portionMultiplier, product.type),
      fiber: processValue(product.fiber * portionMultiplier, product.type),
      salt: processValue(product.salt * portionMultiplier, product.type),
      cost: processValue(product.cost * portionMultiplier, product.type),
      portion: processValue(product.portion, product.type),
    };
  });
  const { sortedData: sortedProducts, sortBy, setSortBy, sortDir, setSortDir } = useSortedData(mappedProducts, "name");

  return (
    <>
      <FormControlLabel
        sx={{ mt: 2, ml: 2 }}
        control={<Switch checked={macroPerPortion} onChange={(_, value) => setMacroPerPortion(value)} />}
        label={t("macroPerPortion")}
      />
      <Stack direction="row" sx={{ p: 1, gap: 1 }}>
        <TextField fullWidth label={t("name")} value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
        <TextField
          select
          fullWidth
          label={t("type")}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {Object.values(PRODUCT_TYPE).map((type) => (
            <MenuItem key={type} value={type}>
              {t(`ProductForm:${type}`)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <SortableHead
            columns={COLUMNS}
            alignLeftColumns={["name", "type", "cost"]}
            columnNames={Object.fromEntries(COLUMNS.map((column) => [column, t(column)]))}
            sortBy={sortBy}
            setSortBy={setSortBy as Dispatch<SetStateAction<string>>}
            sortDir={sortDir}
            setSortDir={setSortDir}
          />
          <TableBody>
            {sortedProducts.map((product) => (
              <EditableRow
                key={product.id}
                columns={COLUMNS}
                data={{
                  ...product,
                  tag: <TagIcon tag={product.tag} />,
                  type: t(`ProductForm:${product.type as "proteins"}`),
                  cost: product.cost ? `${formatCurrency(product.cost)}` : null,
                }}
                onEdit={() => {
                  dispatch(setProductIdToEdit(product.id));
                  navigate(routes.productFormUpdate);
                }}
                onDelete={() => dispatch(setProductToDeleteId(product.id))}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        title={t("confirmDelete")}
        open={productToDeleteId !== null}
        onCancel={() => dispatch(setProductToDeleteId(null))}
        onConfirm={() => {
          if (productToDeleteId) deleteProduct(productToDeleteId);
          dispatch(setProductToDeleteId(null));
        }}
      />
      <BottomFab
        onClick={() => {
          dispatch(setProductIdToEdit(null));
          navigate(routes.productForm);
        }}
      >
        <AddIcon />
      </BottomFab>
    </>
  );
}

export default ProductList;
