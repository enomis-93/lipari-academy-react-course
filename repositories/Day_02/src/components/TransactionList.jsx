import EmptyState from "./EmptyState.jsx";
import TransactionItem from "./TransactionItem.jsx";

export default function TransactionList({ transactions }) {
  if (!transactions.length) return <EmptyState />;
  return <ul className="list">{transactions.map((transaction) => <TransactionItem key={transaction.id} transaction={transaction} />)}</ul>;
}
