import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import BoardPage from "./pages/BoardPage";
import ReportPage from "./pages/ReportPage";
import UrgentPage from "./pages/UrgentPage";
import PetsPage from "./pages/PetsPage";
import SpeciesPage from "./pages/SpeciesPage";
import "./styles/index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/urgent" element={<UrgentPage />} />
        <Route path="/pets" element={<PetsPage />} />
        <Route path="/species" element={<SpeciesPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;