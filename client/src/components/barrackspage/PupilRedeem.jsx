import React, { useContext, useState } from "react";
import Select from "react-select";

import { BlockchainContext } from "../../context/Context";
import { Loader } from "..";

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

const PupilRedeem = () => {
  const [selectedClass, setSelectedClass] = useState(classOptions[0]);

  const {
    formDataFighter,
    recruitPupil,
    handleChangeFighter,
    isLoading,
    setShowRecruitModal,
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
    recruitPupil(fighterClass);
  };
  return (
    <div className="bg-neutral-800 bg-opacity-80 fixed inset-0 z-50">
      <div className="flex h-screen justify-center items-center">
        <div className="flex flex-col justify-center items-center bg-black p-2 md:p-4 border-4 border-red-900 rounded-xl">
          <p className="text-white md:text-2xl text-3xl text-center text-gradient">
            You earned a new Fighter! Redeem it now!
          </p>
          <div className="p-5 md:my-8 my-12 sm:w-96 w-full flex flex-col justify-start items-center red-glassmorphism">
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
            {isLoading ? (
              <Loader />
            ) : (
              <div className="flex flex-row mt-2 justify-between align-center text-center w-full">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-white border-[0.5px] w-1/2 p-2 border-[#fff] rounded-full cursor-pointer"
                >
                  Recruit new pupil!
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRecruitModal(false);
                  }}
                  className="text-white border-[0.5px] w-1/2 p-2 border-[#fff] rounded-full cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PupilRedeem;
