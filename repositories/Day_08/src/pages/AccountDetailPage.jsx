import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import Card from "../components/Card.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { useSettings } from "../context/SettingsContext.jsx";
import { useTransactions } from "../hooks/useTransactions.js";
import { selectAccounts } from "../store/accountsSlice.js";
import { favoriteToggled } from "../store/transactionsSlice.js";
import { formatCurrency } from "../utils/formatters.js";

export default function AccountDetailPage() {
  const { accountId } = useParams();
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const accountTransactions = useTransactions({ accountId });
  const { hideBalance } = useSettings();

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

  return (
    <section>
      <Card title={account.name}>
        <p>{account.iban}</p>
        <p>Saldo: {hideBalance ? "••••••" : formatCurrency(account.balance)}</p>
      </Card>

      <h2>Movimenti del conto</h2>
      <TransactionList
        transactions={accountTransactions}
        onToggleFavorite={(transactionId) => dispatch(favoriteToggled(transactionId))}
      />
    </section>
  );
}
