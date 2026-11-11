export default function Header({ customer }) {
  return <header className="header"><h1>LipariBank</h1><p>Benvenuto, {customer.firstName} {customer.lastName}</p></header>;
}
