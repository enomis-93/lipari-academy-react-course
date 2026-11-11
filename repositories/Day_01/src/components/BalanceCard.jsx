import { formatMoney } from "../utils/format.js";

export default function BalanceCard({ balance }) {
  return <section className="balance"><h2>Saldo totale</h2><strong>{formatMoney(balance)}</strong></section>;
}
