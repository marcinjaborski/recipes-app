import { AlertColor } from "@mui/material";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FeedbackState = {
  message: string;
  type: AlertColor;
};

const initialState: FeedbackState = {
  message: "",
  type: "info",
};

const feedbackSlice = createSlice({
  name: "feedbackSlice",
  initialState,
  reducers: {
    showFeedback: (state, { payload }: PayloadAction<FeedbackState>) => {
      state.message = payload.message;
      state.type = payload.type;
    },
    closeFeedback: (state) => {
      state.message = "";
    },
  },
});

export const { showFeedback, closeFeedback } = feedbackSlice.actions;
export const { reducer: feedbackReducer } = feedbackSlice;
