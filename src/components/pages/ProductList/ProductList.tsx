import BottomFab from "@src/components/atoms/BottomFab";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import routes from "@src/utils/routes.ts";
import useProducts from "@src/repository/useProducts.ts";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import { useTranslation } from "react-i18next";
import { MappedProduct } from "@src/utils/types.ts";
import EditableRow from "@src/components/molecules/EditableRow";
import { useAppDispatch, useAppSelector } from "@src/store/store.ts";
import { setProductToDeleteId, setProductToEdit } from "@src/store/GlobalSlice.ts";
import ConfirmDialog from "@src/components/organisms/ConfirmDialog";
import useDelete from "@src/repository/useDelete.ts";
import useSortedData from "@src/utils/hooks/useSortedData.ts";
import SortableHead from "@src/components/molecules/SortableHead";
import { Dispatch, SetStateAction } from "react";

const COLUMNS = ["name", "calories", "proteins", "fats", "carbohydrates", "portion"] satisfies (keyof MappedProduct)[];

function ProductList() {
  const { t } = useTranslation("ProductList");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { productToDeleteId } = useAppSelector((state) => state.global);
  const { data } = useProducts();
  const { mutate: deleteProduct } = useDelete("products");
  const { sortedData: sortedProducts, sortBy, setSortBy, sortDir, setSortDir } = useSortedData(data, "name");

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <SortableHead
            columns={COLUMNS}
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
                data={product}
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
      <BottomFab onClick={() => navigate(routes.productForm)}>
        <AddIcon />
      </BottomFab>
    </>
  );
}

export default ProductList;
