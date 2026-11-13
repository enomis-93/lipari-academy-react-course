import { ApiError } from "../services/apiClient.js";

export function getErrorMessage(error) {
  if (error instanceof ApiError) {
    if (error.status === 404) return "I dati richiesti non sono stati trovati.";
    if (error.status !== null && error.status >= 500) {
      return "Il servizio non è al momento disponibile. Riprova tra qualche minuto.";
    }
    return error.message;
  }
  return "Si è verificato un errore imprevisto. Riprova più tardi.";
}
