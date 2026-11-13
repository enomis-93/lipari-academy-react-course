import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccounts,
  selectAccountsError,
  selectAccountsStatus,
} from "../store/accountsSlice.js";
import {
  fetchTransactions,
  selectTransactionsError,
  selectTransactionsStatus,
} from "../store/transactionsSlice.js";

export function useBankStatus() {
  const dispatch = useDispatch();
  const accountsStatus = useSelector(selectAccountsStatus);
  const accountsError = useSelector(selectAccountsError);
  const transactionsStatus = useSelector(selectTransactionsStatus);
  const transactionsError = useSelector(selectTransactionsError);

  const statuses = [accountsStatus, transactionsStatus];
  const hasFailed = statuses.includes("failed");
  const isLoading =
    !hasFailed && statuses.some((status) => status === "idle" || status === "loading");

  function reload() {
    if (accountsStatus === "failed") dispatch(fetchAccounts());
    if (transactionsStatus === "failed") dispatch(fetchTransactions());
  }

  return {
    isLoading,
    error: hasFailed ? (accountsError ?? transactionsError) : null,
    reload,
  };
}
