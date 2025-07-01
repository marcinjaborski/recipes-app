import { useSuspenseQuery } from "@tanstack/react-query";
import queryKey from "@src/utils/queryKey.ts";
import supabase from "@src/utils/supabase.ts";
import { mapProduct } from "@src/repository/mappers.ts";

function useProducts() {
  return useSuspenseQuery({
    queryKey: queryKey.products.all,
    queryFn: async () => {
      return supabase
        .from("products")
        .select()
        .throwOnError()
        .then((result) => {
          if (result.error) throw result.error;
          return result.data;
        });
    },
    select: (data) => {
      return data.map(mapProduct);
    },
  });
}

export default useProducts;
