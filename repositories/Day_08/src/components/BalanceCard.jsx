import { useSettings } from "../context/SettingsContext.jsx";
import { formatCurrency } from "../utils/formatters.js";

function BalanceCard({ total, label = "Saldo totale", note }) {
  const { hideBalance } = useSettings();

  return (
    <section className="balance-card">
      <p className="balance-card__label">{label}</p>
      <p className="balance-card__value">
        {hideBalance ? "••••••" : formatCurrency(total)}
      </p>
      {note && <p className="balance-card__meta">{note}</p>}
    </section>
  );
}

export default BalanceCard;
