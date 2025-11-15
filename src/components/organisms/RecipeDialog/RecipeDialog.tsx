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
import { calculateMacro, formatCurrency } from "@src/utils/functions.ts";
import { MappedRecipe } from "@src/utils/types.ts";
import { useTranslation } from "react-i18next";

type RecipeDialogProps = {
  recipe: MappedRecipe;
  open: boolean;
  onClose: () => void;
};

function RecipeDialog({ recipe, open, onClose }: RecipeDialogProps) {
  const { t } = useTranslation("Shared");
  const spices = recipe.ingredients
    .filter((ingredient) => ingredient.product.type === PRODUCT_TYPE.spice)
    .map((ingredient) => ingredient.product.name);

  return (
    <Dialog open={open} fullWidth onClose={onClose}>
      <DialogTitle sx={{ display: "flex", flexWrap: "wrap", columnGap: 1 }}>
        {recipe.name}
        <Chip
          label={`${t("cost")}: ${formatCurrency(
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
            {recipe.ingredients.map((ingredient) => {
              if (ingredient.product.type === PRODUCT_TYPE.spice) return null;

              return (
                <TableRow key={ingredient.product.id}>
                  <TableCell>{ingredient.product.name}</TableCell>
                  <TableCell>
                    {ingredient.multiplier > 1 ? `${ingredient.multiplier}x ` : null}
                    {ingredient.amount}
                    {GRAMS}
                  </TableCell>
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
