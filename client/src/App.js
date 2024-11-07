import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import EmailVerification from "./components/emailVerification";
import TemplatePage from "./components/TemplatePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmailVerification />} />
        <Route path="/template" element={<TemplatePage />} />
      </Routes>
    </Router>
  );
}

export default App;
