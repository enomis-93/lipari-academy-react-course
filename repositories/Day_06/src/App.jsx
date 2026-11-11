import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router";
import { accounts as initialAccounts, beneficiaries, customer } from "./data/mockData.js";
import { formatMoney, sortByDate } from "./utils/format.js";
import { getTransactions } from "./services/transactionService.js";
import Header from "./components/Header.jsx";
import BalanceCard from "./components/BalanceCard.jsx";
import Card from "./components/Card.jsx";
import AccountList from "./components/AccountList.jsx";
import TransactionList from "./components/TransactionList.jsx";
import TransactionFilters from "./components/TransactionFilters.jsx";
import TransferForm from "./components/TransferForm.jsx";
import LoadingMessage from "./components/LoadingMessage.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";
import EmptyState from "./components/EmptyState.jsx";

function Layout() {
  return <main><Header customer={customer} /><nav aria-label="Navigazione principale">
    <NavLink to="/" end>Dashboard</NavLink><NavLink to="/accounts">Conti</NavLink><NavLink to="/transactions">Movimenti</NavLink><NavLink to="/transfer">Bonifico</NavLink>
  </nav><Outlet /></main>;
}

function ListContent({ bank, items }) {
  if (bank.loading) return <LoadingMessage />;
  if (bank.error) return <ErrorMessage message={bank.error} onRetry={bank.retry} />;
  return <TransactionList transactions={items} onToggleFavorite={bank.toggleFavorite} />;
}

function DashboardPage({ bank }) {
  const [selectedId, setSelectedId] = useState(initialAccounts[0].id);
  const [hidden, setHidden] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const selected = bank.accounts.find((account) => account.id === selectedId);
  const items = filterTransactions(bank.transactions, filter, search, selectedId);
  return <>
    <BalanceCard balance={bank.accounts.reduce((sum, account) => sum + account.balance, 0)} hidden={hidden} onToggle={() => setHidden(!hidden)} />
    <Card title="I tuoi conti"><AccountList accounts={bank.accounts} transactions={bank.transactions} selectedAccountId={selectedId} onSelect={setSelectedId} hidden={hidden} /></Card>
    <Card title={`Movimenti · ${selected.name}`}><TransactionFilters filter={filter} searchText={search} onFilterChange={setFilter} onSearchChange={setSearch} /><ListContent bank={bank} items={items} /></Card>
  </>;
}

function AccountsPage({ bank }) {
  if (!bank.accounts.length) return <EmptyState message="Nessun conto disponibile." />;
  return <Card title="Conti"><div className="accounts">{bank.accounts.map((account) => <article className="account" key={account.id}><h3><Link to={`/accounts/${account.id}`}>{account.name}</Link></h3><p>{account.iban}</p><p>{formatMoney(account.balance)}</p></article>)}</div><Outlet /></Card>;
}

function AccountDetailPage({ bank }) {
  const { accountId } = useParams();
  const account = bank.accounts.find((item) => item.id === accountId);
  if (!account) return <p>Conto non trovato. <Link to="/accounts">Torna ai conti</Link></p>;
  return <section><h2>Movimenti · {account.name}</h2><ListContent bank={bank} items={sortByDate(bank.transactions.filter((item) => item.accountId === accountId))} /></section>;
}

function filterTransactions(items, filter, search, accountId = "") {
  return sortByDate(items.filter((item) => (!accountId || item.accountId === accountId) &&
    (filter === "all" || (filter === "income" ? item.amount > 0 : item.amount < 0)) &&
    item.description.toLowerCase().includes(search.trim().toLowerCase())));
}

function TransactionsPage({ bank }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const location = useLocation();
  return <Card title="Movimenti">{location.state?.transferCompleted && <p role="status">Bonifico simulato registrato.</p>}
    <TransactionFilters filter={filter} searchText={search} onFilterChange={setFilter} onSearchChange={setSearch} />
    <ListContent bank={bank} items={filterTransactions(bank.transactions, filter, search)} />
  </Card>;
}

function TransferPage({ bank }) {
  const navigate = useNavigate();
  if (bank.loading) return <LoadingMessage />;
  if (bank.error) return <ErrorMessage message={bank.error} onRetry={bank.retry} />;
  return <Card title="Bonifico"><TransferForm accounts={bank.accounts} beneficiaries={beneficiaries} onTransfer={(values) => { bank.transfer(values); navigate("/transactions", { state: { transferCompleted: true } }); }} /></Card>;
}

export default function App() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    getTransactions(controller.signal).then(setTransactions).catch((err) => {
      if (err.name !== "AbortError") setError(err.message);
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);
  const toggleFavorite = (id) => setTransactions((items) => items.map((item) => item.id === id ? { ...item, favorite: !item.favorite } : item));
  const transfer = (values) => {
    const amount = Number(values.amount);
    const beneficiary = beneficiaries.find((item) => item.id === values.beneficiaryId);
    const transaction = { id: crypto.randomUUID(), accountId: values.fromAccountId, date: new Date().toISOString().slice(0, 10), description: `Bonifico a ${beneficiary.name}`, amount: -amount, category: "Bonifici", reason: values.reason };
    setTransactions((items) => [transaction, ...items]);
    setAccounts((items) => items.map((account) => account.id === values.fromAccountId ? { ...account, balance: Math.round((account.balance - amount) * 100) / 100 } : account));
  };
  const bank = { accounts, transactions, loading, error, retry: () => setAttempt((value) => value + 1), toggleFavorite, transfer };
  return <Routes><Route element={<Layout />}>
    <Route index element={<DashboardPage bank={bank} />} />
    <Route path="accounts" element={<AccountsPage bank={bank} />}><Route index element={<p>Seleziona un conto.</p>} /><Route path=":accountId" element={<AccountDetailPage bank={bank} />} /></Route>
    <Route path="transactions" element={<TransactionsPage bank={bank} />} />
    <Route path="transfer" element={<TransferPage bank={bank} />} />
    <Route path="*" element={<Card title="404"><p>Pagina non trovata.</p><Link to="/">Torna alla dashboard</Link></Card>} />
  </Route></Routes>;
}
