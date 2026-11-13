const TRANSACTIONS_URL = "/data/transactions.json";

export async function getTransactions({ signal } = {}) {
  const response = await fetch(TRANSACTIONS_URL, { signal });

  if (!response.ok) {
    throw new Error(
      `Impossibile caricare i movimenti (HTTP ${response.status})`
    );
  }

  return response.json();
}
