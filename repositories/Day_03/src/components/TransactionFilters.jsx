export default function TransactionFilters({ filter, searchText, onFilterChange, onSearchChange }) {
  return <div className="filters">
    <label>Tipo <select value={filter} onChange={(event) => onFilterChange(event.target.value)}><option value="all">Tutti</option><option value="income">Entrate</option><option value="expense">Uscite</option></select></label>
    <label>Cerca <input value={searchText} onChange={(event) => onSearchChange(event.target.value)} /></label>
  </div>;
}
