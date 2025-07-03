import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TableType } from "@src/utils/types.ts";
import supabase from "@src/utils/supabase.ts";
import queryKey from "@src/utils/queryKey.ts";

function useDelete(table: TableType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => supabase.from(table).delete().eq("id", id).select().throwOnError(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKey[table].all }),
  });
}

export default useDelete;
