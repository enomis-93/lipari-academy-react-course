import { formatCurrency } from "../utils/formatters.js";

function BalanceCard({ total, label = "Saldo totale", note, hidden = false }) {
  return (
    <section className="balance-card">
      <p className="balance-card__label">{label}</p>
      <p className="balance-card__value">
        {hidden ? "••••••" : formatCurrency(total)}
      </p>
      {note && <p className="balance-card__meta">{note}</p>}
    </section>
  );
}

export default BalanceCard;
