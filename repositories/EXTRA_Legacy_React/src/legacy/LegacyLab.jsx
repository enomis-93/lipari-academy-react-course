import { useState } from "react";
import LegacyTransactionsPanel from "./LegacyTransactionsPanel.jsx";
import ModernTransactionsPanel from "./ModernTransactionsPanel.jsx";

export default function LegacyLab() {
  const [accountId, setAccountId] = useState("acc-001");
  return <section><h1>Laboratorio legacy</h1><label>Conto <select value={accountId} onChange={(event) => setAccountId(event.target.value)}><option value="acc-001">Conto Corrente</option><option value="acc-002">Conto Risparmio</option></select></label>
    <LegacyTransactionsPanel accountId={accountId} />
    <ModernTransactionsPanel accountId={accountId} />
  </section>;
}
