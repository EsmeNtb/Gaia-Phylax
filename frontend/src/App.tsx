import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import MapPage from "./pages/MapPage";
import BoardPage from "./pages/BoardPage";
import UrgentPage from "./pages/UrgentPage";
import PetsPage from "./pages/PetsPage";
import SpeciesPage from "./pages/SpeciesPage";
import ReportPage from "./pages/ReportPage";
import ProfilePage from "./pages/ProfilePage";

import "./styles/index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/urgent" element={<UrgentPage />} />
        <Route path="/pets" element={<PetsPage />} />
        <Route path="/species" element={<SpeciesPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;