import React, { useContext, useState } from "react";
import Select from "react-select";

import { BlockchainContext } from "../../context/Context";
import CreatingFighterModal from "./CreatingFighterModal";

const classOptions = [
  { value: 0, label: "Warrior" },
  { value: 1, label: "Samurai" },
  { value: 2, label: "Druid" },
];

const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "#d3d3d3",
    borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
    width: 125,
    boxShadow: state.isFocused ? null : null,
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 0,
    marginTop: 0,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
};

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
    formDataFighter,
    createNewFighter,
    handleChangeFighter,
    isLoading,
    isMinting,
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
    createNewFighter(fighterClass);
  };

  return (
    <>
      <div className="flex w-full justify-center items-center font-medieval">
        <div className="flex flex-col justify-center items-center md:p-4 py-2 px-2">
          <h2 className="text-center text-3xl sm:text-4xl text-white text-gradient py-2 mb-8 md:mb-12">
            So you are new here! <br /> Go ahead and create your first fighter!
          </h2>
          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center red-glassmorphism">
            <Input
              placeholder="Insert the fighter's name here!"
              name="fighterName"
              type="text"
              handleChange={handleChangeFighter}
            />
            <Select
              defaultValue={selectedClass}
              onChange={setSelectedClass}
              options={classOptions}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  text: "black",
                  primary25: "#8b0000",
                  primary: "black",
                },
              })}
              styles={customStyles}
            />
            <div className="h-[1px] w-full bg-gray-400 my-2" />
            <button
              type="button"
              onClick={handleSubmit}
              className="text-white w-full mt-2 border-[1px] p-2 border-[#fff] rounded-full cursor-pointer"
            >
              Create new fighter!
            </button>
          </div>
        </div>
      </div>
      {isLoading && <CreatingFighterModal />}
    </>
  );
};

export default FighterCreation;
