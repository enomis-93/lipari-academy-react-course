import { useState } from "react";
import { accounts } from "../data/mockData.js";
import LegacyTransactionsPanel from "./LegacyTransactionsPanel.jsx";
import TransactionsPanelModern from "./TransactionsPanelModern.jsx";

function LegacyLab() {
  const [accountId, setAccountId] = useState("acc-001");
  const [visible, setVisible] = useState(true);
  const [variant, setVariant] = useState("legacy");

  return (
    <main>
      <h1>Legacy Lab</h1>
      <label htmlFor="lab-account">Conto: </label>
      <select
        id="lab-account"
        value={accountId}
        onChange={(event) => setAccountId(event.target.value)}
      >
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>
      <label htmlFor="lab-variant"> Variante: </label>
      <select
        id="lab-variant"
        value={variant}
        onChange={(event) => setVariant(event.target.value)}
      >
        <option value="legacy">legacy</option>
        <option value="moderno">moderno</option>
      </select>
      <button type="button" onClick={() => setVisible((prev) => !prev)}>
        {visible ? "Smonta pannello" : "Monta pannello"}
      </button>
      {visible && variant === "legacy" && <LegacyTransactionsPanel accountId={accountId} />}
      {visible && variant === "moderno" && <TransactionsPanelModern accountId={accountId} />}
    </main>
  );
}

export default LegacyLab;
