import { Link, useParams } from "react-router";
import Card from "../components/Card.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { formatCurrency } from "../utils/formatters.js";

export default function AccountDetailPage({
  accounts,
  transactions,
  isLoading,
  error,
  onRetry,
  onToggleFavorite,
}) {
  const { accountId } = useParams();
  const account = accounts.find((item) => item.id === accountId);

  if (!account) {
    return (
      <section>
        <h2>Conto non trovato</h2>
        <p>Non esiste nessun conto con id "{accountId}".</p>
        <Link to="/accounts">Torna ai conti</Link>
      </section>
    );
  }

  const accountTransactions = transactions
    .filter((item) => item.accountId === account.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  let content;

  if (isLoading) {
    content = <LoadingMessage message="Caricamento dei movimenti..." />;
  } else if (error) {
    content = <ErrorMessage message={error} onRetry={onRetry} />;
  } else {
    content = (
      <TransactionList
        transactions={accountTransactions}
        onToggleFavorite={onToggleFavorite}
      />
    );
  }

  return (
    <section>
      <Card title={account.name}>
        <p>{account.iban}</p>
        <p>Saldo: {formatCurrency(account.balance)}</p>
      </Card>

      <h2>Movimenti del conto</h2>
      {content}
    </section>
  );
}
