import { NavLink, Outlet, useLocation } from "react-router";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import Header from "../components/Header.jsx";
import { customer } from "../data/mockData.js";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/accounts", label: "Conti" },
  { to: "/transactions", label: "Movimenti" },
  { to: "/transfer", label: "Bonifico" },
];

function getLinkClassName({ isActive }) {
  return isActive ? "nav-link nav-link-active" : "nav-link";
}

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="app">
      <Header customer={customer} />

      <nav className="main-nav" aria-label="Navigazione principale">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={getLinkClassName}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="app-main">
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
