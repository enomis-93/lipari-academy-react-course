import { formatCurrency, formatDate } from "../utils/formatters.js";

function TransactionItem({ transaction }) {
  const isExpense = transaction.amount < 0;

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
      </div>
    </li>
  );
}

export default TransactionItem;
