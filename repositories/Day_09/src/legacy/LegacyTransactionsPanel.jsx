import { Component } from "react";
import { getTransactions } from "../services/transactionService.js";
import TransactionList from "../components/TransactionList.jsx";
import { sortByDate } from "../utils/format.js";

export default class LegacyTransactionsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { transactions: [], loading: true, error: "" };
    this.controller = null;
    this.reload = this.reload.bind(this);
  }

  componentDidMount() {
    this.previousTitle = document.title;
    document.title = "LipariBank - Movimenti (legacy)";
    this.reload();
  }

  componentDidUpdate(previousProps) {
    if (previousProps.accountId !== this.props.accountId) this.reload();
  }

  componentWillUnmount() {
    document.title = this.previousTitle;
    if (this.controller) this.controller.abort();
  }

  reload() {
    if (this.controller) this.controller.abort();
    this.controller = new AbortController();
    const { signal } = this.controller;
    this.setState({ loading: true, error: "" });
    getTransactions(signal).then((transactions) => {
      if (!signal.aborted) this.setState({ transactions, loading: false });
    }).catch((error) => {
      if (!signal.aborted) this.setState({ error: error.message, loading: false });
    });
  }

  render() {
    const items = sortByDate(this.state.transactions.filter((item) => item.accountId === this.props.accountId));
    return <section><h2>Movimenti (class component)</h2><button type="button" onClick={this.reload}>Ricarica</button>
      {this.state.loading ? <p>Caricamento in corso...</p> : this.state.error ? <p role="alert">{this.state.error}</p> : <TransactionList transactions={items} />}
    </section>;
  }
}
