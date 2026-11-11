import { accounts, transactions } from "../data/mockData.js";
import { sortByDate } from "../utils/format.js";
import AccountList from "./AccountList.jsx";
import BalanceCard from "./BalanceCard.jsx";
import Card from "./Card.jsx";
import TransactionList from "./TransactionList.jsx";

export default function Dashboard() {
  const total = accounts.reduce((sum, account) => sum + account.balance, 0);
  return <>
    <BalanceCard balance={total} />
    <Card title="Ultimi movimenti"><TransactionList transactions={sortByDate(transactions).slice(0, 5)} /></Card>
    <Card title="I tuoi conti"><AccountList accounts={accounts} transactions={transactions} /></Card>
    {accounts.map((account) => <Card key={account.id} title={`Movimenti · ${account.name}`}><TransactionList transactions={sortByDate(transactions.filter((transaction) => transaction.accountId === account.id)).slice(0, 3)} /></Card>)}
  </>;
}
