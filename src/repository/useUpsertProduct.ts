import { TablesUpdate } from "@src/utils/database.types.ts";
import queryKey from "@src/utils/queryKey.ts";
import supabase from "@src/utils/supabase.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useUpsertProduct(options?: { onSuccess: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TablesUpdate<"products">) =>
      supabase.from("products").upsert(data).select().single().throwOnError(),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.products.all });
    },
    ...options,
  });
}

export default useUpsertProduct;
