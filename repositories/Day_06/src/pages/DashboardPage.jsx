import { useEffect, useState } from "react";
import { Link } from "react-router";
import AccountList from "../components/AccountList.jsx";
import BalanceCard from "../components/BalanceCard.jsx";
import Card from "../components/Card.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransactionFilters from "../components/TransactionFilters.jsx";
import TransactionList from "../components/TransactionList.jsx";

export default function DashboardPage({
  accounts,
  transactions,
  isLoading,
  error,
  onRetry,
  onToggleFavorite,
}) {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0].id);
  const [hideBalance, setHideBalance] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);
  const normalizedSearch = searchText.trim().toLowerCase();

  useEffect(() => {
    document.title = `LipariBank — ${selectedAccount.name}`;

    return () => {
      document.title = "LipariBank";
    };
  }, [selectedAccount.name]);

  const visibleTransactions = transactions
    .filter((transaction) => transaction.accountId === selectedAccountId)
    .filter((transaction) => {
      if (filter === "income") return transaction.amount > 0;
      if (filter === "expense") return transaction.amount < 0;
      return true;
    })
    .filter((transaction) => transaction.description.toLowerCase().includes(normalizedSearch))
    .sort((a, b) => b.date.localeCompare(a.date));

  let transactionsContent;

  if (isLoading) {
    transactionsContent = <LoadingMessage message="Caricamento dei movimenti..." />;
  } else if (error) {
    transactionsContent = <ErrorMessage message={error} onRetry={onRetry} />;
  } else if (transactions.length === 0) {
    transactionsContent = (
      <EmptyState message="Non ci sono ancora movimenti per i tuoi conti." />
    );
  } else {
    transactionsContent = (
      <TransactionList
        transactions={visibleTransactions}
        onToggleFavorite={onToggleFavorite}
      />
    );
  }

  return (
    <div className="dashboard">
      <button type="button" onClick={() => setHideBalance((prev) => !prev)}>
        {hideBalance ? "Mostra saldi" : "Nascondi saldi"}
      </button>

      <BalanceCard
        total={totalBalance}
        note="Somma di tutti i tuoi conti"
        hidden={hideBalance}
      />

      <Card title="I tuoi conti">
        <AccountList
          accounts={accounts}
          transactions={transactions}
          selectedAccountId={selectedAccountId}
          hideBalance={hideBalance}
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
        {transactionsContent}
      </Card>

      <p>
        <Link to="/transfer">Nuovo bonifico</Link>
      </p>
    </div>
  );
}
