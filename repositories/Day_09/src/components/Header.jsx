const appName = import.meta.env.VITE_APP_NAME || "LipariBank";

function Header({ customer }) {
  return (
    <header className="header">
      <h1 className="header__brand">{appName}</h1>
      <p className="header__name">
        Cliente: {customer.firstName} {customer.lastName}
      </p>
    </header>
  );
}

export default Header;
