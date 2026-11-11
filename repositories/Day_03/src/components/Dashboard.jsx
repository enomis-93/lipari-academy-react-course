import { useState } from "react";
import { accounts, transactions as initialTransactions } from "../data/mockData.js";
import { sortByDate } from "../utils/format.js";
import AccountList from "./AccountList.jsx";
import BalanceCard from "./BalanceCard.jsx";
import Card from "./Card.jsx";
import TransactionList from "./TransactionList.jsx";
import TransactionFilters from "./TransactionFilters.jsx";

export default function Dashboard() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0].id);
  const [hidden, setHidden] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const total = accounts.reduce((sum, account) => sum + account.balance, 0);
  const selected = accounts.find((account) => account.id === selectedAccountId);
  const visible = sortByDate(transactions.filter((transaction) =>
    transaction.accountId === selectedAccountId &&
    (filter === "all" || (filter === "income" ? transaction.amount > 0 : transaction.amount < 0)) &&
    transaction.description.toLowerCase().includes(searchText.trim().toLowerCase())
  ));
  const toggleFavorite = (id) => setTransactions((items) => items.map((item) => item.id === id ? { ...item, favorite: !item.favorite } : item));
  return <>
    <BalanceCard balance={total} hidden={hidden} onToggle={() => setHidden(!hidden)} />
    <Card title="I tuoi conti"><AccountList accounts={accounts} transactions={transactions} selectedAccountId={selectedAccountId} onSelect={setSelectedAccountId} hidden={hidden} /></Card>
    <Card title={`Movimenti · ${selected.name}`}><TransactionFilters filter={filter} searchText={searchText} onFilterChange={setFilter} onSearchChange={setSearchText} /><TransactionList transactions={visible} onToggleFavorite={toggleFavorite} /></Card>
  </>;
}
