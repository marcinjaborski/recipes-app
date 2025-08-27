import { Box, Stack, TextField } from "@mui/material";
import MacroCounter from "@src/components/molecules/MacroCounter";
import ConfirmDialog from "@src/components/organisms/ConfirmDialog";
import MealTimeSection from "@src/components/organisms/MealTimeSection";
import ProductDialog from "@src/components/organisms/ProductDialog";
import QuickMacroDialog from "@src/components/organisms/QuickMacroDialog";
import useDelete from "@src/repository/useDelete.ts";
import useDishes from "@src/repository/useDishes.ts";
import useInsertDish from "@src/repository/useInsertDish.ts";
import { setDishData } from "@src/store/DishSlice.ts";
import { setDishToDeleteId } from "@src/store/GlobalSlice.ts";
import { useAppDispatch, useAppSelector } from "@src/store/store.ts";
import {
  DAILY_CALORIES,
  DAILY_CARBOHYDRATES,
  DAILY_FATS,
  DAILY_FIBER,
  DAILY_PROTEINS,
  DAILY_SALT,
  DAILY_SATURATED_FATS,
  DAILY_SUGAR,
  DAILY_VEGETABLES,
  MEAL_TIME,
  PRODUCT_TYPE,
} from "@src/utils/constants.ts";
import { Enums } from "@src/utils/database.types.ts";
import { calculateMacro } from "@src/utils/functions.ts";
import routes from "@src/utils/routes.ts";
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
  const [quickAddMacroDialogOpen, setQuickAddMacroDialogOpen] = useState<Enums<"mealTime"> | false>(false);
  const [addSingleProductDialogOpen, setAddSingleProductDialogOpen] = useState<Enums<"mealTime"> | false>(false);
  const { data: dishes } = useDishes({ date });
  const { mutate: insertDish } = useInsertDish();

  return (
    <Stack gap={2} sx={{ p: 2, minHeight: "100%" }}>
      <TextField type="date" sx={{ colorScheme: "dark" }} value={date} onChange={(e) => setDate(e.target.value)} />
      {Object.values(MEAL_TIME).map((mealTime) => (
        <MealTimeSection
          key={mealTime}
          mealTime={mealTime}
          dishes={dishes?.filter((dish) => dish.mealTime === mealTime)}
          onQuickAddMacroClick={() => setQuickAddMacroDialogOpen(mealTime)}
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
          text={t("Shared:protein")}
          value={_.sumBy(dishes, "proteins")}
          total={DAILY_PROTEINS}
          color="proteins"
        />
        <MacroCounter text={t("Shared:fat")} value={_.sumBy(dishes, "fats")} total={DAILY_FATS} color="fats" />
        <MacroCounter
          text={t("Shared:saturatedFat")}
          value={_.sumBy(dishes, "saturatedFats")}
          total={DAILY_SATURATED_FATS}
          color="saturatedFats"
        />
        <MacroCounter
          text={t("Shared:carbohydrates")}
          value={_.sumBy(dishes, "carbohydrates")}
          total={DAILY_CARBOHYDRATES}
          color="carbohydrates"
        />
        <MacroCounter text={t("Shared:sugar")} value={_.sumBy(dishes, "sugar")} total={DAILY_SUGAR} color="sugar" />
        <MacroCounter text={t("Shared:fiber")} value={_.sumBy(dishes, "fiber")} total={DAILY_FIBER} color="fiber" />
        <MacroCounter
          text={t("Shared:salt")}
          value={_.sumBy(dishes, "salt")}
          total={DAILY_SALT}
          color="salt"
          precision={2}
        />
        <MacroCounter
          text={t("vegetables")}
          value={_.sumBy(dishes, "vegetables")}
          total={DAILY_VEGETABLES}
          color="vegetables"
        />
      </Stack>

      <QuickMacroDialog
        open={quickAddMacroDialogOpen !== false}
        setOpen={(value) => !value && setQuickAddMacroDialogOpen(false)}
        onAdd={(data) => {
          if (!quickAddMacroDialogOpen) return;
          insertDish({ ...data, date, mealTime: quickAddMacroDialogOpen });
        }}
      />
      <ProductDialog
        open={addSingleProductDialogOpen !== false}
        setOpen={(value) => !value && setAddSingleProductDialogOpen(value)}
        onAdd={(product, amount) => {
          if (!addSingleProductDialogOpen) return;
          const productForMacro = [{ product, amount, included: true }];
          insertDish({
            name: product.name,
            calories: calculateMacro("calories", productForMacro),
            proteins: calculateMacro("proteins", productForMacro),
            fats: calculateMacro("fats", productForMacro),
            saturatedFats: calculateMacro("saturatedFats", productForMacro),
            carbohydrates: calculateMacro("carbohydrates", productForMacro),
            sugar: calculateMacro("sugar", productForMacro),
            fiber: calculateMacro("fiber", productForMacro),
            salt: calculateMacro("salt", productForMacro),
            vegetables: product.type === PRODUCT_TYPE.fruit || product.type === PRODUCT_TYPE.vegetable ? amount : 0,
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
