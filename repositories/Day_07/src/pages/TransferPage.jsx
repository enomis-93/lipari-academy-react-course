import { useNavigate } from "react-router";
import Card from "../components/Card.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransferForm from "../components/TransferForm.jsx";
import { beneficiaries } from "../data/mockData.js";
import { useBank } from "../context/BankContext.jsx";

export default function TransferPage() {
  const bank = useBank();
  const navigate = useNavigate();
  if (bank.loading) return <LoadingMessage />;
  if (bank.error) return <ErrorMessage message={bank.error} onRetry={bank.retry} />;
  return <Card title="Bonifico"><TransferForm accounts={bank.accounts} beneficiaries={beneficiaries} onTransfer={(values) => { bank.transfer(values); navigate("/transactions", { state: { transferCompleted: true } }); }} /></Card>;
}
