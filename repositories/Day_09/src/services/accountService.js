import { ApiError, apiGet } from "./apiClient.js";

export async function getAccounts({ signal } = {}) {
  const data = await apiGet("/data/accounts.json", { signal });
  if (!Array.isArray(data)) {
    throw new ApiError("Formato dei conti non valido.");
  }
  return data;
}
