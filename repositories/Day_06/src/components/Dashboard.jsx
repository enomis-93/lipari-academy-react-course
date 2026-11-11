import { useEffect, useState } from "react";
import { accounts as initialAccounts, beneficiaries } from "../data/mockData.js";
import { sortByDate } from "../utils/format.js";
import AccountList from "./AccountList.jsx";
import BalanceCard from "./BalanceCard.jsx";
import Card from "./Card.jsx";
import TransactionList from "./TransactionList.jsx";
import TransactionFilters from "./TransactionFilters.jsx";
import TransferForm from "./TransferForm.jsx";
import LoadingMessage from "./LoadingMessage.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import { getTransactions } from "../services/transactionService.js";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0].id);
  const [hidden, setHidden] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    getTransactions(controller.signal).then(setTransactions).catch((err) => {
      if (err.name !== "AbortError") setError(err.message);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [attempt]);
  const total = accounts.reduce((sum, account) => sum + account.balance, 0);
  const selected = accounts.find((account) => account.id === selectedAccountId);
  const visible = sortByDate(transactions.filter((transaction) =>
    transaction.accountId === selectedAccountId &&
    (filter === "all" || (filter === "income" ? transaction.amount > 0 : transaction.amount < 0)) &&
    transaction.description.toLowerCase().includes(searchText.trim().toLowerCase())
  ));
  const toggleFavorite = (id) => setTransactions((items) => items.map((item) => item.id === id ? { ...item, favorite: !item.favorite } : item));
  const transfer = (values) => {
    const amount = Number(values.amount);
    const beneficiary = beneficiaries.find((item) => item.id === values.beneficiaryId);
    const transaction = { id: crypto.randomUUID(), accountId: values.fromAccountId, date: new Date().toISOString().slice(0, 10), description: `Bonifico a ${beneficiary.name}`, amount: -amount, category: "Bonifici", reason: values.reason };
    setTransactions((items) => [transaction, ...items]);
    setAccounts((items) => items.map((account) => account.id === values.fromAccountId ? { ...account, balance: Math.round((account.balance - amount) * 100) / 100 } : account));
    setSelectedAccountId(values.fromAccountId);
  };
  return <>
    <BalanceCard balance={total} hidden={hidden} onToggle={() => setHidden(!hidden)} />
    <Card title="I tuoi conti"><AccountList accounts={accounts} transactions={transactions} selectedAccountId={selectedAccountId} onSelect={setSelectedAccountId} hidden={hidden} /></Card>
    <Card title={`Movimenti · ${selected.name}`}><TransactionFilters filter={filter} searchText={searchText} onFilterChange={setFilter} onSearchChange={setSearchText} />{loading ? <LoadingMessage /> : error ? <ErrorMessage message={error} onRetry={() => setAttempt((value) => value + 1)} /> : <TransactionList transactions={visible} onToggleFavorite={toggleFavorite} />}</Card>
    {!loading && !error && <Card title="Bonifico"><TransferForm accounts={accounts} beneficiaries={beneficiaries} onTransfer={transfer} /></Card>}
  </>;
}
