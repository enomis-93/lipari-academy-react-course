import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import AccountList from "../components/AccountList.jsx";
import BalanceCard from "../components/BalanceCard.jsx";
import Card from "../components/Card.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransactionFilters from "../components/TransactionFilters.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { useSettings } from "../context/SettingsContext.jsx";
import { selectAccounts } from "../store/accountsSlice.js";
import {
  favoriteToggled,
  fetchTransactions,
  selectTransactions,
  selectTransactionsError,
  selectTransactionsStatus,
} from "../store/transactionsSlice.js";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const transactions = useSelector(selectTransactions);
  const status = useSelector(selectTransactionsStatus);
  const error = useSelector(selectTransactionsError);
  const { hideBalance, toggleHideBalance } = useSettings();

  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const selectedAccount =
    accounts.find((account) => account.id === selectedAccountId) ?? accounts[0];
  const selectedAccountName = selectedAccount?.name;

  useEffect(() => {
    if (!selectedAccountName) return undefined;

    document.title = `LipariBank — ${selectedAccountName}`;

    return () => {
      document.title = "LipariBank";
    };
  }, [selectedAccountName]);

  if (status === "idle" || status === "loading") {
    return <LoadingMessage message="Caricamento dei movimenti..." />;
  }
  if (status === "failed") {
    return <ErrorMessage message={error} onRetry={() => dispatch(fetchTransactions())} />;
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const normalizedSearch = searchText.trim().toLowerCase();

  const visibleTransactions = transactions
    .filter((transaction) => transaction.accountId === selectedAccount.id)
    .filter((transaction) => {
      if (filter === "income") return transaction.amount > 0;
      if (filter === "expense") return transaction.amount < 0;
      return true;
    })
    .filter((transaction) => transaction.description.toLowerCase().includes(normalizedSearch))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="dashboard">
      <button type="button" onClick={toggleHideBalance}>
        {hideBalance ? "Mostra saldi" : "Nascondi saldi"}
      </button>

      <BalanceCard total={totalBalance} note="Somma di tutti i tuoi conti" />

      <Card title="I tuoi conti">
        <AccountList
          accounts={accounts}
          transactions={transactions}
          selectedAccountId={selectedAccount.id}
          onSelectAccount={setSelectedAccountId}
        />
      </Card>

      <Card title={`Movimenti — ${selectedAccount.name}`}>
        <TransactionFilters
          filter={filter}
          searchText={searchText}
          onFilterChange={setFilter}
          onSearchChange={setSearchText}
        />
        {transactions.length === 0 ? (
          <EmptyState message="Non ci sono ancora movimenti per i tuoi conti." />
        ) : (
          <TransactionList
            transactions={visibleTransactions}
            onToggleFavorite={(transactionId) => dispatch(favoriteToggled(transactionId))}
          />
        )}
      </Card>

      <p>
        <Link to="/transfer">Nuovo bonifico</Link>
      </p>
    </div>
  );
}
