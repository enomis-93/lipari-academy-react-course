function Header({ customer }) {
  return (
    <header className="header">
      <h1 className="header__brand">LipariBank</h1>
      <p className="header__name">
        Cliente: {customer.firstName} {customer.lastName}
      </p>
    </header>
  );
}

export default Header;
