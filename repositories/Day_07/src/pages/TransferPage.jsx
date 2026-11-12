import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingMessage from "../components/LoadingMessage.jsx";
import TransferForm from "../components/TransferForm.jsx";
import { beneficiaries } from "../data/mockData.js";
import { selectAccounts } from "../store/accountsSlice.js";
import {
  fetchTransactions,
  selectTransactionsError,
  selectTransactionsStatus,
  transferAdded,
} from "../store/transactionsSlice.js";

export default function TransferPage() {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const status = useSelector(selectTransactionsStatus);
  const error = useSelector(selectTransactionsError);
  const navigate = useNavigate();

  if (status === "idle" || status === "loading") {
    return <LoadingMessage message="Caricamento dei conti..." />;
  }
  if (status === "failed") {
    return <ErrorMessage message={error} onRetry={() => dispatch(fetchTransactions())} />;
  }

  function handleAddTransfer(transfer) {
    const beneficiary = beneficiaries.find((item) => item.id === transfer.beneficiaryId);
    if (!beneficiary) return;

    dispatch(
      transferAdded({
        accountId: transfer.accountId,
        beneficiaryName: beneficiary.name,
        amount: transfer.amount,
      }),
    );
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
