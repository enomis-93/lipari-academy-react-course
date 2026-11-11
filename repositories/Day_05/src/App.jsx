import { customer } from "./data/mockData.js";
import Header from "./components/Header.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  return <main><Header customer={customer} /><Dashboard /></main>;
}
