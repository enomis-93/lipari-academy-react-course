import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAccounts } from "../services/accountService.js";
import { getErrorMessage } from "../utils/errorMessages.js";
import { transferAdded } from "./transactionsSlice.js";

export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async (_, { signal, rejectWithValue }) => {
    try {
      return await getAccounts({ signal });
    } catch (error) {
      console.error(error);
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => getState().accounts.status !== "loading",
  },
);

function roundCents(value) {
  return Math.round(value * 100) / 100;
}

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? getErrorMessage(null);
      })
      .addCase(transferAdded, (state, action) => {
        const account = state.items.find((item) => item.id === action.payload.accountId);
        if (account) {
          account.balance = roundCents(account.balance + action.payload.amount);
        }
      });
  },
});

export const selectAccounts = (state) => state.accounts.items;
export const selectAccountsStatus = (state) => state.accounts.status;
export const selectAccountsError = (state) => state.accounts.error;

export default accountsSlice.reducer;
