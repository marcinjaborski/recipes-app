import { configureStore } from "@reduxjs/toolkit";
import { dishReducer } from "@src/store/DishSlice.ts";
import { feedbackReducer } from "@src/store/FeedbackSlice.ts";
import { globalReducer } from "@src/store/GlobalSlice.ts";
import { useDispatch, useSelector } from "react-redux";

const store = configureStore({
  reducer: {
    global: globalReducer,
    dish: dishReducer,
    feedback: feedbackReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
