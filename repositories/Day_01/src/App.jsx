import { accounts, customer, transactions } from "./data/mockData.js";
import Header from "./components/Header.jsx";
import BalanceCard from "./components/BalanceCard.jsx";
import RecentTransactions from "./components/RecentTransactions.jsx";

export default function App() {
  const total = accounts.reduce((sum, account) => sum + account.balance, 0);
  return <main><Header customer={customer} /><BalanceCard balance={total} /><RecentTransactions transactions={transactions} /></main>;
}
