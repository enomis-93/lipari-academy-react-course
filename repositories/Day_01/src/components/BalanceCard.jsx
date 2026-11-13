import { accounts } from "../data/mockData.js";
import { formatCurrency, formatDate } from "../utils/formatters.js";

function BalanceCard() {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );
  const lastUpdate = "2026-10-28";

  return (
    <section className="balance-card">
      <p className="balance-card__label">Saldo totale</p>
      <p className="balance-card__value">{formatCurrency(totalBalance)}</p>
      <p className="balance-card__meta">{accounts.length} conti</p>
      <p className="balance-card__meta">
        Ultimo aggiornamento: {formatDate(lastUpdate)}
      </p>
    </section>
  );
}

export default BalanceCard;
