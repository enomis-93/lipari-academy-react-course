import { useEffect, useState } from "react";
import { getTransactions } from "../services/transactionService.js";
import { formatCurrency, formatDate } from "../utils/formatters.js";

const FILTERS = [
  { value: "all", label: "Tutti" },
  { value: "income", label: "Entrate" },
  { value: "expense", label: "Uscite" },
];

function TransactionsPanelModern({
  accountId = "acc-001",
  title = "Movimenti (moderno)",
}) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "LipariBank - Movimenti (moderno)";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    getTransactions({ signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) {
          return;
        }
        setTransactions(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          return;
        }
        setError(err.message);
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [accountId, reloadCount]);

  const visible = transactions
    .filter((transaction) => transaction.accountId === accountId)
    .filter((transaction) => {
      if (filter === "income") return transaction.amount > 0;
      if (filter === "expense") return transaction.amount < 0;
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section>
      <h2>{title}</h2>
      <p>Conto: {accountId}</p>
      <button type="button" onClick={() => setReloadCount((prev) => prev + 1)}>
        Ricarica
      </button>
      <div>
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {isLoading && <p>Caricamento in corso...</p>}
      {error && <p role="alert">Errore: {error}</p>}
      {!isLoading && !error && visible.length === 0 && <p>Nessun movimento.</p>}
      <ul>
        {visible.map((transaction) => (
          <li key={transaction.id}>
            {formatDate(transaction.date)} — {transaction.description}:{" "}
            {formatCurrency(transaction.amount)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TransactionsPanelModern;
