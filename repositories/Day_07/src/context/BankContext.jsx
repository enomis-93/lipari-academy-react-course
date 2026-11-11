import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { beneficiaries } from "../data/mockData.js";
import { getAccounts } from "../services/accountService.js";
import { getTransactions } from "../services/transactionService.js";
import { bankReducer, initialBankState } from "./bankReducer.js";

const BankContext = createContext(null);

export function BankProvider({ children }) {
  const [state, dispatch] = useReducer(bankReducer, initialBankState);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "loading" });
    Promise.all([getAccounts(controller.signal), getTransactions(controller.signal)])
      .then(([accounts, transactions]) => dispatch({ type: "loaded", accounts, transactions }))
      .catch((error) => { if (!controller.signal.aborted) dispatch({ type: "error", message: error.message }); });
    return () => controller.abort();
  }, [attempt]);
  function transfer(values) {
    const beneficiary = beneficiaries.find((item) => item.id === values.beneficiaryId);
    dispatch({ type: "transfer", transaction: {
      id: crypto.randomUUID(), accountId: values.fromAccountId, date: new Date().toISOString().slice(0, 10),
      description: `Bonifico a ${beneficiary.name}`, amount: -Number(values.amount), category: "Bonifici", reason: values.reason,
    } });
  }
  const bank = { ...state, retry: () => setAttempt((value) => value + 1), toggleFavorite: (id) => dispatch({ type: "favorite", id }), transfer };
  return <BankContext.Provider value={bank}>{children}</BankContext.Provider>;
}

export function useBank() {
  const context = useContext(BankContext);
  if (!context) throw new Error("useBank richiede BankProvider.");
  return context;
}
