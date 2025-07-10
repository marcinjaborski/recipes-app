import { Tables } from "@src/utils/database.types.ts";
import { calculateCaloriesFromProduct } from "@src/utils/functions.ts";
import { MappedProduct, MappedRecipe } from "@src/utils/types.ts";

export const mapProduct = (product: Tables<"products">): MappedProduct => {
  return {
    ...product,
    calories: calculateCaloriesFromProduct(product),
  };
};

export const mapRecipe = (
  recipe: Tables<"recipes"> & { recipes_products: (Tables<"recipes_products"> & { products: Tables<"products"> })[] },
): MappedRecipe => {
  const ingredients = recipe.recipes_products.map((recipe_product) => ({
    ...recipe_product,
    product: mapProduct(recipe_product.products),
  }));

  const calculateMacro = (field: "calories" | "proteins" | "fats" | "carbohydrates") =>
    ingredients.reduce((sum, ingredient) => {
      if (!ingredient.defaultIncluded) return sum;
      return sum + ingredient.product[field] * (ingredient.amount / ingredient.product.portion);
    }, 0);

  return {
    ...recipe,
    ingredients,
    calories: calculateMacro("calories"),
    proteins: calculateMacro("proteins"),
    fats: calculateMacro("fats"),
    carbohydrates: calculateMacro("carbohydrates"),
  };
};
