import { TablesInsert } from "@src/utils/database.types.ts";
import queryKey from "@src/utils/queryKey.ts";
import supabase from "@src/utils/supabase.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useInsertDish(options?: { onSuccess: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TablesInsert<"dishes">) => supabase.from("dishes").insert(data).throwOnError(),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.dishes.all });
    },
    ...options,
  });
}

export default useInsertDish;
