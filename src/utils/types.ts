import { Database, Tables } from "@src/utils/database.types.ts";

export type TableType = keyof Database["public"]["Tables"];

export type MappedProduct = Tables<"products"> & {
  calories: number;
};

export type SortDir = "asc" | "desc";
