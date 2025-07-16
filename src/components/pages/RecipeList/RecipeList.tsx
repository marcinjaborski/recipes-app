import AddIcon from "@mui/icons-material/Add";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import BottomFab from "@src/components/atoms/BottomFab";
import EditableRow from "@src/components/molecules/EditableRow";
import SortableHead from "@src/components/molecules/SortableHead";
import ConfirmDialog from "@src/components/organisms/ConfirmDialog";
import useDelete from "@src/repository/useDelete.ts";
import useRecipes from "@src/repository/useRecipes.ts";
import { setRecipeToDeleteId, setRecipeToEdit } from "@src/store/GlobalSlice.ts";
import { useAppDispatch, useAppSelector } from "@src/store/store.ts";
import useSortedData from "@src/utils/hooks/useSortedData.ts";
import routes from "@src/utils/routes.ts";
import { MappedRecipe } from "@src/utils/types.ts";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const COLUMNS = [
  "name",
  "calories",
  "proteins",
  "fats",
  "carbohydrates",
  "recommendedMealTime",
] satisfies (keyof MappedRecipe)[];

function RecipeList() {
  const { t } = useTranslation(["RecipeList", "RecipeForm"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { recipeToDeleteId } = useAppSelector((state) => state.global);
  const { data } = useRecipes();
  const { mutate: deleteRecipe } = useDelete("recipes");
  const { sortedData: sortedRecipes, sortBy, setSortBy, sortDir, setSortDir } = useSortedData(data, "name");

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <SortableHead
            columns={COLUMNS}
            alignLeftColumns={["name", "recommendedMealTime"]}
            columnNames={Object.fromEntries(COLUMNS.map((column) => [column, t(column)]))}
            sortBy={sortBy}
            setSortBy={setSortBy as Dispatch<SetStateAction<string>>}
            sortDir={sortDir}
            setSortDir={setSortDir}
          />
          <TableBody>
            {sortedRecipes.map((recipe) => (
              <EditableRow
                key={recipe.id}
                columns={COLUMNS}
                data={{ ...recipe, recommendedMealTime: t(`RecipeForm:${recipe.recommendedMealTime}`) }}
                onEdit={() => {
                  dispatch(setRecipeToEdit(recipe));
                  navigate(routes.recipesFormUpdate);
                }}
                onDelete={() => dispatch(setRecipeToDeleteId(recipe.id))}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        title={t("confirmDelete")}
        open={recipeToDeleteId !== null}
        onCancel={() => dispatch(setRecipeToDeleteId(null))}
        onConfirm={() => {
          if (recipeToDeleteId) deleteRecipe(recipeToDeleteId);
          dispatch(setRecipeToDeleteId(null));
        }}
      />
      <BottomFab
        onClick={() => {
          dispatch(setRecipeToEdit(null));
          navigate(routes.recipesForm);
        }}
      >
        <AddIcon />
      </BottomFab>
    </>
  );
}

export default RecipeList;
