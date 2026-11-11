import { formatMoney } from "../utils/format.js";

export default function BalanceCard({ balance, hidden, onToggle }) {
  return <section className="balance"><h2>Saldo totale</h2><strong>{hidden ? "••••" : formatMoney(balance)}</strong><p><button type="button" onClick={onToggle}>{hidden ? "Mostra saldo" : "Nascondi saldo"}</button></p></section>;
}
