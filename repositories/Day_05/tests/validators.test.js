import { test } from "node:test";
import assert from "node:assert/strict";
import { validateTransfer } from "../src/utils/validators.js";

const accounts = [{ id: "acc-001", balance: 4250.75 }];
const beneficiaries = [{ id: "ben-001" }];
const valid = { fromAccountId: "acc-001", beneficiaryId: "ben-001", amount: "100", reason: "Test" };

test("valid transfer has no errors", () => {
  assert.deepEqual(validateTransfer(valid, accounts, beneficiaries), {});
});

test("invalid fields and insufficient balance are rejected", () => {
  const errors = validateTransfer({ fromAccountId: "", beneficiaryId: "", amount: "0", reason: "" }, accounts, beneficiaries);
  assert.deepEqual(Object.keys(errors).sort(), ["amount", "beneficiaryId", "fromAccountId", "reason"]);
  assert.match(validateTransfer({ ...valid, amount: "5000" }, accounts, beneficiaries).amount, /Saldo insufficiente/);
  assert.ok(validateTransfer({ ...valid, amount: "0.001" }, accounts, beneficiaries).amount);
  assert.ok(validateTransfer({ ...valid, amount: "Infinity" }, accounts, beneficiaries).amount);
});
