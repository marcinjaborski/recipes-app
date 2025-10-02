import AddIcon from "@mui/icons-material/Add";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Fab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import MacroTable from "@src/components/molecules/MacroTable/MacroTable.tsx";
import ProductDialog from "@src/components/organisms/ProductDialog";
import useInsertDish from "@src/repository/useInsertDish.ts";
import useRecipes from "@src/repository/useRecipes.ts";
import { useAppSelector } from "@src/store/store.ts";
import { GRAMS, MEAL_TIME, MULTIPLIER, PRODUCT_TYPE } from "@src/utils/constants.ts";
import { calculateMacro, formatCurrency, getTagFromProducts } from "@src/utils/functions.ts";
import useSortedDataByRecord from "@src/utils/hooks/useSortedDataByRecord.ts";
import routes from "@src/utils/routes.ts";
import { MappedProduct } from "@src/utils/types.ts";
import _ from "lodash";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";

type IngredientData = {
  product: MappedProduct;
  amount: number;
  multiplier: number;
  included: boolean;
};

export type DishFormData = {
  name: string;
  ingredients: IngredientData[];
};

function DishForm() {
  const { t } = useTranslation(["DishForm", "Shared"]);
  const navigate = useNavigate();
  const { date, mealTime } = useAppSelector((state) => state.dish);
  const [addIngredientDialogOpen, setAddIngredientDialogOpen] = useState(false);
  const { control, watch, handleSubmit } = useForm<DishFormData>({
    defaultValues: {
      name: "",
      ingredients: [],
    },
  });
  const { fields, replace, append } = useFieldArray({
    control,
    name: "ingredients",
  });
  const { data: recipes } = useRecipes();
  const sortedRecipes = useSortedDataByRecord(recipes, "recommendedMealTime", MEAL_TIME);
  const { mutate: insertDish } = useInsertDish({ onSuccess: () => navigate(routes.calendar) });

  const name = watch("name");
  const ingredients = watch("ingredients");

  useEffect(() => {
    const baseRecipe = recipes.find((recipe) => recipe.name === name);
    if (!baseRecipe) return;
    replace(
      baseRecipe.ingredients.map((ingredient) => ({
        product: ingredient.product,
        amount: ingredient.amount,
        multiplier: ingredient.multiplier,
        included: ingredient.defaultIncluded,
      })),
    );
  }, [recipes, name, replace]);

  const onSubmit = (data: DishFormData) => {
    insertDish({
      name: data.name,
      calories: calculateMacro("calories", ingredients),
      proteins: calculateMacro("proteins", ingredients),
      fats: calculateMacro("fats", ingredients),
      saturatedFats: calculateMacro("saturatedFats", ingredients),
      carbohydrates: calculateMacro("carbohydrates", ingredients),
      sugar: calculateMacro("sugar", ingredients),
      fiber: calculateMacro("fiber", ingredients),
      salt: calculateMacro("salt", ingredients),
      vegetables: _.sumBy(
        ingredients.filter(
          (ingredient) =>
            ingredient.included &&
            (ingredient.product.type === PRODUCT_TYPE.fruit || ingredient.product.type === PRODUCT_TYPE.vegetable),
        ),
        "amount",
      ),
      ingredients: ingredients
        .filter(({ included }) => included)
        .map(({ product, amount, multiplier }) => ({ product: product.name, amount: amount * multiplier })),
      date,
      mealTime,
      tag: getTagFromProducts(ingredients.map(({ product }) => product)),
    });
  };

  return (
    <Stack component="form" spacing={2} sx={{ p: 3, minHeight: "100%" }} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"
        rules={{ required: true }}
        render={({ field, fieldState: { error } }) => (
          <Autocomplete
            inputValue={field.value}
            onInputChange={(_, newValue) => field.onChange(newValue)}
            renderInput={(params) => <TextField {...params} error={!!error} label={t("recipe")} />}
            options={sortedRecipes.map((recipe) => recipe.name)}
          />
        )}
      />

      {name ? (
        <>
          <Chip label={`${t("Shared:cost")}: ${formatCurrency(calculateMacro("cost", ingredients))}`}></Chip>
          <MacroTable
            calories={calculateMacro("calories", ingredients)}
            proteins={calculateMacro("proteins", ingredients)}
            fats={calculateMacro("fats", ingredients)}
            carbohydrates={calculateMacro("carbohydrates", ingredients)}
            extra={{
              saturatedFats: calculateMacro("saturatedFats", ingredients),
              sugar: calculateMacro("sugar", ingredients),
              fiber: calculateMacro("fiber", ingredients),
              salt: calculateMacro("salt", ingredients),
            }}
          />
        </>
      ) : null}

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
            <Stack direction="row" sx={{ gap: 1 }}>
              <Controller
                control={control}
                name={`ingredients.${index}.multiplier` as const}
                render={({ field: { value, onChange } }) => (
                  <NumericFormat
                    customInput={TextField}
                    variant="standard"
                    suffix={MULTIPLIER}
                    sx={{ width: 40 }}
                    value={value}
                    onValueChange={({ floatValue }) => onChange(floatValue || "")}
                  />
                )}
              />
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
                    onValueChange={({ floatValue }) => onChange(floatValue || "")}
                  />
                )}
              />
            </Stack>
          </ListItem>
        ))}
        {name ? (
          <ListItem sx={{ justifyContent: "center", order: 9999 }}>
            <Fab size="small" onClick={() => setAddIngredientDialogOpen(true)}>
              <AddIcon />
            </Fab>
          </ListItem>
        ) : null}
      </List>

      <Box sx={{ flex: 1 }} />

      <Button type="submit" variant="contained" sx={{ alignSelf: "center" }}>
        {t("Shared:create")}
      </Button>

      <ProductDialog
        open={addIngredientDialogOpen}
        setOpen={setAddIngredientDialogOpen}
        onAdd={(product, amount, multiplier) => append({ product, amount, multiplier, included: true })}
        filterProducts={(p) => !fields.find(({ product }) => product.id === p.id)}
      />
    </Stack>
  );
}

export default DishForm;
