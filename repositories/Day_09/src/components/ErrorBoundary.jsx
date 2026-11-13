import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Errore intercettato dall'ErrorBoundary:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="error-boundary">
          <h2>Qualcosa è andato storto</h2>
          <p>Si è verificato un problema nella visualizzazione di questa pagina.</p>
          <button type="button" onClick={this.handleReset}>
            Riprova
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
