import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./components/homepage/Home";
import Barracks from "./components/barrackspage/Barracks";
import FighterPage from "./components/fighterpage/FighterPage";
import AllFightersPage from "./components/fighterpage/AllFightersPage";
import Arena from "./components/arenapage/Arena";
import Merchant from "./components/merchantpage/Merchant";
import NotFoundPage from "./components/notfoundpage/NotFoundPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/barracks" element={<Barracks />} />
        <Route exact path="/archive" element={<AllFightersPage />} />
        <Route exact path="/fighters/:id" element={<FighterPage />} />
        <Route exact path="/arena" element={<Arena />} />
        <Route exact path="/merchant" element={<Merchant />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
