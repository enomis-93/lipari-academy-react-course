import { Link, useParams } from "react-router";
import TransactionContent from "../components/TransactionContent.jsx";
import { sortByDate } from "../utils/format.js";
import { useBank } from "../context/BankContext.jsx";

export default function AccountDetailPage() {
  const bank = useBank();
  const { accountId } = useParams();
  const account = bank.accounts.find((item) => item.id === accountId);
  if (!account) return <p>Conto non trovato. <Link to="/accounts">Torna ai conti</Link></p>;
  return <section><h2>Movimenti · {account.name}</h2><TransactionContent bank={bank} items={sortByDate(bank.transactions.filter((item) => item.accountId === accountId))} /></section>;
}
