import { useMemo } from "react";
import { sortByDate } from "../utils/format.js";

export function useTransactions(items, filter, search, accountId = "") {
  return useMemo(() => sortByDate(items.filter((item) => (!accountId || item.accountId === accountId) &&
    (filter === "all" || (filter === "income" ? item.amount > 0 : item.amount < 0)) &&
    item.description.toLowerCase().includes(search.trim().toLowerCase()))), [items, filter, search, accountId]);
}
