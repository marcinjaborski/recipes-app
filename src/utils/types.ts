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
  saturatedFats: number;
  carbohydrates: number;
  sugar: number;
  fiber: number;
  salt: number;
  cost: number;
  tag: Database["public"]["Enums"]["tag"] | null;
  lastUsedDate: string;
};

export type MappedDish = Tables<"dishes"> & {
  ingredients: { product: string; amount: string }[];
};

export type SortDir = "asc" | "desc";
