export const REASON_MAX_LENGTH = 140;

const AMOUNT_PATTERN = /^-?\d+([.,]\d{1,2})?$/;

export function parseAmount(value) {
  return Number(String(value).trim().replace(",", "."));
}

export function validateTransfer(values, availableBalance) {
  const errors = {};

  if (!values.accountId) {
    errors.accountId = "Seleziona il conto di addebito.";
  }

  if (!values.beneficiaryId) {
    errors.beneficiaryId = "Seleziona un beneficiario.";
  }

  const rawAmount = String(values.amount).trim();
  if (rawAmount === "") {
    errors.amount = "Inserisci l'importo.";
  } else if (!AMOUNT_PATTERN.test(rawAmount)) {
    errors.amount = "Importo non valido: usa solo cifre e al massimo 2 decimali.";
  } else {
    const amount = parseAmount(rawAmount);
    if (amount <= 0) {
      errors.amount = "L'importo deve essere maggiore di zero.";
    } else if (values.accountId && amount > availableBalance) {
      errors.amount = "Saldo insufficiente sul conto selezionato.";
    }
  }

  const reason = values.reason.trim();
  if (reason === "") {
    errors.reason = "Inserisci la causale.";
  } else if (reason.length > REASON_MAX_LENGTH) {
    errors.reason = `La causale può contenere al massimo ${REASON_MAX_LENGTH} caratteri.`;
  }

  return errors;
}
