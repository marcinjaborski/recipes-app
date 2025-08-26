import DeleteIcon from "@mui/icons-material/Delete";
import EggIcon from "@mui/icons-material/Egg";
import InfoIcon from "@mui/icons-material/Info";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import MacroTable from "@src/components/molecules/MacroTable/MacroTable.tsx";
import { setDishToDeleteId } from "@src/store/GlobalSlice.ts";
import { useAppDispatch } from "@src/store/store.ts";
import { GRAMS } from "@src/utils/constants.ts";
import { Enums } from "@src/utils/database.types.ts";
import { MappedDish } from "@src/utils/types.ts";
import _ from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type MealTimeSectionProps = {
  mealTime: Enums<"mealTime">;
  dishes?: MappedDish[];
  onAddSingleProductClick: () => void;
  onOpenDishForm: () => void;
};

function MealTimeSection({ mealTime, dishes = [], onAddSingleProductClick, onOpenDishForm }: MealTimeSectionProps) {
  const { t } = useTranslation(["Calendar", "Shared"]);
  const dispatch = useAppDispatch();
  const [ingredientDialogOpen, setIngredientDialogOpen] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedProductIngredients, setSelectedProductIngredients] = useState<MappedDish["ingredients"]>([]);

  const onIngredientsModalClose = () => {
    setIngredientDialogOpen(false);
  };

  return (
    <Stack key={mealTime}>
      <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography>{t(mealTime)}</Typography>
        <Stack direction="row">
          <IconButton onClick={onAddSingleProductClick}>
            <EggIcon />
          </IconButton>
          <IconButton onClick={onOpenDishForm}>
            <MenuBookIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Box sx={{ color: "gray" }}>
        <MacroTable
          calories={_.sumBy(dishes, "calories")}
          proteins={_.sumBy(dishes, "proteins")}
          fats={_.sumBy(dishes, "fats")}
          carbohydrates={_.sumBy(dishes, "carbohydrates")}
        />
      </Box>
      <List>
        {dishes.map((dish) => (
          <ListItem
            key={dish.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => dispatch(setDishToDeleteId(dish.id))}>
                <DeleteIcon />
              </IconButton>
            }
          >
            {dish.name}{" "}
            {dish.ingredients.length ? (
              <IconButton
                onClick={() => {
                  setIngredientDialogOpen(true);
                  setSelectedProductName(dish.name);
                  setSelectedProductIngredients(dish.ingredients);
                }}
              >
                <InfoIcon />
              </IconButton>
            ) : null}
          </ListItem>
        ))}
      </List>
      <Divider />
      <Dialog open={ingredientDialogOpen} onClose={onIngredientsModalClose} fullWidth>
        <DialogTitle>{selectedProductName}</DialogTitle>
        <DialogContent>
          <Table>
            <TableBody>
              {selectedProductIngredients.map((ingredient) => (
                <TableRow key={ingredient.product}>
                  <TableCell>{ingredient.product}</TableCell>
                  <TableCell>
                    {ingredient.amount}
                    {GRAMS}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}

export default MealTimeSection;
