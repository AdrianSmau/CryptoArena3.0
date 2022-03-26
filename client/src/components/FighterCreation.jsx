import React, { useContext, useState } from "react";
import Select from "react-select";

import { BlockchainContext } from "../context/Context";
import { Loader } from "./";

const classOptions = [
  { value: 0, label: "Warrior" },
  { value: 1, label: "Samurai" },
  { value: 2, label: "Druid" },
];

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
  const [selectedClass, setSelectedClass] = useState(classOptions[0]);

  const {
    currentAccount,
    formDataFighter,
    createAndGetFighters,
    handleChangeFighter,
    isLoading
  } = useContext(BlockchainContext);

  const handleSubmit = (e) => {
    const fighterName = formDataFighter;
    const fighterClass = selectedClass.value;
    e.preventDefault();
    if (
      !fighterName ||
      (fighterClass != 0 && fighterClass != 1 && fighterClass != 2)
    ) {
      return;
    }
    createAndGetFighters(fighterClass);
  };

  return (
    <div className="flex w-full justify-center items-center font-medieval">
      <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center red-glassmorphism">
        <Input
          placeholder="FighterName"
          name="fighterName"
          type="text"
          handleChange={handleChangeFighter}
        />
        <Select
          defaultValue={selectedClass}
          onChange={setSelectedClass}
          options={classOptions}
        />
        <div className="h-[1px] w-full bg-gray-400 my-2" />
        {isLoading ? (
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
