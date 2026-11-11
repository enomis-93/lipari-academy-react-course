import { formatDate, formatMoney } from "../utils/format.js";

export default function TransactionItem({ transaction, onToggleFavorite }) {
  return <li className="transaction"><span><strong>{transaction.description}</strong><br />{formatDate(transaction.date)} · {transaction.category} · {transaction.amount < 0 ? "Uscita" : "Entrata"} {onToggleFavorite && <button type="button" onClick={() => onToggleFavorite(transaction.id)} aria-pressed={Boolean(transaction.favorite)}>{transaction.favorite ? "★ Preferito" : "☆ Preferito"}</button>}</span><strong className={transaction.amount < 0 ? "expense" : "income"}>{formatMoney(transaction.amount)}</strong></li>;
}
