import { HUNDRED, TAG } from "@src/utils/constants.ts";
import { Tables } from "@src/utils/database.types.ts";
import { MappedProduct } from "@src/utils/types.ts";
import _ from "lodash";

export const calculateCalories = (proteins = 0, fats = 0, carbohydrates = 0) => {
  return _.round(proteins * 4 + fats * 9 + carbohydrates * 4, 1);
};

export const calculateCaloriesFromProduct = (product: Tables<"products">) => {
  return calculateCalories(product.proteins, product.fats, product.carbohydrates);
};

export const includesString = (string: string, substring: string) => {
  return string.toLowerCase().includes(substring.toLowerCase());
};

export const calculateMacro = (
  field: Exclude<keyof MappedProduct, "id" | "name" | "created_at" | "type" | "tag">,
  ingredients: { product: MappedProduct; amount: number; multiplier: number; included: boolean }[],
) => {
  const value = ingredients.reduce((sum, ingredient) => {
    if (!ingredient.included) return sum;
    return sum + (ingredient.product[field] * ingredient.amount * ingredient.multiplier) / HUNDRED;
  }, 0);
  return _.round(value, field.includes("calories") ? 0 : field === "salt" ? 2 : 1);
};

export const getTagFromProducts = (products: MappedProduct[]) => {
  if (products.some((product) => product.tag === TAG.fish)) return TAG.fish;
  if (products.some((product) => product.tag === TAG.none)) return TAG.none;
  return TAG.vegan;
};
