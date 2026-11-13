function Card({ title, footer, children }) {
  return (
    <section className="card">
      {title && <h2 className="card__title">{title}</h2>}
      <div className="card__body">{children}</div>
      {footer && <p className="card__footer">{footer}</p>}
    </section>
  );
}

export default Card;
