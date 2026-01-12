import AddIcon from "@mui/icons-material/Add";
import LoopIcon from "@mui/icons-material/Loop";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SpicesInfo from "@src/components/atoms/SpicesInfo/SpicesInfo.tsx";
import MacroTable from "@src/components/molecules/MacroTable/MacroTable.tsx";
import ProductDialog from "@src/components/organisms/ProductDialog";
import useInsertDish from "@src/repository/useInsertDish.ts";
import useProducts from "@src/repository/useProducts.ts";
import useRecipes from "@src/repository/useRecipes.ts";
import { useAppSelector } from "@src/store/store.ts";
import { INGREDIENT_MEASURE, IngredientMeasure, MEAL_TIME, PRODUCT_TYPE } from "@src/utils/constants.ts";
import {
  calculateAmount,
  calculateMacro,
  formatCurrency,
  getTagFromProducts,
  notNullish,
} from "@src/utils/functions.ts";
import useSortedDataByRecord from "@src/utils/hooks/useSortedDataByRecord.ts";
import routes from "@src/utils/routes.ts";
import supabase from "@src/utils/supabase.ts";
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
  ingredientMeasure: IngredientMeasure;
  included: boolean;
};

export type DishFormData = {
  name: string;
  ingredients: IngredientData[];
};

function DishForm() {
  const { t } = useTranslation(["DishForm", "IngredientMeasure", "Shared"]);
  const navigate = useNavigate();
  const { date, mealTime, dishToEdit } = useAppSelector((state) => state.dish);
  const [addIngredientDialogOpen, setAddIngredientDialogOpen] = useState(false);
  const [ingredientToReplaceIndex, setIngredientToReplaceIndex] = useState<number | null>(null);
  const { control, watch, handleSubmit } = useForm<DishFormData>({
    defaultValues: {
      name: dishToEdit?.name || "",
      ingredients: [],
    },
  });
  const { fields, replace, append, update } = useFieldArray({
    control,
    name: "ingredients",
  });
  const { data: products } = useProducts();
  const { data: recipes } = useRecipes();
  const sortedRecipes = useSortedDataByRecord(recipes, "recommendedMealTime", MEAL_TIME);
  const { mutate: insertDish } = useInsertDish({
    onSuccess: async () => {
      const baseRecipe = recipes.find((recipe) => recipe.name === name);
      if (!baseRecipe) return;
      await supabase.from("recipes").update({ lastUsedDate: date }).eq("id", baseRecipe.id);
      navigate(routes.calendar);
    },
  });

  const name = watch("name");
  const ingredients = watch("ingredients");

  const spices = fields.filter((field) => field.product.type === PRODUCT_TYPE.spice).map((field) => field.product.name);

  useEffect(() => {
    const baseRecipe = recipes.find((recipe) => recipe.name === name);
    if (!baseRecipe || dishToEdit) return;
    replace(
      baseRecipe.ingredients.map((ingredient) => ({
        product: ingredient.product,
        amount: ingredient.amount,
        ingredientMeasure: ingredient.ingredientMeasure,
        included: ingredient.defaultIncluded,
      })),
    );
  }, [recipes, name, replace, dishToEdit]);

  useEffect(() => {
    if (dishToEdit === null) return;
    replace(
      dishToEdit.ingredients
        .map((ingredient) => {
          const product = products.find((product) => product.id === ingredient.id);
          if (!product) return;
          return {
            product,
            amount: Number(ingredient.amount),
            ingredientMeasure: INGREDIENT_MEASURE.gram,
            included: true,
          };
        })
        .filter(notNullish),
    );
  }, [dishToEdit, products, replace]);

  const onSubmit = (data: DishFormData) => {
    insertDish({
      id: dishToEdit?.id,
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
        .map(({ product, amount, ingredientMeasure }) => ({
          id: product.id,
          product: product.name,
          amount: calculateAmount(amount, product.portion, ingredientMeasure),
          type: product.type,
        })),
      date,
      mealTime,
      tag: getTagFromProducts(ingredients.map(({ product }) => product)),
    });
  };

  return (
    <Stack component="form" spacing={2} sx={{ p: 3, minHeight: "100%" }} onSubmit={handleSubmit(onSubmit)}>
      {!dishToEdit ? (
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
      ) : (
        <Typography variant="h5">{dishToEdit.name}</Typography>
      )}

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
          <ListItem
            key={field.id}
            disablePadding
            sx={{ display: field.product.type === PRODUCT_TYPE.spice ? "none" : undefined }}
          >
            <ListItemIcon>
              <Controller
                control={control}
                name={`ingredients.${index}.included` as const}
                render={({ field }) => <Checkbox checked={field.value} {...field} />}
              />
            </ListItemIcon>
            <ListItemText primary={field.product.name} />
            <Stack direction="row" sx={{ gap: 1 }}>
              <IconButton onClick={() => setIngredientToReplaceIndex(index)}>
                <LoopIcon />
              </IconButton>
              <Controller
                control={control}
                name={`ingredients.${index}.amount` as const}
                render={({ field: { value, onChange } }) => (
                  <NumericFormat
                    customInput={TextField}
                    variant="standard"
                    sx={{ width: 50 }}
                    value={value}
                    onValueChange={({ floatValue }) => onChange(floatValue || "")}
                  />
                )}
              />
              <Controller
                control={control}
                name={`ingredients.${index}.ingredientMeasure` as const}
                render={({ field: { value, onChange } }) => (
                  <Select
                    variant="standard"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    sx={{ height: 32 }}
                  >
                    {Object.values(INGREDIENT_MEASURE).map((measure) => (
                      <MenuItem key={measure} value={measure}>
                        {t(`IngredientMeasure:${measure}`)}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </Stack>
          </ListItem>
        ))}
        <SpicesInfo spices={spices} />
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
        onAdd={(product, amount, ingredientMeasure) => append({ product, amount, ingredientMeasure, included: true })}
        filterProducts={(p) => !fields.find(({ product }) => product.id === p.id)}
      />

      <ProductDialog
        open={ingredientToReplaceIndex !== null}
        setOpen={() => setIngredientToReplaceIndex(null)}
        title={t("replaceProduct")}
        onAdd={(product, amount, ingredientMeasure) => {
          if (ingredientToReplaceIndex === null) return;
          update(ingredientToReplaceIndex, { product, amount, ingredientMeasure, included: true });
        }}
        filterProducts={(p) =>
          ingredientToReplaceIndex ? fields[ingredientToReplaceIndex].product.type === p.type : true
        }
      />
    </Stack>
  );
}

export default DishForm;
