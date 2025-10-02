import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Chip, Fab, IconButton, List, ListItem, ListItemText, MenuItem, Stack } from "@mui/material";
import ControlledTextField from "@src/components/atoms/ControlledTextField";
import DraggableListItem from "@src/components/molecules/DraggableListItem";
import MacroTable from "@src/components/molecules/MacroTable/MacroTable.tsx";
import ProductDialog from "@src/components/organisms/ProductDialog";
import useUpsertRecipe from "@src/repository/useUpsertRecipe.ts";
import { setRecipeToEdit } from "@src/store/GlobalSlice.ts";
import { useAppDispatch, useAppSelector } from "@src/store/store.ts";
import { GRAMS, MEAL_TIME, MULTIPLIER } from "@src/utils/constants.ts";
import { Enums } from "@src/utils/database.types.ts";
import { calculateMacro, formatCurrency } from "@src/utils/functions.ts";
import routes from "@src/utils/routes.ts";
import { MappedProduct } from "@src/utils/types.ts";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export type RecipeFormData = {
  name: string;
  instruction: string;
  recommendedMealTime: Enums<"mealTime">;
};

export type IngredientFormData = [MappedProduct, number, number, boolean];

function RecipeForm() {
  const { t } = useTranslation(["RecipeForm", "Shared"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { recipeToEdit } = useAppSelector((state) => state.global);
  const [ingredients, setIngredients] = useState<IngredientFormData[]>(
    !recipeToEdit
      ? []
      : recipeToEdit.ingredients.map((ingredient) => [
          ingredient.product,
          ingredient.amount,
          ingredient.multiplier,
          ingredient.defaultIncluded,
        ]),
  );
  const [ingredientDialogOpen, setIngredientDialogOpen] = useState(false);
  const { control, handleSubmit } = useForm<RecipeFormData>({
    defaultValues: recipeToEdit
      ? {
          name: recipeToEdit.name,
          instruction: recipeToEdit.instruction,
          recommendedMealTime: recipeToEdit.recommendedMealTime,
        }
      : {
          name: "",
          instruction: "",
          recommendedMealTime: MEAL_TIME.breakfast,
        },
  });
  const { mutate: upsertRecipe } = useUpsertRecipe({ onSuccess: () => navigate(routes.recipesList) });

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || over.id === active.id) return;
    const oldIndex = ingredients.findIndex((ing) => ing[0].id === active.id);
    const newIndex = ingredients.findIndex((ing) => ing[0].id === over.id);
    setIngredients(arrayMove(ingredients, oldIndex, newIndex));
  };

  const onSubmit = async (data: RecipeFormData) => {
    upsertRecipe([recipeToEdit ? { id: recipeToEdit.id, ...data } : data, ingredients]);
    dispatch(setRecipeToEdit(null));
  };

  const ingredientsForMacro = ingredients.map(([product, amount, multiplier, included]) => ({
    product,
    amount,
    multiplier,
    included,
  }));

  return (
    <Stack component="form" spacing={2} sx={{ p: 3, minHeight: "100%" }} onSubmit={handleSubmit(onSubmit)}>
      <ControlledTextField control={control} name="name" label={t("name")} rules={{ required: true }} />
      <ControlledTextField multiline control={control} name="instruction" label={t("instruction")} />
      <Stack direction="row" alignItems="center" gap={1}>
        <ControlledTextField
          select
          control={control}
          name="recommendedMealTime"
          label={t("recommendedMealTime")}
          rules={{ required: true }}
        >
          {Object.values(MEAL_TIME).map((mealTime) => (
            <MenuItem key={mealTime} value={mealTime}>
              <ListItemText>{t(mealTime)}</ListItemText>
            </MenuItem>
          ))}
        </ControlledTextField>
        <Chip label={`${t("Shared:cost")}: ${formatCurrency(calculateMacro("cost", ingredientsForMacro))}`}></Chip>
      </Stack>

      <MacroTable
        calories={calculateMacro("calories", ingredientsForMacro)}
        proteins={calculateMacro("proteins", ingredientsForMacro)}
        fats={calculateMacro("fats", ingredientsForMacro)}
        carbohydrates={calculateMacro("carbohydrates", ingredientsForMacro)}
        extra={{
          saturatedFats: calculateMacro("saturatedFats", ingredientsForMacro),
          sugar: calculateMacro("sugar", ingredientsForMacro),
          fiber: calculateMacro("fiber", ingredientsForMacro),
          salt: calculateMacro("salt", ingredientsForMacro),
        }}
      />

      <DndContext onDragEnd={onDragEnd}>
        <SortableContext items={ingredients.map((ingredient) => ({ id: ingredient[0].id }))}>
          <Stack direction="row" spacing={2}>
            <List sx={{ flex: 1 }}>
              {ingredients.length === 0 ? (
                <ListItem sx={{ fontStyle: "italic" }}>
                  <ListItemText primary={t("noIngredients")} secondary="&nbsp;" />
                </ListItem>
              ) : null}
              {ingredients.map(([ingredient, portion, multiplier, defaultIncluded], index) => (
                <DraggableListItem
                  key={ingredient.name}
                  item={{
                    id: ingredient.id,
                    primary: ingredient.name,
                    secondary: `${multiplier}${MULTIPLIER} ${portion}${GRAMS}`,
                    listItemProps: {
                      secondaryAction: (
                        <IconButton
                          edge="end"
                          onClick={() => {
                            setIngredients((prevState) => {
                              const copy = [...prevState];
                              copy.splice(index, 1);
                              return copy;
                            });
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      ),
                      sx: { fontStyle: !defaultIncluded ? "italic" : null, color: !defaultIncluded ? "gray" : null },
                    },
                  }}
                />
              ))}
            </List>
            <Box>
              <Fab onClick={() => setIngredientDialogOpen(true)} size="small" color="primary" sx={{ mt: 3.5 }}>
                <AddIcon />
              </Fab>
            </Box>
          </Stack>
        </SortableContext>
      </DndContext>

      <Box sx={{ flex: 1 }} />

      <Button type="submit" variant="contained" sx={{ alignSelf: "center" }}>
        {recipeToEdit ? t("Shared:edit") : t("Shared:create")}
      </Button>

      <ProductDialog
        open={ingredientDialogOpen}
        setOpen={setIngredientDialogOpen}
        includedCheckbox
        checkboxLabel={t("defaultIncluded")}
        onAdd={(product, amount, multiplier, included) => {
          setIngredients((prevState) => [...prevState, [product, amount, multiplier, included]]);
        }}
      />
    </Stack>
  );
}

export default RecipeForm;
