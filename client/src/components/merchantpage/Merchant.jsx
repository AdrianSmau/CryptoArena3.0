import React, { useContext } from "react";
import Navbar from "../common/Navbar";
import MerchantContent from "./MerchantContent";
import PurchaseModal from "./PurchaseModal";
import LoadingModal from "./LoadingModal";
import ReceiptModal from "./ReceiptModal";
import ErrorModal from "../arenapage/ErrorModal";
import Footer from "../common/Footer";
import Loader from "../common/Loader";

import colosseum from "../../../images/colosseum.png";

import { BlockchainContext } from "../../context/Context";

const Merchant = () => {
  const {
    currentAccount,
    isContextLoading,
    displayConfirmationModal,
    displayReceipt,
    isLoading,
    displayError,
  } = useContext(BlockchainContext);
  return (
    <div className="min-h-screen gradient-bg-welcome font-medieval">
      <Navbar />
      {isContextLoading ? (
        <Loader />
      ) : currentAccount ? (
        <MerchantContent />
      ) : (
        <div className="flex w-full justify-center items-center md:p-8 py-12 px-2 2xl:px-14">
          <div className="flex flex-col justify-between items-center">
            <h2 className="text-white text-3xl text-center my-2 text-gradient">
              Connect your account to purchase new Weapons!
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
      {displayConfirmationModal && <PurchaseModal />}
      {isLoading && <LoadingModal />}
      {displayReceipt && <ReceiptModal />}
      {displayError && <ErrorModal />}
    </div>
  );
};

export default Merchant;
