import { IngredientFormData } from "@src/components/pages/RecipeForm";
import { TablesUpdate } from "@src/utils/database.types.ts";
import queryKey from "@src/utils/queryKey.ts";
import supabase from "@src/utils/supabase.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useUpsertRecipe(options?: { onSuccess: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ([data, ingredients]: [TablesUpdate<"recipes">, IngredientFormData[]]) => {
      const response = await supabase.from("recipes").upsert(data).select().single().throwOnError();
      await supabase.from("recipes_products").delete().eq("recipe_id", response.data.id);
      await supabase.from("recipes_products").insert(
        ingredients.map(([ingredient, portion, defaultIncluded]) => ({
          product_id: ingredient.id,
          recipe_id: response.data.id,
          amount: portion,
          defaultIncluded,
        })),
      );
      return response;
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.recipes.all });
    },
    ...options,
  });
}

export default useUpsertRecipe;
