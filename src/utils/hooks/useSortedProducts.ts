import { PRODUCT_TYPE } from "@src/utils/constants.ts";
import _ from "lodash";
import { useMemo } from "react";

function useSortedProducts<T>(products: T[], iteratee: string) {
  return useMemo(() => {
    const groupedProducts = _.groupBy(products, iteratee);
    return _.flatten(Object.values(PRODUCT_TYPE).map((type) => groupedProducts[type])).filter(Boolean);
  }, [iteratee, products]);
}

export default useSortedProducts;
