import AddIcon from "@mui/icons-material/Add";
import { Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import { setDishData } from "@src/store/DishSlice.ts";
import { useAppDispatch } from "@src/store/store.ts";
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
  const [date, setDate] = useState(DateTime.now().toSQLDate());

  return (
    <Stack gap={2} sx={{ p: 2 }}>
      <TextField type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography>{t("breakfast")}</Typography>
        <IconButton
          onClick={() => {
            dispatch(setDishData({ date, mealTime: MEAL_TIME.breakfast }));
            navigate(routes.dishForm);
          }}
        >
          <AddIcon />
        </IconButton>
      </Stack>
      <Divider />
    </Stack>
  );
}

export default Calendar;
