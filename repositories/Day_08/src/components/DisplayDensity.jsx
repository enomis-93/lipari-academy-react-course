import { useDispatch, useSelector } from "react-redux";
import { selectCompact, toggleCompact } from "../store/displaySlice.js";

export default function DisplayDensity() {
  const compact = useSelector(selectCompact);
  const dispatch = useDispatch();

  return (
    <button type="button" aria-pressed={compact} onClick={() => dispatch(toggleCompact())}>
      Modalità compatta
    </button>
  );
}
