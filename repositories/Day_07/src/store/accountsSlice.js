import { createSlice } from "@reduxjs/toolkit";
import { accounts as mockAccounts } from "../data/mockData.js";
import { transferAdded } from "./transactionsSlice.js";

function roundCents(value) {
  return Math.round(value * 100) / 100;
}

const accountsSlice = createSlice({
  name: "accounts",
  initialState: { items: mockAccounts },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(transferAdded, (state, action) => {
      const account = state.items.find((item) => item.id === action.payload.accountId);
      if (account) {
        account.balance = roundCents(account.balance + action.payload.amount);
      }
    });
  },
});

export const selectAccounts = (state) => state.accounts.items;

export default accountsSlice.reducer;
