const FILTER_OPTIONS = [
  { value: "all", label: "Tutti" },
  { value: "income", label: "Entrate" },
  { value: "expense", label: "Uscite" },
];

function TransactionFilters({ filter, searchText, onFilterChange, onSearchChange }) {
  return (
    <div className="transaction-filters">
      <div role="group" aria-label="Filtra per tipo di movimento">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={filter === option.value}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <label htmlFor="transaction-search">Cerca nei movimenti</label>
      <input
        id="transaction-search"
        type="search"
        value={searchText}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="es. stipendio"
      />
    </div>
  );
}

export default TransactionFilters;
