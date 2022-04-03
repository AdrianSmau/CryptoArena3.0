import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import Barracks from "./components/Barracks";
import FighterPage from "./components/FighterPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/barracks" element={<Barracks />} />
        <Route exact path="/fighters/:id" element={<FighterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
