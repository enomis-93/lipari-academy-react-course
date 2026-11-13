import { createContext, useCallback, useContext, useMemo, useState } from "react";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [hideBalance, setHideBalance] = useState(false);

  const toggleHideBalance = useCallback(() => {
    setHideBalance((current) => !current);
  }, []);

  const value = useMemo(
    () => ({ hideBalance, toggleHideBalance }),
    [hideBalance, toggleHideBalance],
  );

  return <SettingsContext value={value}>{children}</SettingsContext>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === null) {
    throw new Error("useSettings deve essere usato dentro <SettingsProvider>.");
  }
  return context;
}
