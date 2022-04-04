import React, { useContext, useEffect, useLayoutEffect, useState } from "react";

import Loader from "../common/Loader";

import colosseum from "../../../images/colosseum.png";
import none from "../../../images/none.png";

import warrior from "../../../images/warrior256.png";
import samurai from "../../../images/samurai256.png";
import druid from "../../../images/druid256.png";

import { BlockchainContext } from "../../context/Context";

const MyFightersCard = ({
  changeFunction,
  currentChoice,
  id,
  name,
  level,
  fighterClass,
}) => {
  return (
    <div className="relative">
      {currentChoice == id && (
        <div className="absolute -inset-0.5 bg-[#940000] rounded-md blur-md"></div>
      )}
      <div
        onClick={() => changeFunction(id)}
        className="relative bg-[#181918] flex flex-1 2xl:min-w-[215px] 2xl:max-w-[305px] sm:min-w-[175px] sm:max-w-[200px] flex-col rounded-md hover:shadow-2xl"
      >
        <div className="flex flex-col justify-center items-center w-full mt-2 w-full mb-2">
          <p className="text-white text-base sm:text-sm text-xs">
            {name} the{" "}
            {fighterClass == 0
              ? "Warrior"
              : fighterClass == 1
              ? "Samurai"
              : "Druid"}{" "}
            - ID #{id}
          </p>
          <p className="text-white text-base text-center sm:text-sm text-xs">
            Fighter's level: {level}
          </p>
          <img
            src={
              fighterClass == 0 ? warrior : fighterClass == 1 ? samurai : druid
            }
            alt="classImage"
            className="object-scale-down w-24"
          />
        </div>
      </div>
    </div>
  );
};

const MyWeaponCard = ({ changeFunction, currentChoice, id }) => {
  return (
    <div className="relative">
      {currentChoice == id && (
        <div className="absolute -inset-0.5 bg-[#940000] rounded-md blur-md"></div>
      )}
      <div
        onClick={() => changeFunction(id)}
        className="relative bg-[#181918] flex flex-1 2xl:min-w-[215px] 2xl:max-w-[305px] sm:min-w-[175px] sm:max-w-[200px] flex-col rounded-md hover:shadow-2xl"
      >
        <div className="flex flex-col justify-center items-center w-full mt-2 w-full mb-2">
          <p className="text-white text-base sm:text-sm text-xs">None</p>
          <img src={none} alt="none" className="object-scale-down w-24" />
        </div>
      </div>
    </div>
  );
};

const ArenaContent = () => {
  const { currentAccount, myFighters, isContextLoading } =
    useContext(BlockchainContext);

  const [myFighterSelected, setMyFighterSelected] = useState(-1);
  const [isMyFighterSelected, setIsMyFighterSelected] = useState(false);
  const [myWeaponSelected, setMyWeaponSelected] = useState(-2);

  useEffect(() => {
    console.log("My selected fighter is: " + myFighterSelected);
    if (myFighterSelected >= 0) {
      setIsMyFighterSelected(true);
    }
  }, [myFighterSelected]);

  useEffect(() => {
    console.log("My selected weapon is: " + myWeaponSelected);
  }, [myWeaponSelected]);

  return (
    <div className="flex flex-col md:p-4 px-2">
      {isContextLoading ? (
        <Loader />
      ) : currentAccount ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-white text-3xl text-center my-2 py-2 text-gradient">
            Welcome to the Arena! Select the Fighter you want to attack with,
            your weapon and the fighter you want to attack!
          </h1>
          <h2 className="text-white text-xl text-center my-2 py-2 text-gradient">
            Choose your desired attacker from below!
          </h2>
          <div className="flex flex-wrap justify-center items-center md:my-5 my-3">
            {myFighters
              .reverse()
              .filter(
                (fighter) => fighter.timestamp.getTime() < new Date().getTime()
              )
              .map((fighter, i) => (
                <MyFightersCard
                  key={i}
                  changeFunction={setMyFighterSelected}
                  currentChoice={myFighterSelected}
                  {...fighter}
                />
              ))}
          </div>
          {isMyFighterSelected && (
            <>
              <h2 className="text-white text-xl text-center my-2 py-2 text-gradient">
                Next up, select your weapon!
              </h2>
              <div className="flex flex-wrap justify-center items-center md:my-5 my-3">
                {
                  <MyWeaponCard
                    changeFunction={setMyWeaponSelected}
                    currentChoice={myWeaponSelected}
                    {...-1}
                  />
                }
              </div>
              <h2 className="text-white text-xl text-center my-2 py-2 text-gradient">
                Finally, we listed below some fighters ---- ...
              </h2>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-between items-center">
          <h2 className="text-white text-3xl text-center my-2 text-gradient">
            Connect your account to see this Fighter!
          </h2>
          <img
            src={colosseum}
            alt="colosseum"
            className="object-scale-down w-80 md:mt-10 mt-5 text-center white-glassmorphism"
          />
        </div>
      )}
    </div>
  );
};

export default ArenaContent;
