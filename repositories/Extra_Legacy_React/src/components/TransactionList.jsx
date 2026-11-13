import TransactionItem from "./TransactionItem.jsx";
import EmptyState from "./EmptyState.jsx";

function TransactionList({ transactions, onToggleFavorite }) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        message="Nessun movimento da mostrare."
        hint="Prova a cambiare conto, filtro o testo di ricerca."
      />
    );
  }

  return (
    <ul className="transaction-list">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </ul>
  );
}

export default TransactionList;
