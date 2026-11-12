import { transactions } from "../data/mockData.js";
import TransactionItem from "./TransactionItem.jsx";

function RecentTransactions() {
  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <section className="section">
      <h2 className="section__title">Ultimi movimenti</h2>
      <ul className="transaction-list">
        {recentTransactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </ul>
    </section>
  );
}

export default RecentTransactions;
