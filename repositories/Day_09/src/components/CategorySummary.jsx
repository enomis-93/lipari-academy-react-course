import { memo } from "react";
import { useSelector } from "react-redux";
import { selectExpenseTotalsByCategory } from "../store/transactionsSlice.js";
import { formatCurrency } from "../utils/formatters.js";

function CategorySummary({ selectedCategory, onSelectCategory }) {
  const totals = useSelector(selectExpenseTotalsByCategory);

  if (totals.length === 0) {
    return <p>Nessuna uscita da riepilogare.</p>;
  }

  return (
    <section className="category-summary">
      <h2>Uscite per categoria</h2>
      <ul>
        {totals.map(({ category, total }) => (
          <li key={category}>
            <button
              type="button"
              aria-pressed={selectedCategory === category}
              onClick={() => onSelectCategory(category)}
            >
              {category}: {formatCurrency(total)}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default memo(CategorySummary);
