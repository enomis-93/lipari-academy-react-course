import { useEffect, useState } from "react";
import AccountList from "../components/AccountList.jsx";
import BalanceCard from "../components/BalanceCard.jsx";
import Card from "../components/Card.jsx";
import TransactionContent from "../components/TransactionContent.jsx";
import TransactionFilters from "../components/TransactionFilters.jsx";
import { useSettings } from "../context/SettingsContext.jsx";
import { useBank } from "../context/BankContext.jsx";
import { useTransactions } from "../hooks/useTransactions.js";
import { sortByDate } from "../utils/format.js";

export default function DashboardPage() {
  const bank = useBank();
  const [selectedId, setSelectedId] = useState(bank.accounts[0]?.id ?? "");
  const { hidden, toggle } = useSettings();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const selected = bank.accounts.find((account) => account.id === selectedId);
  const items = useTransactions(bank.transactions, filter, search, selectedId);
  const recent = sortByDate(bank.transactions).slice(0, 5);
  useEffect(() => {
    const previousTitle = document.title;
    if (selected) document.title = `LipariBank — ${selected.name}`;
    return () => { document.title = previousTitle; };
  }, [selected]);
  return <>
    <BalanceCard balance={bank.accounts.reduce((sum, account) => sum + account.balance, 0)} hidden={hidden} onToggle={toggle} />
    <Card title="Ultimi movimenti"><TransactionContent bank={bank} items={recent} /></Card>
    <Card title="I tuoi conti"><AccountList accounts={bank.accounts} transactions={bank.transactions} selectedAccountId={selectedId} onSelect={setSelectedId} hidden={hidden} /></Card>
    {selected && <Card title={`Movimenti · ${selected.name}`}><TransactionFilters filter={filter} searchText={search} onFilterChange={setFilter} onSearchChange={setSearch} /><TransactionContent bank={bank} items={items} /></Card>}
  </>;
}
