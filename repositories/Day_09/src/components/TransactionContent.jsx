import ErrorMessage from "./ErrorMessage.jsx";
import LoadingMessage from "./LoadingMessage.jsx";
import TransactionList from "./TransactionList.jsx";

export default function TransactionContent({ bank, items }) {
  if (bank.loading) return <LoadingMessage />;
  if (bank.error) return <ErrorMessage message={bank.error} onRetry={bank.retry} />;
  return <TransactionList transactions={items} onToggleFavorite={bank.toggleFavorite} />;
}
