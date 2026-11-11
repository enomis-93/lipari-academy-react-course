import { test } from "node:test";
import assert from "node:assert/strict";
import { bankReducer, initialBankState } from "../src/context/bankReducer.js";

test("transfer updates balance and movement without mutating state", () => {
  const state = { ...initialBankState, accounts: [{ id: "acc-001", balance: 4250.75 }], transactions: [], loading: false };
  const transaction = { id: "new", accountId: "acc-001", amount: -100 };
  const result = bankReducer(state, { type: "transfer", transaction });
  assert.equal(result.accounts[0].balance, 4150.75);
  assert.deepEqual(result.transactions, [transaction]);
  assert.equal(state.accounts[0].balance, 4250.75);
  assert.deepEqual(state.transactions, []);
});
