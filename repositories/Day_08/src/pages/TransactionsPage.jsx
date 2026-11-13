import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import CategorySummary from "../components/CategorySummary.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransactionFilters from "../components/TransactionFilters.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { useBankStatus } from "../hooks/useBankStatus.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { useTransactions } from "../hooks/useTransactions.js";
import { favoriteToggled, selectTransactions } from "../store/transactionsSlice.js";

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const allTransactions = useSelector(selectTransactions);
  const { isLoading, error, reload } = useBankStatus();

  const location = useLocation();
  const transferCompleted = location.state?.transferCompleted === true;

  const [filter, setFilter] = useLocalStorage("liparibank.transactionsFilter", "all");
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const visibleTransactions = useTransactions({ filter, searchText });
  const categoryTransactions =
    selectedCategory === null
      ? visibleTransactions
      : visibleTransactions.filter((transaction) => transaction.category === selectedCategory);

  const handleSelectCategory = useCallback((category) => {
    setSelectedCategory((current) => (current === category ? null : category));
  }, []);

  const handleToggleFavorite = useCallback(
    (transactionId) => dispatch(favoriteToggled(transactionId)),
    [dispatch],
  );

  let content;

  if (isLoading) {
    content = <LoadingMessage message="Caricamento dei movimenti..." />;
  } else if (error) {
    content = <ErrorMessage message={error} onRetry={reload} />;
  } else if (allTransactions.length === 0) {
    content = <EmptyState message="Non ci sono ancora movimenti." />;
  } else {
    content = (
      <>
        <CategorySummary
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
        <TransactionList
          transactions={categoryTransactions}
          onToggleFavorite={handleToggleFavorite}
        />
      </>
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
