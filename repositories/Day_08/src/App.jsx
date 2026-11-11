import { Route, Routes } from "react-router";
import ErrorMessage from "./components/ErrorMessage.jsx";
import LoadingMessage from "./components/LoadingMessage.jsx";
import { useBank } from "./context/BankContext.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AccountsPage from "./pages/AccountsPage.jsx";
import AccountDetailPage from "./pages/AccountDetailPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import TransferPage from "./pages/TransferPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  const bank = useBank();
  if (bank.loading) return <main><LoadingMessage /></main>;
  if (bank.error) return <main><ErrorMessage message={bank.error} onRetry={bank.retry} /></main>;
  return <Routes><Route element={<AppLayout />}>
    <Route index element={<DashboardPage />} />
    <Route path="accounts" element={<AccountsPage />}><Route index element={<p>Seleziona un conto.</p>} /><Route path=":accountId" element={<AccountDetailPage />} /></Route>
    <Route path="transactions" element={<TransactionsPage />} />
    <Route path="transfer" element={<TransferPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route></Routes>;
}
