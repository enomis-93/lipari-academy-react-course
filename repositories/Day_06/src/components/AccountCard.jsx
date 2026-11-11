import { formatMoney } from "../utils/format.js";

export default function AccountCard({ account, count, selected, onSelect, hidden }) {
  return <article className="account"><h3>{account.name}</h3><p>{account.iban}</p><p>{hidden ? "••••" : formatMoney(account.balance)}</p><p>{count} movimenti {account.balance >= 10000 && "· Saldo elevato"}</p><button type="button" onClick={() => onSelect(account.id)} aria-pressed={selected}>{selected ? "Selezionato" : "Seleziona conto"}</button></article>;
}
