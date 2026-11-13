import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectTransactions } from "../store/transactionsSlice.js";

export function useTransactions({ accountId = null, filter = "all", searchText = "" } = {}) {
  const transactions = useSelector(selectTransactions);

  return useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return transactions
      .filter((transaction) => accountId === null || transaction.accountId === accountId)
      .filter((transaction) => {
        if (filter === "income") return transaction.amount > 0;
        if (filter === "expense") return transaction.amount < 0;
        return true;
      })
      .filter(
        (transaction) =>
          normalizedSearch === "" ||
          transaction.description.toLowerCase().includes(normalizedSearch),
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, accountId, filter, searchText]);
}
