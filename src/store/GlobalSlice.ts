import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MappedRecipe } from "@src/utils/types.ts";

export type GlobalState = {
  productIdToEdit: number | null;
  productToDeleteId: number | null;
  recipeToEdit: MappedRecipe | null;
  recipeToDeleteId: number | null;
  dishToDeleteId: number | null;
};

const initialState: GlobalState = {
  productIdToEdit: null,
  productToDeleteId: null,
  recipeToEdit: null,
  recipeToDeleteId: null,
  dishToDeleteId: null,
};

const globalSlice = createSlice({
  name: "globalSlice",
  initialState,
  reducers: {
    setProductIdToEdit: (state, { payload }: PayloadAction<number | null>) => {
      state.productIdToEdit = payload;
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

export const { setProductIdToEdit, setProductToDeleteId, setRecipeToEdit, setRecipeToDeleteId, setDishToDeleteId } =
  globalSlice.actions;
export const { reducer: globalReducer } = globalSlice;
