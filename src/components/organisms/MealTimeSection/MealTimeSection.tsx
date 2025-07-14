import DeleteIcon from "@mui/icons-material/Delete";
import EggIcon from "@mui/icons-material/Egg";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Box, Divider, IconButton, List, ListItem, Stack, Typography } from "@mui/material";
import MacroTable from "@src/components/molecules/MacroTable/MacroTable.tsx";
import { setDishToDeleteId } from "@src/store/GlobalSlice.ts";
import { useAppDispatch } from "@src/store/store.ts";
import { Enums, Tables } from "@src/utils/database.types.ts";
import _ from "lodash";
import { useTranslation } from "react-i18next";

type MealTimeSectionProps = {
  mealTime: Enums<"mealTime">;
  dishes?: Tables<"dishes">[];
  onAddSingleProductClick: () => void;
  onOpenDishForm: () => void;
};

function MealTimeSection({ mealTime, dishes = [], onAddSingleProductClick, onOpenDishForm }: MealTimeSectionProps) {
  const { t } = useTranslation(["Calendar", "Shared"]);
  const dispatch = useAppDispatch();

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
            {dish.name}
          </ListItem>
        ))}
      </List>
      <Divider />
    </Stack>
  );
}

export default MealTimeSection;
