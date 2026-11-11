import { useEffect, useState } from "react";
import { getTransactions } from "../services/transactionService.js";
import TransactionList from "../components/TransactionList.jsx";
import { sortByDate } from "../utils/format.js";

export default function ModernTransactionsPanel({ accountId }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    getTransactions(controller.signal).then(setTransactions).catch((err) => {
      if (err.name !== "AbortError") setError(err.message);
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [accountId, attempt]);
  return <section><h2>Movimenti (Hooks)</h2><button type="button" onClick={() => setAttempt((value) => value + 1)}>Ricarica</button>
    {loading ? <p>Caricamento in corso...</p> : error ? <p role="alert">{error}</p> : <TransactionList transactions={sortByDate(transactions.filter((item) => item.accountId === accountId))} />}
  </section>;
}
