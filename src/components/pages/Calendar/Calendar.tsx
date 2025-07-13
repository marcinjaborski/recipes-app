import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Divider, IconButton, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import ConfirmDialog from "@src/components/organisms/ConfirmDialog";
import useDelete from "@src/repository/useDelete.ts";
import useDishes from "@src/repository/useDishes.ts";
import { setDishData } from "@src/store/DishSlice.ts";
import { setDishToDeleteId } from "@src/store/GlobalSlice.ts";
import { useAppDispatch, useAppSelector } from "@src/store/store.ts";
import { MEAL_TIME } from "@src/utils/constants.ts";
import routes from "@src/utils/routes.ts";
import { DateTime } from "luxon";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Calendar() {
  const { t } = useTranslation("Calendar");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { dishToDeleteId } = useAppSelector((state) => state.global);
  const { mutate: deleteDish } = useDelete("dishes");
  const [date, setDate] = useState(DateTime.now().toSQLDate());
  const { data: dishes } = useDishes({ date });

  return (
    <Stack gap={2} sx={{ p: 2 }}>
      <TextField type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      {Object.values(MEAL_TIME).map((mealTime) => (
        <Stack key={mealTime}>
          <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography>{t(mealTime)}</Typography>
            <IconButton
              onClick={() => {
                dispatch(setDishData({ date, mealTime }));
                navigate(routes.dishForm);
              }}
            >
              <AddIcon />
            </IconButton>
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
