import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import { getTransactions } from "../services/transactionService.js";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { signal }) => getTransactions({ signal }),
  {
    condition: (_, { getState }) => getState().transactions.status !== "loading",
  },
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    transferAdded: {
      reducer(state, action) {
        state.items.unshift(action.payload);
      },
      prepare({ accountId, beneficiaryName, amount }) {
        return {
          payload: {
            id: `trx-${nanoid(8)}`,
            accountId,
            date: new Date().toISOString().slice(0, 10),
            description: `Bonifico a ${beneficiaryName}`,
            amount: -amount,
            category: "Bonifici",
          },
        };
      },
    },
    favoriteToggled(state, action) {
      const transaction = state.items.find((item) => item.id === action.payload);
      if (transaction) {
        transaction.isFavorite = !transaction.isFavorite;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.status = "failed";
        state.error = "Impossibile caricare i movimenti. Riprova più tardi.";
      });
  },
});

export const { transferAdded, favoriteToggled } = transactionsSlice.actions;

export const selectTransactions = (state) => state.transactions.items;
export const selectTransactionsStatus = (state) => state.transactions.status;
export const selectTransactionsError = (state) => state.transactions.error;

export default transactionsSlice.reducer;
