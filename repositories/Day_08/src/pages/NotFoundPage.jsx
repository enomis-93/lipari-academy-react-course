import { Link } from "react-router";
import Card from "../components/Card.jsx";

export default function NotFoundPage() {
  return <Card title="404"><p>Pagina non trovata.</p><Link to="/">Torna alla dashboard</Link></Card>;
}
