import { Box, Button, ListItemText, MenuItem, Stack } from "@mui/material";
import ControlledTextField from "@src/components/atoms/ControlledTextField";
import { Enums } from "@src/utils/database.types.ts";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@src/store/store.ts";
import { useForm } from "react-hook-form";
import useUpsert from "@src/repository/useUpsert.ts";
import routes from "@src/utils/routes.ts";
import { setRecipeToEdit } from "@src/store/GlobalSlice.ts";
import { MEAL_TIME } from "@src/utils/constants.ts";

export type RecipeFormData = {
  name: string;
  instruction: string;
  recommendedMealTime: Enums<"mealTime">;
};

function RecipeForm() {
  const { t } = useTranslation(["RecipeForm", "Shared"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { recipeToEdit } = useAppSelector((state) => state.global);
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
  const { mutate: upsertRecipe } = useUpsert("recipes", { onSuccess: () => navigate(routes.recipesList) });
  const onSubmit = (data: RecipeFormData) => {
    upsertRecipe(recipeToEdit ? { id: recipeToEdit.id, ...data } : data);
    dispatch(setRecipeToEdit(null));
  };

  return (
    <Stack component="form" spacing={2} sx={{ p: 3, height: "100%" }} onSubmit={handleSubmit(onSubmit)}>
      <ControlledTextField control={control} name="name" label={t("name")} rules={{ required: true }} />
      <ControlledTextField multiline control={control} name="instruction" label={t("instruction")} />
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

      <Box sx={{ flex: 1 }} />

      <Button type="submit" variant="contained" sx={{ alignSelf: "center" }}>
        {recipeToEdit ? t("Shared:edit") : t("Shared:create")}
      </Button>
    </Stack>
  );
}

export default RecipeForm;
