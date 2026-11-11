export async function getTransactions(signal) {
  const response = await fetch(`${import.meta.env.BASE_URL}data/transactions.json`, { signal });
  if (!response.ok) throw new Error(`Caricamento dei movimenti non riuscito (HTTP ${response.status}).`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("Formato dei movimenti non valido.");
  return data;
}
