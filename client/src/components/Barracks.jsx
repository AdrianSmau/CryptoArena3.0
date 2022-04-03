import React, { useContext } from "react";
import Navbar from "./Navbar";
import Loader from "./Loader";
import MyFightersPage from "./MyFightersPage";
import FighterCreation from "./FighterCreation";
import Footer from "./Footer";

import colosseum from "../../images/colosseum.png";

import { BlockchainContext } from "../context/Context";

const Barracks = () => {
  const { currentAccount, myFighters, isContextLoading } =
    useContext(BlockchainContext);
  return (
    <div className="min-h-screen gradient-bg-welcome">
      <Navbar />
      {isContextLoading ? (
        <Loader />
      ) : currentAccount ? (
        myFighters.length ? (
          <MyFightersPage />
        ) : (
          <FighterCreation />
        )
      ) : (
        <div className="flex w-full justify-center items-center md:p-8 py-12 px-2 2xl:px-14 font-medieval">
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-white text-3xl text-center my-2 text-gradient">
              Connect your account to see this Fighter!
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

export default Barracks;
