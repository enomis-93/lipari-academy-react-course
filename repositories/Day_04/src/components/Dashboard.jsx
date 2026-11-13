import { useState } from "react";
import {
  accounts,
  beneficiaries,
  transactions as initialTransactions,
} from "../data/mockData.js";
import AccountList from "./AccountList.jsx";
import BalanceCard from "./BalanceCard.jsx";
import Card from "./Card.jsx";
import TransactionFilters from "./TransactionFilters.jsx";
import TransactionList from "./TransactionList.jsx";
import TransferForm from "./TransferForm.jsx";

const initialTransactionIds = new Set(initialTransactions.map((transaction) => transaction.id));

function getDisplayedBalance(account, transactions) {
  const simulatedDelta = transactions
    .filter(
      (transaction) =>
        transaction.accountId === account.id && !initialTransactionIds.has(transaction.id),
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return Math.round((account.balance + simulatedDelta) * 100) / 100;
}

function Dashboard() {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0].id);
  const [hideBalance, setHideBalance] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [transactions, setTransactions] = useState(initialTransactions);

  const accountsWithBalance = accounts.map((account) => ({
    ...account,
    balance: getDisplayedBalance(account, transactions),
  }));
  const totalBalance = accountsWithBalance.reduce((sum, account) => sum + account.balance, 0);
  const selectedAccount = accountsWithBalance.find((account) => account.id === selectedAccountId);
  const normalizedSearch = searchText.trim().toLowerCase();

  const visibleTransactions = transactions
    .filter((transaction) => transaction.accountId === selectedAccountId)
    .filter((transaction) => {
      if (filter === "income") return transaction.amount > 0;
      if (filter === "expense") return transaction.amount < 0;
      return true;
    })
    .filter((transaction) => transaction.description.toLowerCase().includes(normalizedSearch))
    .sort((a, b) => b.date.localeCompare(a.date));

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
        <TransactionList
          transactions={visibleTransactions}
          onToggleFavorite={handleToggleFavorite}
        />
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
