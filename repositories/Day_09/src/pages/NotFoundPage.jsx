import { Link } from "react-router";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

export default function NotFoundPage() {
  useDocumentTitle("Pagina non trovata");

  return (
    <section>
      <h1>Pagina non trovata</h1>
      <p>L'indirizzo richiesto non esiste in LipariBank.</p>
      <Link to="/">Torna alla dashboard</Link>
    </section>
  );
}
