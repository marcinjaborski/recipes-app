import { TableType } from "@src/utils/types.ts";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import supabase from "@src/utils/supabase.ts";
import { TablesUpdate } from "@src/utils/database.types.ts";
import queryKey from "@src/utils/queryKey.ts";
import { PostgrestResponseSuccess } from "@supabase/postgrest-js";

function useUpsert(
  table: TableType,
  options?: UseMutationOptions<PostgrestResponseSuccess<null>, Error, TablesUpdate<TableType>>,
) {
  const queryClient = useQueryClient();

  return useMutation<PostgrestResponseSuccess<null>, Error, TablesUpdate<TableType>>({
    ...options,
    mutationFn: async (data) => supabase.from(table).upsert(data).throwOnError(),
    onSettled: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: queryKey[table].all });
      options?.onSettled?.(...args);
    },
  });
}

export default useUpsert;
