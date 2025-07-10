import { SortDir } from "@src/utils/types.ts";
import { useMemo, useState } from "react";

function useSortedData<T>(data: T[], initialSortBy: keyof T) {
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sortedData = useMemo(() => {
    const products = [...data];
    products.sort((a, b) => {
      if (sortDir === "desc") {
        const temp = a;
        a = b;
        b = temp;
      }
      if (typeof a[sortBy] === "string" && typeof b[sortBy] === "string") return a[sortBy].localeCompare(b[sortBy]);
      if (typeof a[sortBy] === "number" && typeof b[sortBy] === "number") return a[sortBy] - b[sortBy];
      return 0;
    });
    return products;
  }, [data, sortBy, sortDir]);

  return { sortedData, sortDir, setSortDir, sortBy, setSortBy };
}

export default useSortedData;
