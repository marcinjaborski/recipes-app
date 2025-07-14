import { Box, Stack, TextField } from "@mui/material";
import MacroCounter from "@src/components/molecules/MacroCounter";
import ConfirmDialog from "@src/components/organisms/ConfirmDialog";
import MealTimeSection from "@src/components/organisms/MealTimeSection";
import ProductDialog from "@src/components/organisms/ProductDialog";
import useDelete from "@src/repository/useDelete.ts";
import useDishes from "@src/repository/useDishes.ts";
import useInsertDish from "@src/repository/useInsertDish.ts";
import { setDishData } from "@src/store/DishSlice.ts";
import { setDishToDeleteId } from "@src/store/GlobalSlice.ts";
import { useAppDispatch, useAppSelector } from "@src/store/store.ts";
import { DAILY_CALORIES, DAILY_CARBOHYDRATES, DAILY_FATS, DAILY_PROTEINS, MEAL_TIME } from "@src/utils/constants.ts";
import { Enums } from "@src/utils/database.types.ts";
import routes from "@src/utils/routes.ts";
import { MappedProduct } from "@src/utils/types.ts";
import _ from "lodash";
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
    <Stack gap={2} sx={{ p: 2, height: "100%" }}>
      <TextField type="date" sx={{ colorScheme: "dark" }} value={date} onChange={(e) => setDate(e.target.value)} />
      {Object.values(MEAL_TIME).map((mealTime) => (
        <MealTimeSection
          key={mealTime}
          mealTime={mealTime}
          dishes={dishes?.filter((dish) => dish.mealTime === mealTime)}
          onAddSingleProductClick={() => setAddSingleProductDialogOpen(mealTime)}
          onOpenDishForm={() => {
            dispatch(setDishData({ date, mealTime }));
            navigate(routes.dishForm);
          }}
        />
      ))}

      <Box sx={{ flex: 1 }} />

      <Stack sx={{ gap: 1 }}>
        <MacroCounter
          text={t("calories")}
          value={_.sumBy(dishes, "calories")}
          total={DAILY_CALORIES}
          color="calories"
        />
        <MacroCounter
          text={t("proteins")}
          value={_.sumBy(dishes, "proteins")}
          total={DAILY_PROTEINS}
          color="proteins"
        />
        <MacroCounter text={t("fats")} value={_.sumBy(dishes, "fats")} total={DAILY_FATS} color="fats" />
        <MacroCounter
          text={t("carbohydrates")}
          value={_.sumBy(dishes, "carbohydrates")}
          total={DAILY_CARBOHYDRATES}
          color="carbohydrates"
        />
      </Stack>

      <ProductDialog
        open={addSingleProductDialogOpen !== false}
        setOpen={(value) => !value && setAddSingleProductDialogOpen(value)}
        onAdd={(product, amount) => {
          if (!addSingleProductDialogOpen) return;
          insertDish({
            name: product.name,
            calories: _.round(calculateProductMacro(product, amount, "calories")),
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
