import { Component } from "react";
import { getTransactions } from "../services/transactionService.js";
import { formatCurrency, formatDate } from "../utils/formatters.js";

const FILTERS = [
  { value: "all", label: "Tutti" },
  { value: "income", label: "Entrate" },
  { value: "expense", label: "Uscite" },
];

class LegacyTransactionsPanel extends Component {
  static defaultProps = {
    accountId: "acc-001",
    title: "Movimenti (legacy)",
  };

  constructor(props) {
    super(props);
    this.state = { transactions: [], isLoading: true, error: null, filter: "all" };
    this.controller = null;
    this.previousTitle = "";
    this.handleReload = this.handleReload.bind(this);
  }

  componentDidMount() {
    this.previousTitle = document.title;
    document.title = "LipariBank - Movimenti (legacy)";
    this.loadTransactions();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.accountId !== this.props.accountId) {
      this.loadTransactions();
    }
  }

  componentWillUnmount() {
    document.title = this.previousTitle;
    if (this.controller) {
      this.controller.abort();
    }
  }

  loadTransactions() {
    if (this.controller) {
      this.controller.abort();
    }
    this.controller = new AbortController();
    const { signal } = this.controller;

    this.setState({ isLoading: true, error: null });

    getTransactions({ signal })
      .then((transactions) => {
        if (signal.aborted) {
          return;
        }
        this.setState({ transactions, isLoading: false });
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }
        this.setState({ error: error.message, isLoading: false });
      });
  }

  handleReload() {
    this.loadTransactions();
  }

  handleFilterChange = (filter) => {
    this.setState({ filter });
  };

  render() {
    const { accountId, title } = this.props;
    const { transactions, isLoading, error, filter } = this.state;

    const visible = transactions
      .filter((transaction) => transaction.accountId === accountId)
      .filter((transaction) => {
        if (filter === "income") return transaction.amount > 0;
        if (filter === "expense") return transaction.amount < 0;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));

    return (
      <section>
        <h2>{title}</h2>
        <p>Conto: {accountId}</p>
        <button type="button" onClick={this.handleReload}>
          Ricarica
        </button>
        <div>
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={filter === item.value}
              onClick={() => this.handleFilterChange(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {isLoading && <p>Caricamento in corso...</p>}
        {error && <p role="alert">Errore: {error}</p>}
        {!isLoading && !error && visible.length === 0 && <p>Nessun movimento.</p>}
        <ul>
          {visible.map((transaction) => (
            <li key={transaction.id}>
              {formatDate(transaction.date)} — {transaction.description}:{" "}
              {formatCurrency(transaction.amount)}
            </li>
          ))}
        </ul>
      </section>
    );
  }
}

export default LegacyTransactionsPanel;
