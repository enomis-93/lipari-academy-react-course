import Header from "./components/Header.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { customer } from "./data/mockData.js";

function App() {
  return (
    <div className="app">
      <Header customer={customer} />
      <Dashboard />
    </div>
  );
}

export default App;
