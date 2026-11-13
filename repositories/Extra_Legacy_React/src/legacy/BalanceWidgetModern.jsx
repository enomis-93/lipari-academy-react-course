import { useState } from "react";
import { formatCurrency } from "../utils/formatters.js";

function BalanceWidgetModern({ accounts, accountId, title = "Saldo (moderno)" }) {
  const [hidden, setHidden] = useState(false);

  const account = accounts.find((item) => item.id === accountId);

  if (!account) {
    return <p>Conto non trovato.</p>;
  }

  return (
    <section>
      <h2>{title}</h2>
      <p>{account.name}</p>
      <p>{hidden ? "••••••" : formatCurrency(account.balance)}</p>
      <button type="button" onClick={() => setHidden((prevHidden) => !prevHidden)}>
        {hidden ? "Mostra saldo" : "Nascondi saldo"}
      </button>
    </section>
  );
}

export default BalanceWidgetModern;
