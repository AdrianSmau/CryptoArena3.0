import React, { useContext } from "react";
import { BlockchainContext } from "../../context/Context";

const GiftResult = () => {
  const { setDisplayGiftConfirmation } = useContext(BlockchainContext);

  const handleProceedButton = (e) => {
    e.preventDefault();
    setDisplayGiftConfirmation(false);
    window.location.reload();
  };

  return (
    <div className="bg-neutral-800 bg-opacity-80 fixed inset-0 z-50">
      <div className="flex h-screen justify-center items-center">
        <div className="flex flex-col justify-center items-center bg-black p-2 md:p-4 border-4 border-red-900 rounded-xl">
          <p className="text-white md:text-xl text-2xl pb-2 md:pb-4 text-center text-gradient">
            Fighter has been gifted to the given address! It will now appear in
            their Barracks!
          </p>
          <button
            type="button"
            onClick={handleProceedButton}
            className="bg-[#8e0005] py-2 px-5 mf:px-7 mx-2 mt-3 mf:mx-4 mf:mt-6 rounded-full cursor-pointer hover:bg-[#b20006]"
          >
            <p className="text-white text-base font-semibold">Proceed</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftResult;
