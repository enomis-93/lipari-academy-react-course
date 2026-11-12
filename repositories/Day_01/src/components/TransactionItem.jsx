import { formatCurrency, formatDate } from "../utils/formatters.js";

function TransactionItem(props) {
  const { transaction } = props;
  const amountClass =
    transaction.amount < 0 ? "amount amount--expense" : "amount amount--income";

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
      <span className={amountClass}>{formatCurrency(transaction.amount)}</span>
    </li>
  );
}

export default TransactionItem;
