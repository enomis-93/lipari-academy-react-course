import { formatCurrency, formatDate } from "../utils/formatters.js";

function TransactionItem({ transaction, onToggleFavorite }) {
  const isExpense = transaction.amount < 0;
  const isFavorite = Boolean(transaction.isFavorite);

  return (
    <li className="transaction-item">
      <div className="transaction-item__main">
        <span className="transaction-item__description">
          {transaction.description}
        </span>
        <span className="transaction-item__meta">
          {formatDate(transaction.date)} · {transaction.category}
        </span>
      </div>
      <div className="transaction-item__side">
        <span className={isExpense ? "badge badge--expense" : "badge badge--income"}>
          {isExpense ? "Uscita" : "Entrata"}
        </span>
        <span className={isExpense ? "amount amount--expense" : "amount amount--income"}>
          {formatCurrency(transaction.amount)}
        </span>
        <button
          type="button"
          className="favorite-button"
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(transaction.id)}
        >
          <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span> Preferito
        </button>
      </div>
    </li>
  );
}

export default TransactionItem;
