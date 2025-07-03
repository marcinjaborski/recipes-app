import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MappedProduct } from "@src/utils/types.ts";

export type GlobalState = {
  productToEdit: MappedProduct | null;
  productToDeleteId: number | null;
};

const initialState: GlobalState = {
  productToEdit: null,
  productToDeleteId: null,
};

const globalSlice = createSlice({
  name: "globalSlice",
  initialState,
  reducers: {
    setProductToEdit: (state, { payload }: PayloadAction<MappedProduct | null>) => {
      state.productToEdit = payload;
    },
    setProductToDeleteId: (state, { payload }: PayloadAction<number | null>) => {
      state.productToDeleteId = payload;
    },
  },
});

export const { setProductToEdit, setProductToDeleteId } = globalSlice.actions;
export const { reducer: globalReducer } = globalSlice;
