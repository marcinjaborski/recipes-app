import { useSuspenseQuery } from "@tanstack/react-query";
import queryKey from "@src/utils/queryKey.ts";
import supabase from "@src/utils/supabase.ts";
import { mapRecipe } from "@src/repository/mappers.ts";

function useRecipes() {
  return useSuspenseQuery({
    queryKey: queryKey.recipes.all,
    queryFn: async () => {
      return supabase
        .from("recipes")
        .select("*, recipes_products (*, products (*))")
        .throwOnError()
        .then((result) => {
          if (result.error) throw result.error;
          return result.data;
        });
    },
    select: (data) => {
      return data.map(mapRecipe);
    },
  });
}

export default useRecipes;
