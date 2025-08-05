import { mapDish } from "@src/repository/mappers.ts";
import queryKey, { DishFilters } from "@src/utils/queryKey.ts";
import supabase from "@src/utils/supabase.ts";
import { useQuery } from "@tanstack/react-query";

function useDishes(filters: DishFilters) {
  return useQuery({
    queryKey: queryKey.dishes.list(filters),
    queryFn: async () => {
      return supabase
        .from("dishes")
        .select()
        .eq("date", filters.date)
        .throwOnError()
        .then((result) => {
          if (result.error) throw result.error;
          return result.data;
        });
    },
    select: (data) => {
      return data.map(mapDish);
    },
  });
}

export default useDishes;
