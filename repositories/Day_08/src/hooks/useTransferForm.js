import { useRef, useState } from "react";
import { formatCurrency } from "../utils/formatters.js";
import { parseAmount, validateTransfer } from "../utils/validators.js";

const EMPTY_VALUES = { accountId: "", beneficiaryId: "", amount: "", reason: "" };
const FIELD_ORDER = ["accountId", "beneficiaryId", "amount", "reason"];

export function useTransferForm({ beneficiaries, getAvailableBalance, onSubmit }) {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState("");
  const formRef = useRef(null);

  const selectedBeneficiary = beneficiaries.find((item) => item.id === values.beneficiaryId);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({
      ...current,
      [name]: undefined,
      ...(name === "accountId" ? { amount: undefined } : {}),
    }));
    setConfirmation("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateTransfer(values, getAvailableBalance(values.accountId));
    setErrors(validationErrors);

    const firstInvalidField = FIELD_ORDER.find((name) => validationErrors[name]);
    if (firstInvalidField) {
      setConfirmation("");
      formRef.current.elements[firstInvalidField].focus();
      return;
    }

    const amount = parseAmount(values.amount);
    onSubmit({
      accountId: values.accountId,
      beneficiaryId: values.beneficiaryId,
      amount,
      reason: values.reason.trim(),
    });

    setConfirmation(
      `Bonifico SIMULATO di ${formatCurrency(amount)} a ${selectedBeneficiary.name} registrato. Nessuna operazione bancaria reale è stata eseguita.`,
    );
    setValues(EMPTY_VALUES);
    setErrors({});
    formRef.current.elements.accountId.focus();
  }

  return {
    formRef,
    values,
    errors,
    confirmation,
    selectedBeneficiary,
    handleChange,
    handleSubmit,
  };
}
