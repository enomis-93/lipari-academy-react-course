import { Component } from "react";

class SetStateLab extends Component {
  state = {
    objectCount: 0,
    functionalCount: 0,
    message: "nessuno",
    notes: [],
  };

  handleObjectForm = () => {
    this.setState({ objectCount: this.state.objectCount + 1 });
    this.setState({ objectCount: this.state.objectCount + 1 });
  };

  handleFunctionalForm = () => {
    this.setState((prevState) => ({ functionalCount: prevState.functionalCount + 1 }));
    this.setState((prevState) => ({ functionalCount: prevState.functionalCount + 1 }));
  };

  handleCallback = () => {
    this.setState({ message: "aggiornato" }, () => {
      console.log("Dentro la callback:", this.state.message);
    });
    console.log("Subito dopo setState:", this.state.message);
  };

  render() {
    const { objectCount, functionalCount, message, notes } = this.state;

    return (
      <section>
        <h2>SetState Lab</h2>
        <p>Forma oggetto (2 chiamate): {objectCount}</p>
        <button type="button" onClick={this.handleObjectForm}>
          +2 con forma oggetto
        </button>
        <p>Forma funzionale (2 chiamate): {functionalCount}</p>
        <button type="button" onClick={this.handleFunctionalForm}>
          +2 con forma funzionale
        </button>
        <p>Messaggio: {message}</p>
        <button type="button" onClick={this.handleCallback}>
          Prova callback
        </button>
        <p>Note: {notes.length}</p>
      </section>
    );
  }
}

export default SetStateLab;
