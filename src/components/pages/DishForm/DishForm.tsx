import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Checkbox,
  Fab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import ControlledTextField from "@src/components/atoms/ControlledTextField";
import MacroTable from "@src/components/molecules/MacroTable/MacroTable.tsx";
import ProductDialog from "@src/components/organisms/ProductDialog";
import useInsertDish from "@src/repository/useInsertDish.ts";
import useRecipes from "@src/repository/useRecipes.ts";
import { useAppSelector } from "@src/store/store.ts";
import { GRAMS } from "@src/utils/constants.ts";
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
  const { mutate: insertDish } = useInsertDish({ onSuccess: () => navigate(routes.calendar) });

  const name = watch("name");
  const ingredients = watch("ingredients");

  const calculateMacro = (field: "calories" | "proteins" | "fats" | "carbohydrates") =>
    _.round(
      ingredients.reduce((sum, { product, amount, included }) => {
        if (!included) return sum;
        return sum + product[field] * (amount / product.portion);
      }, 0),
      field === "calories" ? 0 : 1,
    );

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
    insertDish({
      name: data.name,
      calories: calculateMacro("calories"),
      proteins: calculateMacro("proteins"),
      fats: calculateMacro("fats"),
      carbohydrates: calculateMacro("carbohydrates"),
      date,
      mealTime,
    });
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

      {name ? (
        <MacroTable
          calories={calculateMacro("calories")}
          proteins={calculateMacro("proteins")}
          fats={calculateMacro("fats")}
          carbohydrates={calculateMacro("carbohydrates")}
        />
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
        {name ? (
          <ListItem sx={{ justifyContent: "center" }}>
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
        onAdd={(product, amount) => append({ product, amount, included: true })}
        filterProducts={(p) => !fields.find(({ product }) => product.id === p.id)}
      />
    </Stack>
  );
}

export default DishForm;
