import React, { useContext } from "react";
import { BlockchainContext } from "../../context/Context";

const ReceiptModal = () => {
  const { formDataPurchase, setFormDataPurchase, setDisplayReceipt } =
    useContext(BlockchainContext);

  const { level, tier, type } = formDataPurchase;

  const handleProceedButton = (e) => {
    e.preventDefault();

    setFormDataPurchase((prevState) => ({
      ...prevState,
      ["level"]: 0,
      ["tier"]: -1,
      ["type"]: -1,
      ["value"]: 0,
    }));

    setDisplayReceipt(false);
    window.location.replace("http://localhost:3000/barracks");
  };

  return (
    <div className="bg-neutral-800 bg-opacity-80 fixed inset-0 z-50">
      <div className="flex h-screen justify-center items-center">
        <div className="flex flex-col justify-center items-center bg-black p-2 md:p-4 border-4 border-red-900 rounded-xl">
          <p className="text-white md:text-xl text-2xl pb-2 md:pb-4 text-center text-gradient">
            {type == 0
              ? tier == 0
                ? `Your level ${level} S-tier Slash weapon has been successfully bought!`
                : tier == 1
                ? `Your level ${level} A-tier Slash weapon has been successfully bought!`
                : `Your level ${level} B-tier Slash weapon has been successfully bought!`
              : tier == 0
              ? `Your level ${level} S-tier Blunt weapon has been successfully bought!`
              : tier == 1
              ? `Your level ${level} A-tier Blunt weapon has been successfully bought!`
              : `Your level ${level} B-tier Blunt weapon has been successfully bought!`}
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

export default ReceiptModal;
