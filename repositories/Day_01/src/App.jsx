import Header from "./components/Header.jsx";
import BalanceCard from "./components/BalanceCard.jsx";
import RecentTransactions from "./components/RecentTransactions.jsx";

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <BalanceCard />
        <RecentTransactions />
      </main>
    </div>
  );
}

export default App;
