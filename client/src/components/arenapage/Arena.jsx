import React, { useContext } from "react";
import Navbar from "../common/Navbar";
import ArenaContent from "./ArenaContent";
import FighterCreation from "../barrackspage/FighterCreation";
import Footer from "../common/Footer";
import Loader from "../common/Loader";

import colosseum from "../../../images/colosseum.png";

import { BlockchainContext } from "../../context/Context";

const Arena = () => {
  const { currentAccount, myFighters, isContextLoading } =
    useContext(BlockchainContext);
  return (
    <div className="min-h-screen gradient-bg-welcome font-medieval">
      <Navbar />
      {isContextLoading ? (
        <Loader />
      ) : currentAccount ? (
        myFighters.length ? (
          <ArenaContent />
        ) : (
          <FighterCreation />
        )
      ) : (
        <div className="flex w-full justify-center items-center md:p-8 py-12 px-2 2xl:px-14">
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-white text-3xl text-center my-2 text-gradient">
              Connect your account to participate in battles!
            </h2>
            <img
              src={colosseum}
              alt="colosseum"
              className="object-scale-down w-80 md:mt-10 mt-5 text-center white-glassmorphism"
            />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Arena;