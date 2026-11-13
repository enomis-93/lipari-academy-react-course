import { ApiError, apiGet } from "./apiClient.js";

export async function getTransactions({ signal } = {}) {
  const data = await apiGet("/data/transactions.json", { signal });
  if (!Array.isArray(data)) {
    throw new ApiError("Formato dei movimenti non valido.");
  }
  return data;
}
