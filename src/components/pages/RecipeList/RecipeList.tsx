import AddIcon from "@mui/icons-material/Add";
import { MenuItem, Paper, Stack, Table, TableBody, TableContainer, TextField } from "@mui/material";
import BottomFab from "@src/components/atoms/BottomFab";
import TagIcon from "@src/components/atoms/TagIcon";
import EditableRow from "@src/components/molecules/EditableRow";
import SortableHead from "@src/components/molecules/SortableHead";
import ConfirmDialog from "@src/components/organisms/ConfirmDialog";
import useDelete from "@src/repository/useDelete.ts";
import useRecipes from "@src/repository/useRecipes.ts";
import { setRecipeToDeleteId, setRecipeToEdit } from "@src/store/GlobalSlice.ts";
import { useAppDispatch, useAppSelector } from "@src/store/store.ts";
import { MEAL_TIME } from "@src/utils/constants.ts";
import { formatCurrency, includesString } from "@src/utils/functions.ts";
import useSortedData from "@src/utils/hooks/useSortedData.ts";
import routes from "@src/utils/routes.ts";
import { MappedRecipe } from "@src/utils/types.ts";
import { DateTime } from "luxon";
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
  "cost",
  "recommendedMealTime",
  "lastUsedDate",
] satisfies (keyof MappedRecipe)[];

function RecipeList() {
  const { t } = useTranslation(["RecipeList", "RecipeForm"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { recipeToDeleteId } = useAppSelector((state) => state.global);
  const [nameFilter, setNameFilter] = useState("");
  const [recommendedMealTimeFilter, setRecommendedMealTimeFilter] = useState("");
  const { data } = useRecipes();
  const { mutate: deleteRecipe } = useDelete("recipes");
  const filteredRecipes = data.filter((recipe) => {
    const nameFilterMatches =
      includesString(recipe.name, nameFilter) ||
      !!recipe.ingredients.find((ingredient) => includesString(ingredient.product.name, nameFilter));
    const recommendedMealTimeFilterMatches =
      recommendedMealTimeFilter === "" || recipe.recommendedMealTime === recommendedMealTimeFilter;
    return nameFilterMatches && recommendedMealTimeFilterMatches;
  });
  const { sortedData: sortedRecipes, sortBy, setSortBy, sortDir, setSortDir } = useSortedData(filteredRecipes, "name");

  return (
    <>
      <Stack direction="row" sx={{ p: 1, gap: 1 }}>
        <TextField fullWidth label={t("search")} value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
        <TextField
          select
          fullWidth
          label={t("recommendedMealTime")}
          value={recommendedMealTimeFilter}
          onChange={(e) => setRecommendedMealTimeFilter(e.target.value)}
        >
          {Object.values(MEAL_TIME).map((mealTime) => (
            <MenuItem key={mealTime} value={mealTime}>
              {t(`RecipeForm:${mealTime}`)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <SortableHead
            columns={COLUMNS}
            alignLeftColumns={["name", "recommendedMealTime", "cost"]}
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
                data={{
                  ...recipe,
                  tag: <TagIcon tag={recipe.tag} />,
                  cost: formatCurrency(recipe.cost),
                  recommendedMealTime: t(`RecipeForm:${recipe.recommendedMealTime}`),
                  lastUsedDate: recipe.lastUsedDate ? DateTime.fromISO(recipe.lastUsedDate).toLocaleString() : "",
                }}
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
