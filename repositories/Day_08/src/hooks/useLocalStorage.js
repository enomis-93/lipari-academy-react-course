import { useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored === null ? initialValue : JSON.parse(stored);
    } catch (error) {
      console.error("Impossibile leggere le preferenze:", error);
      return initialValue;
    }
  });
  function update(next) {
    setValue((previous) => {
      const value = typeof next === "function" ? next(previous) : next;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error("Impossibile salvare le preferenze:", error);
      }
      return value;
    });
  }
  return [value, update];
}
