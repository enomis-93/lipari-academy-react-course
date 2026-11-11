import { useRef, useState } from "react";
import { validateTransfer } from "../utils/validators.js";

const emptyValues = { fromAccountId: "", beneficiaryId: "", amount: "", reason: "" };

export default function TransferForm({ accounts, beneficiaries, onTransfer }) {
  const amountRef = useRef(null);
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const change = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
    setSuccess(false);
  };
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateTransfer(values, accounts, beneficiaries);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onTransfer(values);
    setValues(emptyValues);
    setSuccess(true);
  };
  return <form onSubmit={submit} noValidate>
    <label htmlFor="fromAccountId">Conto di addebito</label>
    <select id="fromAccountId" name="fromAccountId" value={values.fromAccountId} onChange={change}><option value="">Seleziona</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</select>
    {errors.fromAccountId && <p className="expense">{errors.fromAccountId}</p>}
    <label htmlFor="beneficiaryId">Beneficiario</label>
    <select id="beneficiaryId" name="beneficiaryId" value={values.beneficiaryId} onChange={change}><option value="">Seleziona</option>{beneficiaries.map((beneficiary) => <option key={beneficiary.id} value={beneficiary.id}>{beneficiary.name}</option>)}</select>
    {errors.beneficiaryId && <p className="expense">{errors.beneficiaryId}</p>}
    <label htmlFor="amount">Importo in euro</label>
    <button type="button" onClick={() => amountRef.current?.focus()}>Vai al campo importo</button>
    <input ref={amountRef} id="amount" name="amount" type="number" step="0.01" value={values.amount} onChange={change} />
    {errors.amount && <p className="expense">{errors.amount}</p>}
    <label htmlFor="reason">Causale</label>
    <input id="reason" name="reason" value={values.reason} onChange={change} />
    {errors.reason && <p className="expense">{errors.reason}</p>}
    <button type="submit">Invia bonifico simulato</button>
    <p role="status" aria-live="polite">{success && "Bonifico simulato registrato."}</p>
  </form>;
}
