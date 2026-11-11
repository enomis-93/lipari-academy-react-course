import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [hidden, setHidden] = useLocalStorage("liparibank.hidden", false);
  return <SettingsContext.Provider value={{ hidden, toggle: () => setHidden((value) => !value) }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings richiede SettingsProvider.");
  return context;
}
