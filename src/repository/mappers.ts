import { Tables } from "@src/utils/database.types.ts";
import { calculateCaloriesFromProduct, calculateMacro } from "@src/utils/functions.ts";
import { MappedDish, MappedProduct, MappedRecipe } from "@src/utils/types.ts";
import _ from "lodash";

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

  const ingredientForMacro = ingredients.map(({ product, amount, defaultIncluded }) => ({
    product,
    amount,
    included: defaultIncluded,
  }));

  return {
    ...recipe,
    ingredients,
    calories: calculateMacro("calories", ingredientForMacro),
    proteins: calculateMacro("proteins", ingredientForMacro),
    fats: calculateMacro("fats", ingredientForMacro),
    carbohydrates: calculateMacro("carbohydrates", ingredientForMacro),
  };
};

export const mapDish = (dish: Tables<"dishes">): MappedDish => {
  return { ...dish, ingredients: _.isArray(dish.ingredients) ? dish.ingredients : [] } as MappedDish;
};
