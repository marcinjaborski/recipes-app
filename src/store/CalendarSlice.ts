import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateTime } from "luxon";

export type CalendarState = {
  date: string;
};

const initialState: CalendarState = {
  date: DateTime.now().toSQLDate(),
};

const calendarSlice = createSlice({
  name: "calendarSlice",
  initialState,
  reducers: {
    setDate: (state, { payload }: PayloadAction<string>) => {
      state.date = payload;
    },
    setPreviousDay: (state) => {
      const newDate = DateTime.fromSQL(state.date).minus({ day: 1 }).toSQLDate();
      state.date = newDate || state.date;
    },
    setNextDay: (state) => {
      const newDate = DateTime.fromSQL(state.date).plus({ day: 1 }).toSQLDate();
      state.date = newDate || state.date;
    },
  },
});

export const { setDate, setPreviousDay, setNextDay } = calendarSlice.actions;
export const { reducer: calendarReducer } = calendarSlice;
