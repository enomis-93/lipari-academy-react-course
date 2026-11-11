export default function ErrorMessage({ message, onRetry }) {
  return <div role="alert"><p>{message}</p><button type="button" onClick={onRetry}>Riprova</button></div>;
}
