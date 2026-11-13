import { Component } from "react";
import { formatCurrency } from "../utils/formatters.js";

class LegacyBalanceWidget extends Component {
  static defaultProps = {
    title: "Saldo (legacy)",
  };

  constructor(props) {
    super(props);
    this.state = { hidden: false, secondsSinceRefresh: 0 };
    this.timerId = null;
    this.toggleHidden = this.toggleHidden.bind(this);
  }

  componentDidMount() {
    console.log("[LegacyBalanceWidget] componentDidMount");
    this.timerId = setInterval(() => {
      this.setState((prevState) => ({
        secondsSinceRefresh: prevState.secondsSinceRefresh + 1,
      }));
    }, 1000);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.accountId !== this.props.accountId) {
      console.log("[LegacyBalanceWidget] accountId cambiato");
      this.setState({ secondsSinceRefresh: 0 });
    }
  }

  componentWillUnmount() {
    console.log("[LegacyBalanceWidget] componentWillUnmount");
    clearInterval(this.timerId);
  }

  toggleHidden() {
    this.setState((prevState) => ({ hidden: !prevState.hidden }));
  }

  handleRefresh = () => {
    this.setState({ secondsSinceRefresh: 0 });
  };

  render() {
    const { accounts, accountId, title } = this.props;
    const account = accounts.find((item) => item.id === accountId);

    if (!account) {
      return <p>Conto non trovato.</p>;
    }

    return (
      <section>
        <h2>{title}</h2>
        <p>{account.name}</p>
        <p>{this.state.hidden ? "••••••" : formatCurrency(account.balance)}</p>
        <p>Aggiornato {this.state.secondsSinceRefresh} secondi fa</p>
        <button type="button" onClick={this.toggleHidden}>
          {this.state.hidden ? "Mostra saldo" : "Nascondi saldo"}
        </button>
        <button type="button" onClick={this.handleRefresh}>
          Aggiorna
        </button>
      </section>
    );
  }
}

export default LegacyBalanceWidget;
