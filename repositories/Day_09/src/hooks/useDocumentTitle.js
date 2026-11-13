import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = `${title} · LipariBank`;

    return () => {
      document.title = "LipariBank";
    };
  }, [title]);
}
