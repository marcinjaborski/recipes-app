import BoltIcon from "@mui/icons-material/Bolt";
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
import SpicesInfo from "@src/components/atoms/SpicesInfo/SpicesInfo.tsx";
import TagIcon from "@src/components/atoms/TagIcon";
import MacroTable from "@src/components/molecules/MacroTable/MacroTable.tsx";
import { setDishToDeleteId } from "@src/store/GlobalSlice.ts";
import { useAppDispatch } from "@src/store/store.ts";
import { GRAMS, PRODUCT_TYPE } from "@src/utils/constants.ts";
import { Enums } from "@src/utils/database.types.ts";
import { MappedDish } from "@src/utils/types.ts";
import _ from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type MealTimeSectionProps = {
  mealTime: Enums<"mealTime">;
  dishes?: MappedDish[];
  onQuickAddMacroClick: () => void;
  onAddSingleProductClick: () => void;
  onOpenDishForm: () => void;
};

function MealTimeSection({
  mealTime,
  dishes = [],
  onQuickAddMacroClick,
  onAddSingleProductClick,
  onOpenDishForm,
}: MealTimeSectionProps) {
  const { t } = useTranslation(["Calendar", "Shared"]);
  const dispatch = useAppDispatch();
  const [ingredientDialogOpen, setIngredientDialogOpen] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedProductIngredients, setSelectedProductIngredients] = useState<MappedDish["ingredients"]>([]);
  const [markedOffIngredients, setMarkedOffIngredients] = useState<string[]>([]);

  const spices = selectedProductIngredients
    .filter((ingredient) => ingredient.type === PRODUCT_TYPE.spice)
    .map((ingredient) => ingredient.product);

  const onIngredientsModalClose = () => {
    setIngredientDialogOpen(false);
  };

  const markedOffSX = { textDecoration: "line-through", color: "gray" };

  const handleMarkOff = (ingredient: string) => {
    if (markedOffIngredients.includes(ingredient)) {
      setMarkedOffIngredients((prevState) => prevState.filter((ing) => ing !== ingredient));
    } else {
      setMarkedOffIngredients((prevState) => [...prevState, ingredient]);
    }
  };

  return (
    <Stack key={mealTime}>
      <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography>{t(mealTime)}</Typography>
        <Stack direction="row">
          <IconButton onClick={onQuickAddMacroClick}>
            <BoltIcon />
          </IconButton>
          <IconButton onClick={onAddSingleProductClick}>
            <EggIcon />
          </IconButton>
          <IconButton onClick={onOpenDishForm}>
            <MenuBookIcon />
          </IconButton>
        </Stack>
      </Stack>
      {dishes?.length ? (
        <Box sx={{ color: "gray" }}>
          <MacroTable
            calories={_.sumBy(dishes, "calories")}
            proteins={_.sumBy(dishes, "proteins")}
            fats={_.sumBy(dishes, "fats")}
            carbohydrates={_.sumBy(dishes, "carbohydrates")}
            extra={{
              saturatedFats: _.sumBy(dishes, "saturatedFats"),
              sugar: _.sumBy(dishes, "sugar"),
              fiber: _.sumBy(dishes, "fiber"),
              salt: _.sumBy(dishes, "salt"),
            }}
          />
        </Box>
      ) : null}
      <List>
        {dishes.map((dish) => (
          <ListItem
            key={dish.id}
            sx={{ gap: 1 }}
            secondaryAction={
              <IconButton edge="end" onClick={() => dispatch(setDishToDeleteId(dish.id))}>
                <DeleteIcon />
              </IconButton>
            }
          >
            {dish.name}
            <TagIcon tag={dish.tag} />
            {dish.ingredients.length ? (
              <IconButton
                sx={{ p: 0 }}
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
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Table>
            <TableBody>
              {selectedProductIngredients.map((ingredient) => {
                if (ingredient.type === PRODUCT_TYPE.spice) return null;

                return (
                  <TableRow key={ingredient.product} onClick={() => handleMarkOff(ingredient.product)}>
                    <TableCell sx={markedOffIngredients.includes(ingredient.product) ? markedOffSX : null}>
                      {ingredient.product}
                    </TableCell>
                    <TableCell sx={markedOffIngredients.includes(ingredient.product) ? markedOffSX : null}>
                      {ingredient.amount}
                      {GRAMS}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <SpicesInfo spices={spices} />
        </DialogContent>
      </Dialog>
    </Stack>
  );
}

export default MealTimeSection;
