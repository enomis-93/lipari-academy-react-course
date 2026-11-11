import AccountCard from "./AccountCard.jsx";
import EmptyState from "./EmptyState.jsx";

export default function AccountList({ accounts, transactions, selectedAccountId, onSelect, hidden }) {
  if (!accounts.length) return <EmptyState message="Nessun conto disponibile." />;
  return <div className="accounts">{accounts.map((account) => <AccountCard key={account.id} account={account} count={transactions.filter((transaction) => transaction.accountId === account.id).length} selected={selectedAccountId === account.id} onSelect={onSelect} hidden={hidden} />)}</div>;
}
