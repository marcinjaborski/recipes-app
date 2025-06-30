import { Database } from "@src/utils/database.types.ts";

export type TableType = keyof Database["public"]["Tables"];
