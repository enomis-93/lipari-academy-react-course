import TransactionItem from "./TransactionItem.jsx";
import { sortByDate } from "../utils/format.js";

export default function RecentTransactions({ transactions }) {
  return <section><h2>Ultimi movimenti</h2><ul className="list">{sortByDate(transactions).slice(0, 5).map((transaction) => <TransactionItem key={transaction.id} transaction={transaction} />)}</ul></section>;
}
