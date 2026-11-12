export default function LoadingMessage({ message = "Caricamento in corso..." }) {
  return (
    <div className="loading-message" role="status">
      <span className="loading-spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
