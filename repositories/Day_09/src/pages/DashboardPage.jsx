import { useState } from "react";
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
import { useBankStatus } from "../hooks/useBankStatus.js";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useTransactions } from "../hooks/useTransactions.js";
import { selectAccounts } from "../store/accountsSlice.js";
import { favoriteToggled, selectTransactions } from "../store/transactionsSlice.js";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const transactions = useSelector(selectTransactions);
  const { isLoading, error, reload } = useBankStatus();
  const { hideBalance, toggleHideBalance } = useSettings();

  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const selectedAccount =
    accounts.find((account) => account.id === selectedAccountId) ?? accounts[0];
  const selectedAccountName = selectedAccount?.name;

  const visibleTransactions = useTransactions({
    accountId: selectedAccount?.id ?? null,
    filter,
    searchText,
  });

  const recentTransactions = useTransactions().slice(0, 5);

  useDocumentTitle(selectedAccountName ? `Dashboard: ${selectedAccountName}` : "Dashboard");

  function handleToggleFavorite(transactionId) {
    dispatch(favoriteToggled(transactionId));
  }

  if (isLoading) return <LoadingMessage message="Caricamento dei movimenti..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  if (accounts.length === 0) return <EmptyState message="Nessun conto disponibile." />;

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="dashboard">
      <button type="button" onClick={toggleHideBalance}>
        {hideBalance ? "Mostra saldi" : "Nascondi saldi"}
      </button>

      <BalanceCard total={totalBalance} note="Somma di tutti i tuoi conti" />

      <Card title="Ultimi movimenti" footer="Gli ultimi 5 movimenti di tutti i conti">
        <TransactionList
          transactions={recentTransactions}
          onToggleFavorite={handleToggleFavorite}
        />
      </Card>

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
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </Card>

      <p>
        <Link to="/transfer">Nuovo bonifico</Link>
      </p>
    </div>
  );
}
