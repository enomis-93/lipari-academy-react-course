import { formatMoney } from "../utils/format.js";

export default function AccountCard({ account, count }) {
  return <article className="account"><h3>{account.name}</h3><p>{account.iban}</p><p>{formatMoney(account.balance)}</p><p>{count} movimenti {account.balance >= 10000 && "· Saldo elevato"}</p></article>;
}
