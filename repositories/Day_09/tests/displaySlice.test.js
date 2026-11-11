import test from "node:test";
import assert from "node:assert/strict";
import { configureStore } from "@reduxjs/toolkit";
import displayReducer, { selectCompact, toggleCompact } from "../src/store/displaySlice.js";

test("la densità cambia nello store senza mutare lo stato precedente", () => {
  const store = configureStore({ reducer: { display: displayReducer } });
  const previous = store.getState();
  assert.equal(selectCompact(previous), false);
  store.dispatch(toggleCompact());
  assert.equal(selectCompact(store.getState()), true);
  assert.equal(selectCompact(previous), false);
  store.dispatch(toggleCompact());
  assert.equal(selectCompact(store.getState()), false);
});
