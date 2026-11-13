import { useEffect, useState } from "react";
import { accounts, beneficiaries } from "../data/mockData.js";
import { getTransactions } from "../services/transactionService.js";
import AccountList from "./AccountList.jsx";
import BalanceCard from "./BalanceCard.jsx";
import Card from "./Card.jsx";
import EmptyState from "./EmptyState.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import LoadingMessage from "./LoadingMessage.jsx";
import TransactionFilters from "./TransactionFilters.jsx";
import TransactionList from "./TransactionList.jsx";
import TransferForm from "./TransferForm.jsx";

function getDisplayedBalance(account, transactions) {
  const simulatedDelta = transactions
    .filter(
      (transaction) =>
        transaction.accountId === account.id && transaction.category === "Bonifici",
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return Math.round((account.balance + simulatedDelta) * 100) / 100;
}

function Dashboard() {
  // dati remoti + stato della richiesta
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // stato UI
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0].id);
  const [hideBalance, setHideBalance] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadTransactions() {
      try {
        const remoteTransactions = await getTransactions({
          signal: controller.signal,
        });

        setTransactions((current) => {
          const remoteIds = new Set(remoteTransactions.map((item) => item.id));
          const localOnly = current.filter((item) => !remoteIds.has(item.id));
          return [...localOnly, ...remoteTransactions];
        });
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
        setError("Non è stato possibile caricare i movimenti.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadTransactions();

    return () => controller.abort();
  }, [reloadKey]);

  function handleRetry() {
    setError(null);
    setIsLoading(true);
    setReloadKey((current) => current + 1);
  }

  function handleToggleFavorite(transactionId) {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, isFavorite: !transaction.isFavorite }
          : transaction,
      ),
    );
  }

  function handleAddTransfer(transfer) {
    const beneficiary = beneficiaries.find((item) => item.id === transfer.beneficiaryId);
    if (!beneficiary) {
      return;
    }

    const newTransaction = {
      id: `trx-${Date.now()}`,
      accountId: transfer.accountId,
      date: new Date().toISOString().slice(0, 10),
      description: `Bonifico a ${beneficiary.name}`,
      amount: -transfer.amount,
      category: "Bonifici",
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setSelectedAccountId(transfer.accountId);
    setFilter("all");
    setSearchText("");
  }

  const accountsWithBalance = accounts.map((account) => ({
    ...account,
    balance: getDisplayedBalance(account, transactions),
  }));
  const totalBalance = accountsWithBalance.reduce((sum, account) => sum + account.balance, 0);
  const selectedAccount = accountsWithBalance.find((account) => account.id === selectedAccountId);
  const normalizedSearch = searchText.trim().toLowerCase();

  useEffect(() => {
    document.title = `LipariBank — ${selectedAccount.name}`;
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
    transactionsContent = <ErrorMessage message={error} onRetry={handleRetry} />;
  } else if (transactions.length === 0) {
    transactionsContent = (
      <EmptyState message="Non ci sono ancora movimenti per i tuoi conti." />
    );
  } else {
    transactionsContent = (
      <TransactionList
        transactions={visibleTransactions}
        onToggleFavorite={handleToggleFavorite}
      />
    );
  }

  return (
    <main className="dashboard">
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
          accounts={accountsWithBalance}
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

      <Card title="Nuovo bonifico (simulato)">
        <TransferForm
          accounts={accountsWithBalance}
          beneficiaries={beneficiaries}
          onAddTransfer={handleAddTransfer}
        />
      </Card>
    </main>
  );
}

export default Dashboard;
