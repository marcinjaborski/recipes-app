import _ from "lodash";
import { useMemo } from "react";

function useSortedDataByRecord<T>(data: T[], iteratee: string, record: Record<string, string>) {
  return useMemo(() => {
    const groupedData = _.groupBy(data, iteratee);
    return _.flatten(Object.values(record).map((type) => groupedData[type])).filter(Boolean);
  }, [iteratee, data, record]);
}

export default useSortedDataByRecord;
