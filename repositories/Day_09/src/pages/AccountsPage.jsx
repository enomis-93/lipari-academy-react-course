import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router";
import BalanceAmount from "../components/BalanceAmount.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import { useBankStatus } from "../hooks/useBankStatus.js";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { selectAccounts } from "../store/accountsSlice.js";

function getLinkClassName({ isActive }) {
  return isActive ? "account-link account-link-active" : "account-link";
}

export default function AccountsPage() {
  const accounts = useSelector(selectAccounts);
  const { isLoading, error, reload } = useBankStatus();

  useDocumentTitle("Conti");

  if (isLoading) return <LoadingMessage message="Caricamento dei conti..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  if (accounts.length === 0) {
    return (
      <section>
        <h1>I tuoi conti</h1>
        <EmptyState message="Nessun conto disponibile." />
      </section>
    );
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
                <span>
                  <BalanceAmount value={account.balance} />
                </span>
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
