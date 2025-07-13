import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import useInsertDish from "@src/repository/useInsertDish.ts";
import useProducts from "@src/repository/useProducts.ts";
import useRecipes from "@src/repository/useRecipes.ts";
import { useAppSelector } from "@src/store/store.ts";
import { GRAMS } from "@src/utils/constants.ts";
import routes from "@src/utils/routes.ts";
import { MappedProduct } from "@src/utils/types.ts";
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
  const [ingredientId, setIngredientId] = useState("");
  const [ingredientAmount, setIngredientAmount] = useState<number | undefined>();
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
  const { data: products } = useProducts();
  const { mutate: insertDish } = useInsertDish({ onSuccess: () => navigate(routes.calendar) });

  const name = watch("name");
  const ingredients = watch("ingredients");

  const calculateMacro = (field: "calories" | "proteins" | "fats" | "carbohydrates") =>
    ingredients.reduce((sum, { product, amount, included }) => {
      if (!included) return sum;
      return sum + product[field] * (amount / product.portion);
    }, 0);

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

      <Dialog open={addIngredientDialogOpen} onClose={() => setAddIngredientDialogOpen(false)} fullWidth>
        <DialogTitle>{t("addIngredient")}</DialogTitle>
        <DialogContent>
          <Stack sx={{ gap: 2, mt: 1 }}>
            <TextField
              select
              fullWidth
              label={t("product")}
              value={ingredientId}
              onChange={(event) => {
                setIngredientId(event.target.value);
                const product = products.find((product) => product.id === Number(event.target.value));
                if (product) setIngredientAmount(product.portion);
              }}
            >
              {products
                .filter((p) => !fields.find(({ product }) => product.id === p.id))
                .map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
            </TextField>
            <NumericFormat
              customInput={TextField}
              suffix={GRAMS}
              fullWidth
              label={t("amount")}
              value={ingredientAmount}
              onValueChange={({ floatValue }) => setIngredientAmount(floatValue)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              const product = products.find((product) => product.id === Number(ingredientId));
              if (!product || !ingredientAmount) return;
              append({ product, amount: ingredientAmount, included: true });
              setAddIngredientDialogOpen(false);
              setIngredientId("");
              setIngredientAmount(undefined);
            }}
          >
            {t("Shared:add")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default DishForm;
