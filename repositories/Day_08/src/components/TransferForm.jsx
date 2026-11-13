import { useTransferForm } from "../hooks/useTransferForm.js";
import { formatCurrency } from "../utils/formatters.js";
import { REASON_MAX_LENGTH } from "../utils/validators.js";

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error" role="alert">
      {message}
    </p>
  );
}

function TransferForm({ accounts, beneficiaries, onAddTransfer }) {
  function getAvailableBalance(accountId) {
    return accounts.find((account) => account.id === accountId)?.balance ?? 0;
  }

  const { formRef, values, errors, confirmation, selectedBeneficiary, handleChange, handleSubmit } =
    useTransferForm({ beneficiaries, getAvailableBalance, onSubmit: onAddTransfer });

  const selectedAccount = accounts.find((account) => account.id === values.accountId);

  function fieldA11y(name) {
    return {
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `${name}-error` : undefined,
    };
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
