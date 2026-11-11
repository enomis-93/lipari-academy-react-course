import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error, info) { console.error("Errore di rendering:", error, info); }
  render() {
    return this.state.failed ? <main><h1>Si è verificato un errore</h1><p>Ricarica la pagina per riprovare.</p><button type="button" onClick={() => window.location.reload()}>Ricarica</button></main> : this.props.children;
  }
}
