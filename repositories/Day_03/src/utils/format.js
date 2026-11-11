export const formatMoney = (value) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", useGrouping: "always" }).format(value);
export const formatDate = (date) => new Intl.DateTimeFormat("it-IT", { timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
export const sortByDate = (items) => [...items].sort((a, b) => b.date.localeCompare(a.date));
