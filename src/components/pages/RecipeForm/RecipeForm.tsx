import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ControlledTextField from "@src/components/atoms/ControlledTextField";
import { Enums } from "@src/utils/database.types.ts";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@src/store/store.ts";
import { useForm } from "react-hook-form";
import routes from "@src/utils/routes.ts";
import { setRecipeToEdit } from "@src/store/GlobalSlice.ts";
import { GRAMS, MEAL_TIME } from "@src/utils/constants.ts";
import { useState } from "react";
import { MappedProduct } from "@src/utils/types.ts";
import useProducts from "@src/repository/useProducts.ts";
import AddIcon from "@mui/icons-material/Add";
import { NumericFormat } from "react-number-format";
import useUpsertRecipe from "@src/repository/useUpsertRecipe.ts";
import CloseIcon from "@mui/icons-material/Close";
import { Grid } from "@mui/system";

export type RecipeFormData = {
  name: string;
  instruction: string;
  recommendedMealTime: Enums<"mealTime">;
};

export type IngredientFormData = [MappedProduct, number, boolean];

function RecipeForm() {
  const { t } = useTranslation(["RecipeForm", "Shared"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: products } = useProducts();
  const { recipeToEdit } = useAppSelector((state) => state.global);
  const [ingredients, setIngredients] = useState<IngredientFormData[]>([]);
  const [ingredientDialogOpen, setIngredientDialogOpen] = useState(false);
  const [dialogIngredient, setDialogIngredient] = useState<string | undefined>("");
  const [dialogPortion, setDialogPortion] = useState<number | undefined>(undefined);
  const [dialogDefaultIncluded, setDialogDefaultIncluded] = useState(true);
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

  const onSubmit = async (data: RecipeFormData) => {
    upsertRecipe([recipeToEdit ? { id: recipeToEdit.id, ...data } : data, ingredients]);
    dispatch(setRecipeToEdit(null));
  };

  const calculateMacro = (field: "calories" | "proteins" | "fats" | "carbohydrates") =>
    ingredients.reduce((sum, [ingredient, amount, defaultIncluded]) => {
      if (!defaultIncluded) return sum;
      return sum + ingredient[field] * (amount / ingredient.portion);
    }, 0);

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

      <Grid container spacing={2} sx={{ textAlign: "center" }}>
        <Grid size={3}>
          <Typography>{t("calories", { calories: calculateMacro("calories") })}</Typography>
        </Grid>
        <Grid size={3}>
          <Typography>{t("proteins", { proteins: calculateMacro("proteins") })}</Typography>
        </Grid>
        <Grid size={3}>
          <Typography>{t("fats", { fats: calculateMacro("fats") })}</Typography>
        </Grid>
        <Grid size={3}>
          <Typography>{t("carbohydrates", { carbohydrates: calculateMacro("carbohydrates") })}</Typography>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2}>
        <List sx={{ flex: 1 }}>
          {ingredients.length === 0 ? (
            <ListItem sx={{ fontStyle: "italic" }}>
              <ListItemText primary={t("noIngredients")} secondary="&nbsp;" />
            </ListItem>
          ) : null}
          {ingredients.map(([ingredient, portion, defaultIncluded], index) => (
            <ListItem
              key={ingredient.name}
              secondaryAction={
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
              }
              sx={{ fontStyle: !defaultIncluded ? "italic" : null, color: !defaultIncluded ? "gray" : null }}
            >
              <ListItemText primary={ingredient.name} secondary={`${portion}${GRAMS}`} />
            </ListItem>
          ))}
        </List>
        <Box>
          <Fab
            onClick={() => {
              setDialogIngredient("");
              setDialogPortion(undefined);
              setDialogDefaultIncluded(true);
              setIngredientDialogOpen(true);
            }}
            size="small"
            color="primary"
            sx={{ mt: 3.5 }}
          >
            <AddIcon />
          </Fab>
        </Box>
      </Stack>

      <Box sx={{ flex: 1 }} />

      <Button type="submit" variant="contained" sx={{ alignSelf: "center" }}>
        {recipeToEdit ? t("Shared:edit") : t("Shared:create")}
      </Button>

      <Dialog open={ingredientDialogOpen} onClose={() => setIngredientDialogOpen(false)} fullWidth>
        <DialogTitle>{t("ingredientDialogTitle")}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Autocomplete
            inputValue={dialogIngredient}
            onInputChange={(_, newValue) => {
              setDialogIngredient(newValue);
              const ingredient = products.find((product) => product.name === newValue);
              setDialogPortion(ingredient?.portion);
            }}
            renderInput={(params) => <TextField {...params} label={t("ingredient")} />}
            options={products.map((product) => product.name)}
            sx={{ mt: 1 }}
          />
          <NumericFormat
            customInput={TextField}
            fullWidth
            value={dialogPortion}
            suffix={GRAMS}
            label={t("Shared:portion")}
            onValueChange={({ floatValue }) => setDialogPortion(floatValue)}
          />
          <FormControlLabel
            label={t("defaultIncluded")}
            control={
              <Checkbox
                checked={dialogDefaultIncluded}
                onChange={(event) => setDialogDefaultIncluded(event.target.checked)}
              />
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              const ingredient = products.find((product) => product.name === dialogIngredient);
              if (!ingredient || !dialogPortion) return;
              setIngredients((prevState) => [...prevState, [ingredient, dialogPortion, dialogDefaultIncluded]]);
              setIngredientDialogOpen(false);
            }}
          >
            {t("Shared:add")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default RecipeForm;
