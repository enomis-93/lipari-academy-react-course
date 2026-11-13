import { useNavigate } from "react-router";
import { beneficiaries } from "../data/mockData.js";
import TransferForm from "../components/TransferForm.jsx";

export default function TransferPage({ accounts, onAddTransfer }) {
  const navigate = useNavigate();

  function handleAddTransfer(transfer) {
    onAddTransfer(transfer);
    navigate("/transactions", { state: { transferCompleted: true } });
  }

  return (
    <section>
      <h1>Nuovo bonifico</h1>
      <p>Operazione simulata: nessun denaro viene trasferito.</p>
      <TransferForm
        accounts={accounts}
        beneficiaries={beneficiaries}
        onAddTransfer={handleAddTransfer}
      />
    </section>
  );
}
