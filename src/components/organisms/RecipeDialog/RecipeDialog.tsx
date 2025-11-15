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
import { GRAMS } from "@src/utils/constants.ts";
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
      <DialogContent>
        <Table>
          <TableBody>
            {recipe.ingredients.map((ingredient) => (
              <TableRow key={ingredient.product.id}>
                <TableCell>{ingredient.product.name}</TableCell>
                <TableCell>
                  {ingredient.multiplier > 1 ? `${ingredient.multiplier}x ` : null}
                  {ingredient.amount}
                  {GRAMS}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography variant="body2" sx={{ mt: 2 }}>
          {recipe.instruction}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default RecipeDialog;
