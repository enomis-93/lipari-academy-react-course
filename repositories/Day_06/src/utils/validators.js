export function validateTransfer(values, accounts, beneficiaries) {
  const errors = {};
  const account = accounts.find((item) => item.id === values.fromAccountId);
  const beneficiary = beneficiaries.find((item) => item.id === values.beneficiaryId);
  const amount = Number(values.amount);
  if (!account) errors.fromAccountId = "Seleziona un conto valido.";
  if (!beneficiary) errors.beneficiaryId = "Seleziona un beneficiario valido.";
  if (!values.amount.trim() || !Number.isFinite(amount) || amount <= 0) errors.amount = "Inserisci un importo maggiore di zero.";
  else if (!/^\d+(?:\.\d{1,2})?$/.test(values.amount)) errors.amount = "Inserisci al massimo due cifre decimali.";
  else if (account && amount > account.balance) errors.amount = "Saldo insufficiente per questo bonifico.";
  if (!values.reason.trim()) errors.reason = "Inserisci una causale.";
  return errors;
}
