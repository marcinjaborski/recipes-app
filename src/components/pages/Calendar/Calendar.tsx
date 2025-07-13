import DeleteIcon from "@mui/icons-material/Delete";
import EggIcon from "@mui/icons-material/Egg";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Box, Divider, IconButton, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import ConfirmDialog from "@src/components/organisms/ConfirmDialog";
import ProductDialog from "@src/components/organisms/ProductDialog";
import useDelete from "@src/repository/useDelete.ts";
import useDishes from "@src/repository/useDishes.ts";
import useInsertDish from "@src/repository/useInsertDish.ts";
import { setDishData } from "@src/store/DishSlice.ts";
import { setDishToDeleteId } from "@src/store/GlobalSlice.ts";
import { useAppDispatch, useAppSelector } from "@src/store/store.ts";
import { MEAL_TIME } from "@src/utils/constants.ts";
import { Enums } from "@src/utils/database.types.ts";
import routes from "@src/utils/routes.ts";
import { MappedProduct } from "@src/utils/types.ts";
import { DateTime } from "luxon";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Calendar() {
  const { t } = useTranslation(["Calendar", "Shared"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { dishToDeleteId } = useAppSelector((state) => state.global);
  const { mutate: deleteDish } = useDelete("dishes");
  const [date, setDate] = useState(DateTime.now().toSQLDate());
  const [addSingleProductDialogOpen, setAddSingleProductDialogOpen] = useState<Enums<"mealTime"> | false>(false);
  const { data: dishes } = useDishes({ date });
  const { mutate: insertDish } = useInsertDish();

  const calculateProductMacro = (
    product: MappedProduct,
    amount: number,
    field: "calories" | "proteins" | "fats" | "carbohydrates",
  ) => product[field] * (amount / product.portion);

  return (
    <Stack gap={2} sx={{ p: 2 }}>
      <TextField type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      {Object.values(MEAL_TIME).map((mealTime) => (
        <Stack key={mealTime}>
          <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography>{t(mealTime)}</Typography>
            <Box>
              <IconButton onClick={() => setAddSingleProductDialogOpen(mealTime)}>
                <EggIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  dispatch(setDishData({ date, mealTime }));
                  navigate(routes.dishForm);
                }}
              >
                <MenuBookIcon />
              </IconButton>
            </Box>
          </Stack>
          <List>
            {dishes
              ?.filter((dish) => dish.mealTime === mealTime)
              .map((dish) => (
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
      ))}
      <ProductDialog
        open={addSingleProductDialogOpen !== false}
        setOpen={(value) => !value && setAddSingleProductDialogOpen(value)}
        onAdd={(product, amount) => {
          if (!addSingleProductDialogOpen) return;
          insertDish({
            name: product.name,
            calories: calculateProductMacro(product, amount, "calories"),
            proteins: calculateProductMacro(product, amount, "proteins"),
            fats: calculateProductMacro(product, amount, "fats"),
            carbohydrates: calculateProductMacro(product, amount, "carbohydrates"),
            date,
            mealTime: addSingleProductDialogOpen,
          });
        }}
      />
      <ConfirmDialog
        title={t("confirmDelete")}
        open={dishToDeleteId !== null}
        onCancel={() => dispatch(setDishToDeleteId(null))}
        onConfirm={() => {
          if (dishToDeleteId) deleteDish(dishToDeleteId);
          dispatch(setDishToDeleteId(null));
        }}
      />
    </Stack>
  );
}

export default Calendar;
