import AccountCard from "./AccountCard.jsx";
import EmptyState from "./EmptyState.jsx";

function AccountList({ accounts, transactions }) {
  if (accounts.length === 0) {
    return <EmptyState message="Nessun conto disponibile." />;
  }

  return (
    <div className="account-list">
      {accounts.map((account) => {
        const transactionCount = transactions.filter(
          (transaction) => transaction.accountId === account.id
        ).length;

        return (
          <AccountCard
            key={account.id}
            account={account}
            transactionCount={transactionCount}
          />
        );
      })}
    </div>
  );
}

export default AccountList;
