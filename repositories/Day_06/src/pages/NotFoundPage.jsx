import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <section>
      <h1>Pagina non trovata</h1>
      <p>L'indirizzo richiesto non esiste in LipariBank.</p>
      <Link to="/">Torna alla dashboard</Link>
    </section>
  );
}
