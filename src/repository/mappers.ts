import { Tables } from "@src/utils/database.types.ts";
import { MappedProduct } from "@src/utils/types.ts";
import { calculateCaloriesFromProduct } from "@src/utils/functions.ts";

export const mapProduct = (product: Tables<"products">): MappedProduct => {
  return {
    ...product,
    calories: calculateCaloriesFromProduct(product),
  };
};
