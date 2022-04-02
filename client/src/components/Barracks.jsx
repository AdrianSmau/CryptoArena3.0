import React, { useContext } from "react";
import Navbar from "./Navbar";
import LatestFighters from "./LatestFighters";
import FighterCreation from "./FighterCreation";
import Footer from "./Footer";

import { BlockchainContext } from "../context/Context";

const Barracks = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        {newFighterFunction()}
      </div>
      <Footer />
    </div>
  );
};

const newFighterFunction = () => {
  const { myFighters } = useContext(BlockchainContext);

  if (myFighters.length) {
    return <LatestFighters />;
  } else {
    return <FighterCreation />;
  }
};

export default Barracks;
