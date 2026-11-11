export const initialBankState = { accounts: [], transactions: [], loading: true, error: "" };

export function bankReducer(state, action) {
  switch (action.type) {
    case "loading": return { ...state, loading: true, error: "" };
    case "loaded": return { ...state, loading: false, accounts: action.accounts, transactions: action.transactions };
    case "error": return { ...state, loading: false, error: action.message };
    case "favorite": return { ...state, transactions: state.transactions.map((item) => item.id === action.id ? { ...item, favorite: !item.favorite } : item) };
    case "transfer": return {
      ...state,
      accounts: state.accounts.map((account) => account.id === action.transaction.accountId ? { ...account, balance: Math.round((account.balance + action.transaction.amount) * 100) / 100 } : account),
      transactions: [action.transaction, ...state.transactions],
    };
    default: throw new Error(`Azione bancaria sconosciuta: ${action.type}`);
  }
}
