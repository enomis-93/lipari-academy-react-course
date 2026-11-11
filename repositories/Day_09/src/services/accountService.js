export async function getAccounts(signal) {
  const response = await fetch(`${import.meta.env.BASE_URL}data/accounts.json`, { signal });
  if (!response.ok) throw new Error(`Caricamento dei conti non riuscito (HTTP ${response.status}).`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("Formato dei conti non valido.");
  return data;
}
