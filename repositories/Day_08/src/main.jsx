import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { BankProvider } from "./context/BankContext.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode><Provider store={store}><ErrorBoundary><SettingsProvider><BankProvider><BrowserRouter><App /></BrowserRouter></BankProvider></SettingsProvider></ErrorBoundary></Provider></StrictMode>
);
