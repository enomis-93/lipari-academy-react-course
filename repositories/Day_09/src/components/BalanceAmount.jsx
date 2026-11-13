import { useSettings } from "../context/SettingsContext.jsx";
import { formatCurrency } from "../utils/formatters.js";

function BalanceAmount({ value }) {
  const { hideBalance } = useSettings();

  if (hideBalance) {
    return (
      <>
        <span aria-hidden="true">••••••</span>
        <span className="visually-hidden">Saldo nascosto</span>
      </>
    );
  }

  return formatCurrency(value);
}

export default BalanceAmount;
