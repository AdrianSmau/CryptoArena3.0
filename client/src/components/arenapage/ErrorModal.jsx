import React, { useContext } from "react";

import error from "../../../images/error.png";

import { BlockchainContext } from "../../context/Context";

const ErrorModal = () => {
  const { setDisplayError } = useContext(BlockchainContext);

  const handleProceedButton = (e) => {
    e.preventDefault();
    setDisplayError(false);
    window.location.replace("http://localhost:3000/barracks");
  };

  return (
    <div className="bg-neutral-800 bg-opacity-80 fixed inset-0 z-50">
      <div className="flex h-screen justify-center items-center">
        <div className="flex flex-col justify-center items-center bg-black p-2 md:p-4 border-4 border-red-900 rounded-xl">
          <p className="text-white md:text-xl text-2xl pb-2 md:pb-4 text-center text-gradient">
            Something went wrong with your attack!
          </p>
          <div className="flex flex-col pb-1 md:pb-2">
            <img
              src={error}
              alt="error"
              className="object-scale-down w-48 text-center white-glassmorphism"
            />
          </div>
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

export default ErrorModal;
