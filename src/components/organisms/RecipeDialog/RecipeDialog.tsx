import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import SpicesInfo from "@src/components/atoms/SpicesInfo/SpicesInfo.tsx";
import { GRAMS, PRODUCT_TYPE } from "@src/utils/constants.ts";
import { calculateAmount, calculateMacro, formatCurrency } from "@src/utils/functions.ts";
import { MappedRecipe } from "@src/utils/types.ts";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type RecipeDialogProps = {
  recipe: MappedRecipe;
  open: boolean;
  onClose: () => void;
};

function RecipeDialog({ recipe, open, onClose }: RecipeDialogProps) {
  const { t } = useTranslation(["IngredientMeasure", "Shared"]);
  const [toggledMeasures, setToggledMeasures] = useState<boolean[]>([]);
  const spices = recipe.ingredients
    .filter((ingredient) => ingredient.product.type === PRODUCT_TYPE.spice)
    .map((ingredient) => ingredient.product.name);

  const toggleMeasure = (index: number) => {
    setToggledMeasures((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <Dialog open={open} fullWidth onClose={onClose}>
      <DialogTitle sx={{ display: "flex", flexWrap: "wrap", columnGap: 1 }}>
        {recipe.name}
        <Chip
          label={`${t("Shared:cost")}: ${formatCurrency(
            calculateMacro(
              "cost",
              recipe.ingredients.map((ingredient) => ({ ...ingredient, included: true })),
            ),
          )}`}
        />
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Table>
          <TableBody>
            {recipe.ingredients.map((ingredient, index) => {
              if (ingredient.product.type === PRODUCT_TYPE.spice) return null;

              return (
                <TableRow key={ingredient.product.id} onClick={() => toggleMeasure(index)}>
                  <TableCell>{ingredient.product.name}</TableCell>
                  {toggledMeasures[index] ? (
                    <TableCell>
                      {calculateAmount(ingredient.amount, ingredient.product.portion, ingredient.ingredientMeasure)}{" "}
                      {GRAMS}
                    </TableCell>
                  ) : (
                    <TableCell>
                      {ingredient.amount} {t(`IngredientMeasure:${ingredient.ingredientMeasure}`)}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <SpicesInfo spices={spices} />
        <Typography variant="body2">{recipe.instruction}</Typography>
      </DialogContent>
    </Dialog>
  );
}

export default RecipeDialog;
