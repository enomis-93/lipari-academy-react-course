import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import Card from "../components/Card.jsx";
import TransactionContent from "../components/TransactionContent.jsx";
import TransactionFilters from "../components/TransactionFilters.jsx";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { useTransactions } from "../hooks/useTransactions.js";
import { formatMoney } from "../utils/format.js";
import { useBank } from "../context/BankContext.jsx";

export default function TransactionsPage() {
  const bank = useBank();
  const [filter, setFilter] = useLocalStorage("liparibank.filter", "all");
  const [search, setSearch] = useState("");
  const [accountId, setAccountId] = useState("");
  const location = useLocation();
  const items = useTransactions(bank.transactions, filter, search, accountId);
  const expenses = useMemo(() => items.filter((item) => item.amount < 0).reduce((totals, item) => {
    totals[item.category] = (totals[item.category] || 0) - item.amount;
    return totals;
  }, {}), [items]);
  useEffect(() => {
    if (location.state?.transferCompleted) setFilter("all");
  }, [location.state?.transferCompleted]);
  return <Card title="Movimenti">{location.state?.transferCompleted && <p role="status">Bonifico simulato registrato.</p>}
    <TransactionFilters filter={filter} searchText={search} onFilterChange={setFilter} onSearchChange={setSearch} />
    <label>Conto <select value={accountId} onChange={(event) => setAccountId(event.target.value)}><option value="">Tutti i conti</option>{bank.accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label>
    <TransactionContent bank={bank} items={items} />
    <h3>Uscite per categoria</h3>{Object.keys(expenses).length ? <ul>{Object.entries(expenses).map(([category, total]) => <li key={category}>{category}: {formatMoney(total)}</li>)}</ul> : <p>Nessuna uscita.</p>}
  </Card>;
}
