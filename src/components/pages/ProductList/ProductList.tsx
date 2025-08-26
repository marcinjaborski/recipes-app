import AddIcon from "@mui/icons-material/Add";
import { MenuItem, Paper, Stack, Table, TableBody, TableContainer, TextField } from "@mui/material";
import BottomFab from "@src/components/atoms/BottomFab";
import EditableRow from "@src/components/molecules/EditableRow";
import SortableHead from "@src/components/molecules/SortableHead";
import ConfirmDialog from "@src/components/organisms/ConfirmDialog";
import useDelete from "@src/repository/useDelete.ts";
import useProducts from "@src/repository/useProducts.ts";
import { setProductToDeleteId, setProductToEdit } from "@src/store/GlobalSlice.ts";
import { useAppDispatch, useAppSelector } from "@src/store/store.ts";
import { PRODUCT_TYPE } from "@src/utils/constants.ts";
import { includesString } from "@src/utils/functions.ts";
import useSortedData from "@src/utils/hooks/useSortedData.ts";
import routes from "@src/utils/routes.ts";
import { MappedProduct } from "@src/utils/types.ts";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const COLUMNS = [
  "name",
  "calories",
  "caloriesPer100g",
  "proteins",
  "fats",
  "carbohydrates",
  "portion",
  "type",
] satisfies (keyof MappedProduct)[];

function ProductList() {
  const { t } = useTranslation(["ProductList", "ProductForm"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { productToDeleteId } = useAppSelector((state) => state.global);
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const { data } = useProducts();
  const { mutate: deleteProduct } = useDelete("products");
  const filteredProducts = data.filter((product) => {
    const nameFilterMatches = includesString(product.name, nameFilter);
    const typeFilterMatches = typeFilter === "" || product.type === typeFilter;
    return nameFilterMatches && typeFilterMatches;
  });
  const {
    sortedData: sortedProducts,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
  } = useSortedData(filteredProducts, "name");

  return (
    <>
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
            alignLeftColumns={["name", "type"]}
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
                data={{ ...product, type: t(`ProductForm:${product.type as "proteins"}`) }}
                onEdit={() => {
                  dispatch(setProductToEdit(product));
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
          dispatch(setProductToEdit(null));
          navigate(routes.productForm);
        }}
      >
        <AddIcon />
      </BottomFab>
    </>
  );
}

export default ProductList;
