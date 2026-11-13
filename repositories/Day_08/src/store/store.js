import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./accountsSlice.js";
import transactionsReducer from "./transactionsSlice.js";

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    transactions: transactionsReducer,
  },
});
