import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // Importe le vrai Dashboard
import Ventes from "./pages/Ventes"; // Importe la nouvelle page
import Caisse from "./pages/Caisse"; // Importe la nouvelle page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/ventes" element={<Ventes />} />
        <Route path="/caisse" element={<Caisse />} />
      </Routes>
    </Router>
  );
}

export default App;
