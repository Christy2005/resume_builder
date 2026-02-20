import { Routes, Route } from "react-router-dom";
import FormPage from "./FormPage";
import ResumePage from "./ResumePage";
import PortfolioPage from "./PortfolioPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<FormPage />} />
      <Route path="/resume" element={<ResumePage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
    </Routes>
  );
}

export default App;