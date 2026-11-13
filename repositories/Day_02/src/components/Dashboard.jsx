import { accounts, transactions } from "../data/mockData.js";
import BalanceCard from "./BalanceCard.jsx";
import Card from "./Card.jsx";
import AccountList from "./AccountList.jsx";
import TransactionList from "./TransactionList.jsx";

function sortByDateDesc(list) {
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

function Dashboard() {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  const recentTransactions = sortByDateDesc(transactions).slice(0, 5);

  return (
    <main className="dashboard">
      <BalanceCard total={totalBalance} note="Somma di tutti i tuoi conti" />

      <Card title="I tuoi conti">
        <AccountList accounts={accounts} transactions={transactions} />
      </Card>

      <Card title="Ultimi movimenti" footer="Mostrati gli ultimi 5 movimenti">
        <TransactionList transactions={recentTransactions} />
      </Card>

      {accounts.map((account) => {
        const accountTransactions = sortByDateDesc(
          transactions.filter(
            (transaction) => transaction.accountId === account.id
          )
        ).slice(0, 3);

        return (
          <Card key={account.id} title={`Movimenti · ${account.name}`}>
            <TransactionList transactions={accountTransactions} />
          </Card>
        );
      })}
    </main>
  );
}

export default Dashboard;
