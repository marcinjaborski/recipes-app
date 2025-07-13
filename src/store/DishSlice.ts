import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MEAL_TIME } from "@src/utils/constants.ts";
import { Enums } from "@src/utils/database.types.ts";
import { DateTime } from "luxon";

export type DishState = {
  date: string;
  mealTime: Enums<"mealTime">;
};

const initialState: DishState = {
  date: DateTime.now().toSQLDate(),
  mealTime: MEAL_TIME.breakfast,
};

const dishSlice = createSlice({
  name: "dishSlice",
  initialState,
  reducers: {
    setDishData: (state, { payload }: PayloadAction<DishState>) => {
      state.date = payload.date;
      state.mealTime = payload.mealTime;
    },
    clearDishData: () => {
      return initialState;
    },
  },
});

export const { setDishData, clearDishData } = dishSlice.actions;
export const { reducer: dishReducer } = dishSlice;
