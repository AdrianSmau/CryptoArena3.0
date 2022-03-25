import React, { useContext } from "react";

import { BlockchainContext } from "../context/Context";
import { Loader } from "./";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const FighterCreation = () => {
  const { currentAccount, formData, createFighter, handleChange } =
    useContext(BlockchainContext);

  const handleSubmit = (e) => {
    const { fighterName } = formData;
    e.preventDefault();
    if (!fighterName) {
      return;
    }
    createFighter();
  };

  return (
    <div className="flex w-full justify-center items-center font-medieval">
      <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center red-glassmorphism">
        <Input
          placeholder="FighterName"
          name="fighterName"
          type="text"
          handleChange={handleChange}
        />
        <div className="h-[1px] w-full bg-gray-400 my-2" />
        {false ? (
          <Loader />
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="text-white w-full mt-2 border-[1px] p-2 border-[#fff] rounded-full cursor-pointer"
          >
            Create new fighter!
          </button>
        )}
      </div>
    </div>
  );
};

export default FighterCreation;