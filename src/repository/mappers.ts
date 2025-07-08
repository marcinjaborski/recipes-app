import { Tables } from "@src/utils/database.types.ts";
import { MappedProduct, MappedRecipe } from "@src/utils/types.ts";
import { calculateCaloriesFromProduct } from "@src/utils/functions.ts";

export const mapProduct = (product: Tables<"products">): MappedProduct => {
  return {
    ...product,
    calories: calculateCaloriesFromProduct(product),
  };
};

export const mapRecipe = (
  recipe: Tables<"recipes"> & { recipes_products: (Tables<"recipes_products"> & { products: Tables<"products"> })[] },
): MappedRecipe => {
  return {
    ...recipe,
    ingredients: recipe.recipes_products.map((recipe_product) => ({
      ...recipe_product,
      product: mapProduct(recipe_product.products),
    })),
  };
};
