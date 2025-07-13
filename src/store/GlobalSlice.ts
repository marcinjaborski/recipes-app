import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MappedProduct, MappedRecipe } from "@src/utils/types.ts";

export type GlobalState = {
  productToEdit: MappedProduct | null;
  productToDeleteId: number | null;
  recipeToEdit: MappedRecipe | null;
  recipeToDeleteId: number | null;
  dishToDeleteId: number | null;
};

const initialState: GlobalState = {
  productToEdit: null,
  productToDeleteId: null,
  recipeToEdit: null,
  recipeToDeleteId: null,
  dishToDeleteId: null,
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
    setRecipeToEdit: (state, { payload }: PayloadAction<MappedRecipe | null>) => {
      state.recipeToEdit = payload;
    },
    setRecipeToDeleteId: (state, { payload }: PayloadAction<number | null>) => {
      state.recipeToDeleteId = payload;
    },
    setDishToDeleteId: (state, { payload }: PayloadAction<number | null>) => {
      state.dishToDeleteId = payload;
    },
  },
});

export const { setProductToEdit, setProductToDeleteId, setRecipeToEdit, setRecipeToDeleteId, setDishToDeleteId } =
  globalSlice.actions;
export const { reducer: globalReducer } = globalSlice;
