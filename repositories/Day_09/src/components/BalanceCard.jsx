import BalanceAmount from "./BalanceAmount.jsx";

function BalanceCard({ total, label = "Saldo totale", note }) {
  return (
    <section className="balance-card">
      <p className="balance-card__label">{label}</p>
      <p className="balance-card__value">
        <BalanceAmount value={total} />
      </p>
      {note && <p className="balance-card__meta">{note}</p>}
    </section>
  );
}

export default BalanceCard;
