function EmptyState({ message = "Nessun dato disponibile.", hint }) {
  return (
    <div className="empty-state">
      <p className="empty-state__message">{message}</p>
      {hint && <p className="empty-state__hint">{hint}</p>}
    </div>
  );
}

export default EmptyState;
