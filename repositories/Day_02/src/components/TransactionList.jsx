import EmptyState from "./EmptyState.jsx";
import TransactionItem from "./TransactionItem.jsx";

function TransactionList({ transactions }) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        message="Nessun movimento da mostrare."
        hint="Quando ci saranno operazioni, le vedrai qui."
      />
    );
  }

  return (
    <ul className="transaction-list">
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </ul>
  );
}

export default TransactionList;
