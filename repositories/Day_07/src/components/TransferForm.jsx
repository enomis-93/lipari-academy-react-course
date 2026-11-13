import { useRef, useState } from "react";
import { formatCurrency } from "../utils/formatters.js";
import { REASON_MAX_LENGTH, parseAmount, validateTransfer } from "../utils/validators.js";

const emptyValues = { accountId: "", beneficiaryId: "", amount: "", reason: "" };
const FIELD_ORDER = ["accountId", "beneficiaryId", "amount", "reason"];

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error" role="alert">
      {message}
    </p>
  );
}

function TransferForm({ accounts, beneficiaries, onAddTransfer }) {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState("");
  const formRef = useRef(null);

  const selectedAccount = accounts.find((account) => account.id === values.accountId);
  const selectedBeneficiary = beneficiaries.find(
    (beneficiary) => beneficiary.id === values.beneficiaryId,
  );

  function fieldA11y(name) {
    return {
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `${name}-error` : undefined,
    };
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      ...(name === "accountId" ? { amount: undefined } : {}),
    }));
    setConfirmation("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const availableBalance = selectedAccount ? selectedAccount.balance : 0;
    const validationErrors = validateTransfer(values, availableBalance);
    setErrors(validationErrors);

    const firstInvalidField = FIELD_ORDER.find((name) => validationErrors[name]);
    if (firstInvalidField) {
      setConfirmation("");
      formRef.current.elements[firstInvalidField].focus();
      return;
    }

    const amount = parseAmount(values.amount);
    onAddTransfer({
      accountId: values.accountId,
      beneficiaryId: values.beneficiaryId,
      amount,
      reason: values.reason.trim(),
    });

    setConfirmation(
      `Bonifico SIMULATO di ${formatCurrency(amount)} a ${selectedBeneficiary.name} registrato. Nessuna operazione bancaria reale è stata eseguita.`,
    );
    setValues(emptyValues);
    setErrors({});
    formRef.current.elements.accountId.focus();
  }

  return (
    <form ref={formRef} className="transfer-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="accountId">Conto di addebito</label>
        <select
          id="accountId"
          name="accountId"
          value={values.accountId}
          onChange={handleChange}
          {...fieldA11y("accountId")}
        >
          <option value="">Seleziona un conto</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
        {selectedAccount && <p>Saldo disponibile: {formatCurrency(selectedAccount.balance)}</p>}
        <FieldError id="accountId-error" message={errors.accountId} />
      </div>

      <div className="form-field">
        <label htmlFor="beneficiaryId">Beneficiario</label>
        <select
          id="beneficiaryId"
          name="beneficiaryId"
          value={values.beneficiaryId}
          onChange={handleChange}
          {...fieldA11y("beneficiaryId")}
        >
          <option value="">Seleziona un beneficiario</option>
          {beneficiaries.map((beneficiary) => (
            <option key={beneficiary.id} value={beneficiary.id}>
              {beneficiary.name}
            </option>
          ))}
        </select>
        {selectedBeneficiary && <p>IBAN: {selectedBeneficiary.iban}</p>}
        <FieldError id="beneficiaryId-error" message={errors.beneficiaryId} />
      </div>

      <div className="form-field">
        <label htmlFor="amount">Importo (EUR)</label>
        <input
          id="amount"
          name="amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={values.amount}
          onChange={handleChange}
          {...fieldA11y("amount")}
        />
        <FieldError id="amount-error" message={errors.amount} />
      </div>

      <div className="form-field">
        <label htmlFor="reason">Causale</label>
        <textarea
          id="reason"
          name="reason"
          rows={3}
          value={values.reason}
          onChange={handleChange}
          {...fieldA11y("reason")}
        />
        <p>
          {values.reason.length}/{REASON_MAX_LENGTH} caratteri
        </p>
        <FieldError id="reason-error" message={errors.reason} />
      </div>

      <button type="submit">Invia bonifico simulato</button>
      <p role="status" className="form-success">
        {confirmation}
      </p>
    </form>
  );
}

export default TransferForm;
