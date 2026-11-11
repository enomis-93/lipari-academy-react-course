import { NavLink, Outlet } from "react-router";
import { useSelector } from "react-redux";
import DisplayDensity from "../components/DisplayDensity.jsx";
import { selectCompact } from "../store/displaySlice.js";
import Header from "../components/Header.jsx";
import { customer } from "../data/mockData.js";

export default function AppLayout() {
  const compact = useSelector(selectCompact);
  return <main className={compact ? "compact-view" : undefined}><Header customer={customer} /><nav aria-label="Navigazione principale">
    <NavLink to="/" end>Dashboard</NavLink><NavLink to="/accounts">Conti</NavLink><NavLink to="/transactions">Movimenti</NavLink><NavLink to="/transfer">Bonifico</NavLink>
  </nav><DisplayDensity /><Outlet /></main>;
}
