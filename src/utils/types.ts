import { Database, Tables } from "@src/utils/database.types.ts";

export type TableType = keyof Database["public"]["Tables"];

export type MappedProduct = Tables<"products"> & {
  calories: number;
};

export type Ingredient = Omit<Tables<"recipes_products">, "product_id" | "recipe_id"> & {
  product: MappedProduct;
};

export type MappedRecipe = Tables<"recipes"> & {
  ingredients: Ingredient[];
  calories: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
};

export type SortDir = "asc" | "desc";
