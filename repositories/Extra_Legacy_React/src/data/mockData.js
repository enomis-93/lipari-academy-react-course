export const customer = { id: "cust-001", firstName: "Mario", lastName: "Rossi" };

export const accounts = [
  { id: "acc-001", name: "Conto Corrente", iban: "IT00 0000 0000 0000 0000 0000 000", balance: 4250.75, currency: "EUR" },
  { id: "acc-002", name: "Conto Risparmio", iban: "IT00 0000 0000 0000 0000 0000 001", balance: 12800.0, currency: "EUR" },
];

// amount con segno: > 0 entrata, < 0 uscita
export const transactions = [
  { id: "trx-001", accountId: "acc-001", date: "2026-10-27", description: "Spesa supermercato", amount: -62.4, category: "Alimentari" },
  { id: "trx-002", accountId: "acc-001", date: "2026-10-25", description: "Pagamento utenza luce", amount: -88.9, category: "Utenze" },
  { id: "trx-003", accountId: "acc-001", date: "2026-10-23", description: "Stipendio", amount: 2100.0, category: "Stipendio" },
  { id: "trx-004", accountId: "acc-001", date: "2026-10-20", description: "Abbonamento palestra", amount: -39.9, category: "Svago" },
  { id: "trx-005", accountId: "acc-001", date: "2026-10-18", description: "Rimborso spese", amount: 45.0, category: "Rimborsi" },
  { id: "trx-006", accountId: "acc-001", date: "2026-10-15", description: "Pagamento utenza gas", amount: -54.2, category: "Utenze" },
  { id: "trx-007", accountId: "acc-002", date: "2026-10-10", description: "Accantonamento mensile", amount: 300.0, category: "Risparmio" },
  { id: "trx-008", accountId: "acc-002", date: "2026-10-01", description: "Interessi maturati", amount: 12.5, category: "Interessi" },
];

export const beneficiaries = [
  { id: "ben-001", name: "Giulia Bianchi", iban: "IT00 0000 0000 0000 0000 0000 111" },
  { id: "ben-002", name: "Luca Verdi", iban: "IT00 0000 0000 0000 0000 0000 222" },
  { id: "ben-003", name: "Condominio Lipari (fittizio)", iban: "IT00 0000 0000 0000 0000 0000 333" },
];
