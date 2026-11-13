const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  useGrouping: "always",
});

export function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("it-IT");
}
