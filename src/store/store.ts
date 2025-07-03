import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { feedbackReducer } from "@src/store/FeedbackSlice.ts";
import { globalReducer } from "@src/store/GlobalSlice.ts";

const store = configureStore({
  reducer: {
    global: globalReducer,
    feedback: feedbackReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
