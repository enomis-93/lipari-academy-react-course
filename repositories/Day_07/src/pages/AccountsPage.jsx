import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import { useSettings } from "../context/SettingsContext.jsx";
import { selectAccounts } from "../store/accountsSlice.js";
import {
  fetchTransactions,
  selectTransactionsError,
  selectTransactionsStatus,
} from "../store/transactionsSlice.js";
import { formatCurrency } from "../utils/formatters.js";

function getLinkClassName({ isActive }) {
  return isActive ? "account-link account-link-active" : "account-link";
}

export default function AccountsPage() {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const status = useSelector(selectTransactionsStatus);
  const error = useSelector(selectTransactionsError);
  const { hideBalance } = useSettings();

  if (status === "idle" || status === "loading") {
    return <LoadingMessage message="Caricamento dei conti..." />;
  }
  if (status === "failed") {
    return <ErrorMessage message={error} onRetry={() => dispatch(fetchTransactions())} />;
  }

  return (
    <section>
      <h1>I tuoi conti</h1>

      <div className="accounts-layout">
        <ul className="account-links">
          {accounts.map((account) => (
            <li key={account.id}>
              <NavLink
                to={`/accounts/${account.id}`}
                className={getLinkClassName}
              >
                <strong>{account.name}</strong>
                <span>{hideBalance ? "••••••" : formatCurrency(account.balance)}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="account-detail">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
