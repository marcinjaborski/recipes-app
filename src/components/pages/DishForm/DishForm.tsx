import {
  Box,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import ControlledTextField from "@src/components/atoms/ControlledTextField";
import useRecipes from "@src/repository/useRecipes.ts";
import { GRAMS } from "@src/utils/constants.ts";
import { Enums } from "@src/utils/database.types.ts";
import { MappedProduct } from "@src/utils/types.ts";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";

type IngredientData = {
  product: MappedProduct;
  amount: number;
  included: boolean;
};

export type DishFormData = {
  name: string;
  calories: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
  date: string;
  ingredients: IngredientData[];
  mealTime: Enums<"mealTime">;
};

function DishForm() {
  const { t } = useTranslation(["DishForm", "Shared"]);
  const { control, watch, handleSubmit } = useForm<DishFormData>({
    defaultValues: {
      name: "",
      ingredients: [],
    },
  });
  const { fields, replace } = useFieldArray({
    control,
    name: "ingredients",
  });
  const { data: recipes } = useRecipes();

  const name = watch("name");

  useEffect(() => {
    const baseRecipe = recipes.find((recipe) => recipe.name === name);
    if (!baseRecipe) return;
    replace(
      baseRecipe.ingredients.map((ingredient) => ({
        product: ingredient.product,
        amount: ingredient.amount,
        included: ingredient.defaultIncluded,
      })),
    );
  }, [recipes, name, replace]);

  const onSubmit = (data: DishFormData) => {
    console.log(data);
  };

  return (
    <Stack component="form" spacing={2} sx={{ p: 3, height: "100%" }} onSubmit={handleSubmit(onSubmit)}>
      <ControlledTextField control={control} name="name" label={t("recipe")} select rules={{ required: true }}>
        {recipes.map((recipe) => (
          <MenuItem key={recipe.id} value={recipe.name}>
            {recipe.name}
          </MenuItem>
        ))}
      </ControlledTextField>

      <List disablePadding>
        {fields.map((field, index) => (
          <ListItem key={field.id} disablePadding>
            <ListItemIcon>
              <Controller
                control={control}
                name={`ingredients.${index}.included` as const}
                render={({ field }) => <Checkbox checked={field.value} {...field} />}
              />
            </ListItemIcon>
            <ListItemText primary={field.product.name} />
            <Controller
              control={control}
              name={`ingredients.${index}.amount` as const}
              render={({ field: { value, onChange } }) => (
                <NumericFormat
                  customInput={TextField}
                  variant="standard"
                  suffix={GRAMS}
                  sx={{ width: 50 }}
                  value={value}
                  onValueChange={({ floatValue }) => onChange(floatValue)}
                />
              )}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ flex: 1 }} />

      <Button type="submit" variant="contained" sx={{ alignSelf: "center" }}>
        {t("Shared:create")}
      </Button>
    </Stack>
  );
}

export default DishForm;
