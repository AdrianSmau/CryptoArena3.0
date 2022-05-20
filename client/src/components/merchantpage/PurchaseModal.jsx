import React, { useContext } from "react";

import { BlockchainContext } from "../../context/Context";

const PurchaseModal = () => {
  const { formDataPurchase, purchaseWeapon, setDisplayConfirmationModal } =
    useContext(BlockchainContext);

  const { level, tier, type, value } = formDataPurchase;

  const handleProceedButton = (e) => {
    e.preventDefault();
    setDisplayConfirmationModal(false);
    purchaseWeapon(level, tier, type, value);
  };

  const handleCancelButton = (e) => {
    e.preventDefault();
    setDisplayConfirmationModal(false);
  };

  return (
    <div className="bg-neutral-800 bg-opacity-80 fixed inset-0 z-50">
      <div className="flex h-screen justify-center items-center">
        <div className="flex flex-col justify-center items-center bg-black p-2 md:p-4 border-4 border-red-900 rounded-xl">
          <p className="text-white md:text-xl text-2xl pb-2 md:pb-4 text-center text-gradient">
            {type == 0
              ? tier == 0
                ? `Are you sure you want to buy the level ${level} S-tier Slash weapon for ${value} ETH? `
                : tier == 1
                ? `Are you sure you want to buy the level ${level} A-tier Slash weapon for ${value} ETH? `
                : `Are you sure you want to buy the level ${level} B-tier Slash weapon for ${value} ETH? `
              : tier == 0
              ? `Are you sure you want to buy the level ${level} S-tier Blunt weapon for ${value} ETH? `
              : tier == 1
              ? `Are you sure you want to buy the level ${level} A-tier Blunt weapon for ${value} ETH? `
              : `Are you sure you want to buy the level ${level} B-tier Blunt weapon for ${value} ETH? `}
          </p>
          <div className="flex flex-row">
            <button
              type="button"
              onClick={handleProceedButton}
              className="bg-[#8e0005] py-2 px-5 mf:px-7 mx-2 mt-3 mf:mx-4 mf:mt-6 rounded-full cursor-pointer hover:bg-[#b20006]"
            >
              <p className="text-white text-base font-semibold">Yes</p>
            </button>
            <button
              type="button"
              onClick={handleCancelButton}
              className="bg-[#8e0005] py-2 px-5 mf:px-7 mx-2 mt-3 mf:mx-4 mf:mt-6 rounded-full cursor-pointer hover:bg-[#b20006]"
            >
              <p className="text-white text-base font-semibold">No</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
