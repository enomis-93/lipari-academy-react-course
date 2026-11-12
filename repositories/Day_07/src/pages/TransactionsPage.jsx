import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransactionFilters from "../components/TransactionFilters.jsx";
import TransactionList from "../components/TransactionList.jsx";
import {
  favoriteToggled,
  fetchTransactions,
  selectTransactions,
  selectTransactionsError,
  selectTransactionsStatus,
} from "../store/transactionsSlice.js";

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const status = useSelector(selectTransactionsStatus);
  const error = useSelector(selectTransactionsError);

  const location = useLocation();
  const transferCompleted = location.state?.transferCompleted === true;

  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const normalizedSearch = searchText.trim().toLowerCase();

  const visibleTransactions = transactions
    .filter((transaction) => {
      if (filter === "income") return transaction.amount > 0;
      if (filter === "expense") return transaction.amount < 0;
      return true;
    })
    .filter((transaction) => transaction.description.toLowerCase().includes(normalizedSearch))
    .sort((a, b) => b.date.localeCompare(a.date));

  let content;

  if (status === "idle" || status === "loading") {
    content = <LoadingMessage message="Caricamento dei movimenti..." />;
  } else if (status === "failed") {
    content = <ErrorMessage message={error} onRetry={() => dispatch(fetchTransactions())} />;
  } else if (transactions.length === 0) {
    content = <EmptyState message="Non ci sono ancora movimenti." />;
  } else {
    content = (
      <TransactionList
        transactions={visibleTransactions}
        onToggleFavorite={(transactionId) => dispatch(favoriteToggled(transactionId))}
      />
    );
  }

  return (
    <section>
      <h1>Movimenti</h1>

      {transferCompleted && (
        <p className="success-message" role="status">
          Bonifico simulato registrato.
        </p>
      )}

      <TransactionFilters
        filter={filter}
        searchText={searchText}
        onFilterChange={setFilter}
        onSearchChange={setSearchText}
      />

      {content}
    </section>
  );
}
