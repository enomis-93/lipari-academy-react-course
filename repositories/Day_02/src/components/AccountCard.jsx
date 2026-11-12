import { formatCurrency } from "../utils/formatters.js";

function AccountCard({ account, transactionCount }) {
  return (
    <article className="account-card">
      <h3 className="account-card__name">{account.name}</h3>
      <p className="account-card__iban">{account.iban}</p>
      <p className="account-card__balance">{formatCurrency(account.balance)}</p>

      {account.balance > 10000 && (
        <span className="badge badge--info">Saldo elevato</span>
      )}

      {transactionCount > 0 ? (
        <p className="account-card__meta">{transactionCount} movimenti</p>
      ) : (
        <p className="account-card__meta">Nessun movimento</p>
      )}
    </article>
  );
}

export default AccountCard;
