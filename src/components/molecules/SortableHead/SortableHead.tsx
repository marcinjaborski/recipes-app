import { TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { SortDir } from "@src/utils/types.ts";
import { Dispatch, SetStateAction } from "react";

type SortableHeadProps<T extends string> = {
  columns: T[];
  columnNames: Record<string, string>;
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
  sortDir: SortDir;
  setSortDir: Dispatch<SetStateAction<SortDir>>;
};

function SortableHead<T extends string>({
  columns,
  columnNames,
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
}: SortableHeadProps<T>) {
  return (
    <TableHead>
      <TableRow>
        {columns.map((columnName) => (
          <TableCell key={columnName} align={columnName !== "name" ? "right" : "inherit"}>
            <TableSortLabel
              active={sortBy === columnName}
              direction={sortDir}
              onClick={() => {
                if (sortBy === columnName) setSortDir((prevState) => (prevState === "asc" ? "desc" : "asc"));
                else {
                  setSortBy(columnName);
                  setSortDir("asc");
                }
              }}
            >
              {columnNames[columnName]}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default SortableHead;
