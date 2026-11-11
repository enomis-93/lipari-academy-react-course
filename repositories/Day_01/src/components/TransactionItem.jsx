import { formatDate, formatMoney } from "../utils/format.js";

export default function TransactionItem({ transaction }) {
  return <li className="transaction"><span><strong>{transaction.description}</strong><br />{formatDate(transaction.date)} · {transaction.category}</span><strong className={transaction.amount < 0 ? "expense" : "income"}>{formatMoney(transaction.amount)}</strong></li>;
}
