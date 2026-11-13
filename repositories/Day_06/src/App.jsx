import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import { accounts, beneficiaries } from "./data/mockData.js";
import { getTransactions } from "./services/transactionService.js";
import AppLayout from "./layouts/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AccountsPage from "./pages/AccountsPage.jsx";
import AccountDetailPage from "./pages/AccountDetailPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import TransferPage from "./pages/TransferPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function getDisplayedBalance(account, transactions) {
  const simulatedDelta = transactions
    .filter(
      (transaction) =>
        transaction.accountId === account.id && transaction.category === "Bonifici",
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return Math.round((account.balance + simulatedDelta) * 100) / 100;
}

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTransactions() {
      try {
        const remoteTransactions = await getTransactions({
          signal: controller.signal,
        });

        setTransactions((current) => {
          const remoteIds = new Set(remoteTransactions.map((item) => item.id));
          const localOnly = current.filter((item) => !remoteIds.has(item.id));
          return [...localOnly, ...remoteTransactions];
        });
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
        setError("Non è stato possibile caricare i movimenti.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadTransactions();

    return () => controller.abort();
  }, [reloadKey]);

  function handleRetry() {
    setError(null);
    setIsLoading(true);
    setReloadKey((current) => current + 1);
  }

  function handleToggleFavorite(transactionId) {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, isFavorite: !transaction.isFavorite }
          : transaction,
      ),
    );
  }

  function addTransfer(transfer) {
    const beneficiary = beneficiaries.find((item) => item.id === transfer.beneficiaryId);
    if (!beneficiary) {
      return;
    }

    const newTransaction = {
      id: `trx-${Date.now()}`,
      accountId: transfer.accountId,
      date: new Date().toISOString().slice(0, 10),
      description: `Bonifico a ${beneficiary.name}`,
      amount: -transfer.amount,
      category: "Bonifici",
    };

    setTransactions((prev) => [newTransaction, ...prev]);
  }

  const accountsWithBalance = accounts.map((account) => ({
    ...account,
    balance: getDisplayedBalance(account, transactions),
  }));

  const dataProps = {
    transactions,
    isLoading,
    error,
    onRetry: handleRetry,
    onToggleFavorite: handleToggleFavorite,
  };

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          index
          element={<DashboardPage accounts={accountsWithBalance} {...dataProps} />}
        />

        <Route
          path="accounts"
          element={<AccountsPage accounts={accountsWithBalance} />}
        >
          <Route
            index
            element={<p className="hint">Seleziona un conto per vederne i dettagli.</p>}
          />
          <Route
            path=":accountId"
            element={
              <AccountDetailPage accounts={accountsWithBalance} {...dataProps} />
            }
          />
        </Route>

        <Route path="transactions" element={<TransactionsPage {...dataProps} />} />

        <Route
          path="transfer"
          element={
            <TransferPage
              accounts={accountsWithBalance}
              onAddTransfer={addTransfer}
            />
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
