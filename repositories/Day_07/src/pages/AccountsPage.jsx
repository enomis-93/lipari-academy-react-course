import { Link, Outlet } from "react-router";
import Card from "../components/Card.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useSettings } from "../context/SettingsContext.jsx";
import { useBank } from "../context/BankContext.jsx";
import { formatMoney } from "../utils/format.js";

export default function AccountsPage() {
  const bank = useBank();
  const { hidden } = useSettings();
  if (!bank.accounts.length) return <EmptyState message="Nessun conto disponibile." />;
  return <Card title="Conti"><div className="accounts">{bank.accounts.map((account) => <article className="account" key={account.id}><h3><Link to={`/accounts/${account.id}`}>{account.name}</Link></h3><p>{account.iban}</p><p>{hidden ? "••••" : formatMoney(account.balance)}</p></article>)}</div><Outlet /></Card>;
}
