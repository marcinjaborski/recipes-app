import { Tables } from "@src/utils/database.types.ts";
import _ from "lodash";

export const calculateCalories = (proteins = 0, fats = 0, carbohydrates = 0) => {
  return _.round(proteins * 4 + fats * 9 + carbohydrates * 4, 1);
};

export const calculateCaloriesFromProduct = (product: Tables<"products">) => {
  return calculateCalories(product.proteins, product.fats, product.carbohydrates);
};
