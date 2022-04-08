import React, { useContext } from "react";
import Navbar from "../common/Navbar";
import ArenaContent from "./ArenaContent";
import Footer from "../common/Footer";
import Loader from "../common/Loader";

import Modal from "./AttackModal";
import AttackModal from "./AttackLogModal";
import ErrorModal from "./ErrorModal";

import colosseum from "../../../images/colosseum.png";

import { BlockchainContext } from "../../context/Context";

const Arena = () => {
  const {
    currentAccount,
    myFighters,
    isContextLoading,
    isLoading,
    displayAttackLogs,
    displayError,
  } = useContext(BlockchainContext);
  return (
    <div className="min-h-screen gradient-bg-welcome font-medieval">
      <Navbar />
      {isContextLoading ? (
        <Loader />
      ) : currentAccount ? (
        myFighters.length ? (
          <ArenaContent />
        ) : (
          <div className="flex w-full justify-center items-center md:p-8 py-12 px-2 2xl:px-14">
            <div className="flex flex-col justify-between items-center">
              <h2 className="text-white text-3xl text-center my-2 text-gradient">
                You do not have any fighters! Head on to the Barracks to create
                your first fighter!
              </h2>
              <img
                src={colosseum}
                alt="colosseum"
                className="object-scale-down w-80 md:mt-10 mt-5 text-center white-glassmorphism"
              />
            </div>
          </div>
        )
      ) : (
        <div className="flex w-full justify-center items-center md:p-8 py-12 px-2 2xl:px-14">
          <div className="flex flex-col justify-between items-center">
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
      {isLoading && <Modal />}
      {displayAttackLogs && <AttackModal />}
      {displayError && <ErrorModal />}
    </div>
  );
};

export default Arena;
