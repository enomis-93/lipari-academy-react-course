const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiError extends Error {
  constructor(message, { status = null, cause } = {}) {
    super(message, { cause });
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiGet(path, { signal } = {}) {
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      signal,
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError("Impossibile contattare il servizio.", { cause: error });
  }

  if (!response.ok) {
    throw new ApiError(`Richiesta non riuscita (${response.status}).`, { status: response.status });
  }

  try {
    return await response.json();
  } catch (error) {
    throw new ApiError("Risposta del servizio non valida.", { status: response.status, cause: error });
  }
}
