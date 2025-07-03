import BottomFab from "@src/components/atoms/BottomFab";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import routes from "@src/utils/routes.ts";
import useProducts from "@src/repository/useProducts.ts";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { MappedProduct, SortDir } from "@src/utils/types.ts";
import EditableRow from "@src/components/molecules/EditableRow";
import { useAppDispatch, useAppSelector } from "@src/store/store.ts";
import { setProductToDeleteId, setProductToEdit } from "@src/store/GlobalSlice.ts";
import ConfirmDialog from "@src/components/organisms/ConfirmDialog";
import useDelete from "@src/repository/useDelete.ts";

const COLUMNS = ["name", "calories", "proteins", "fats", "carbohydrates", "portion"] satisfies (keyof MappedProduct)[];

function ProductList() {
  const { t } = useTranslation("ProductList");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { productToDeleteId } = useAppSelector((state) => state.global);
  const { data } = useProducts();
  const { mutate: deleteProduct } = useDelete("products");
  const [sortBy, setSortBy] = useState<keyof MappedProduct>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sortedProducts = useMemo(() => {
    const products = [...data];
    products.sort((a, b) => {
      if (sortDir === "desc") {
        const temp = a;
        a = b;
        b = temp;
      }
      if (typeof a[sortBy] === "string" && typeof b[sortBy] === "string") return a[sortBy].localeCompare(b[sortBy]);
      if (typeof a[sortBy] === "number" && typeof b[sortBy] === "number") return a[sortBy] - b[sortBy];
      return 0;
    });
    return products;
  }, [data, sortBy, sortDir]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {COLUMNS.map((columnName) => (
                <TableCell key={columnName} align={columnName !== "name" ? "right" : "inherit"}>
                  <TableSortLabel
                    active={sortBy === columnName}
                    direction={sortDir}
                    onClick={() => {
                      if (sortBy === columnName) setSortDir((prevState) => (prevState === "asc" ? "desc" : "asc"));
                      else {
                        setSortBy(columnName);
                        setSortDir("asc");
                      }
                    }}
                  >
                    {t(columnName)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
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
