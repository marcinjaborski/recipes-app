import { HUNDRED, INGREDIENT_MEASURE, IngredientMeasure, TAG } from "@src/utils/constants.ts";
import { Tables } from "@src/utils/database.types.ts";
import { MappedProduct } from "@src/utils/types.ts";
import _ from "lodash";

export const calculateCalories = (proteins = 0, fats = 0, carbohydrates = 0, precision = 1) => {
  return _.round(proteins * 4 + fats * 9 + carbohydrates * 4, precision);
};

export const calculateCaloriesFromProduct = (product: Tables<"products">) => {
  return calculateCalories(product.proteins, product.fats, product.carbohydrates);
};

export const calculateAmount = (amount: number, portion: number, ingredientMeasure: IngredientMeasure) => {
  const measure = ingredientMeasure === INGREDIENT_MEASURE.gram ? 1 : portion;
  return amount * measure;
};

export const includesString = (string: string, substring: string) => {
  return string.toLowerCase().includes(substring.toLowerCase());
};

export const calculateMacro = (
  field: Exclude<keyof MappedProduct, "id" | "name" | "created_at" | "type" | "tag">,
  ingredients: { product: MappedProduct; amount: number; ingredientMeasure: IngredientMeasure; included: boolean }[],
) => {
  const value = ingredients.reduce((sum, ingredient) => {
    if (!ingredient.included) return sum;
    const amount = calculateAmount(ingredient.amount, ingredient.product.portion, ingredient.ingredientMeasure);
    return sum + (ingredient.product[field] * amount) / HUNDRED;
  }, 0);
  return _.round(value, field.includes("calories") ? 0 : field === "salt" ? 2 : 1);
};

export const getTagFromProducts = (products: MappedProduct[]) => {
  if (products.some((product) => product.tag === TAG.fish)) return TAG.fish;
  if (products.some((product) => product.tag === TAG.none)) return TAG.none;
  return TAG.vegan;
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(value);

export const notNullish = <T>(candidate: T | null | undefined): candidate is T => {
  return candidate !== null && candidate !== undefined;
};
