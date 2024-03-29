import React, { useContext, useEffect, useState } from "react";

import Loader from "../common/Loader";

import colosseum from "../../../images/colosseum.png";
import none from "../../../images/none.png";

import warrior from "../../../images/warrior256.png";
import samurai from "../../../images/samurai256.png";
import druid from "../../../images/druid256.png";

import ATierBlunt from "../../../images/ATierBlunt.png";
import ATierSlash from "../../../images/ATierSlash.png";
import BTierBlunt from "../../../images/BTierBlunt.png";
import BTierSlash from "../../../images/BTierSlash.png";
import STierBlunt from "../../../images/STierBlunt.png";
import STierSlash from "../../../images/STierSlash.png";

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
    <div className="relative p-2">
      {currentChoice == id && (
        <div className="absolute -inset-0.5 bg-[#940000] rounded-md blur-md"></div>
      )}
      <div
        onClick={() => changeFunction(id)}
        className="relative p-2 bg-[#181918] m-3 px-2 flex flex-1 2xl:min-w-[215px] 2xl:max-w-[305px] sm:min-w-[175px] sm:max-w-[200px] flex-col rounded-md hover:shadow-2xl"
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

const NoWeaponCard = ({ changeFunction, currentChoice, id }) => {
  return (
    <div className="relative p-2">
      {currentChoice == id && (
        <div className="absolute -inset-2.5 bg-[#940000] rounded-md blur-md"></div>
      )}
      <div
        onClick={() => changeFunction(id)}
        className="relative p-2 bg-[#181918] flex flex-1 2xl:min-w-[215px] 2xl:max-w-[305px] sm:min-w-[175px] sm:max-w-[200px] h-[200px] flex-col justify-center items-center rounded-md hover:shadow-2xl"
      >
        <div className="flex flex-col justify-center items-center w-full mt-2 w-full mb-2">
          <p className="text-white text-base sm:text-sm text-xs">None</p>
          <p className="text-white text-base sm:text-sm text-xs">
            Unarmed damage: 15
          </p>
          <img src={none} alt="none" className="object-scale-down w-24" />
        </div>
      </div>
    </div>
  );
};

const MyWeaponCard = ({
  changeFunction,
  currentChoice,
  id,
  damage,
  weapType,
  tier,
}) => {
  return (
    <div className="relative p-2">
      {currentChoice == id && (
        <div className="absolute -inset-2.5 bg-[#940000] rounded-md blur-md"></div>
      )}
      <div
        onClick={() => changeFunction(id)}
        className="relative p-2 bg-[#181918] flex flex-1 2xl:min-w-[215px] 2xl:max-w-[305px] sm:min-w-[175px] sm:max-w-[200px] h-[200px] flex-col justify-center items-center rounded-md hover:shadow-2xl"
      >
        <div className="flex flex-col justify-center items-center w-full mt-2 w-full mb-2">
          {weapType == 0 ? (
            tier == 0 ? (
              <>
                <p className="text-white text-base sm:text-sm text-xs">
                  S-Tier Slash Weapon - ID #{id}
                </p>
                <p className="text-white text-base sm:text-sm text-xs">
                  Base damage: {damage} (doubled for Samurai class)
                </p>
                <img
                  src={STierSlash}
                  alt="STierSlash"
                  className="object-scale-down w-24"
                />
              </>
            ) : tier == 1 ? (
              <>
                <p className="text-white text-base sm:text-sm text-xs">
                  A-Tier Slash Weapon - ID #{id}
                </p>
                <p className="text-white text-base sm:text-sm text-xs">
                  Base damage: {damage} (doubled for Samurai class)
                </p>
                <img
                  src={ATierSlash}
                  alt="ATierSlash"
                  className="object-scale-down w-24"
                />
              </>
            ) : (
              <>
                <p className="text-white text-base sm:text-sm text-xs">
                  B-Tier Slash Weapon - ID #{id}
                </p>
                <p className="text-white text-base sm:text-sm text-xs">
                  Base damage: {damage} (doubled for Samurai class)
                </p>
                <img
                  src={BTierSlash}
                  alt="BTierSlash"
                  className="object-scale-down w-24"
                />
              </>
            )
          ) : tier == 0 ? (
            <>
              <p className="text-white text-base sm:text-sm text-xs">
                S-Tier Blunt Weapon - ID #{id}
              </p>
              <p className="text-white text-base sm:text-sm text-xs">
                Base damage: {damage} (doubled for Warrior class)
              </p>
              <img
                src={STierBlunt}
                alt="STierBlunt"
                className="object-scale-down w-24"
              />
            </>
          ) : tier == 1 ? (
            <>
              <p className="text-white text-base sm:text-sm text-xs">
                A-Tier Blunt Weapon - ID #{id}
              </p>
              <p className="text-white text-base sm:text-sm text-xs">
                Base damage: {damage} (doubled for Warrior class)
              </p>
              <img
                src={ATierBlunt}
                alt="ATierBlunt"
                className="object-scale-down w-24"
              />
            </>
          ) : (
            <>
              <p className="text-white text-base sm:text-sm text-xs">
                B-Tier Blunt Weapon - ID #{id}
              </p>
              <p className="text-white text-base sm:text-sm text-xs">
                Base damage: {damage} (doubled for Warrior class)
              </p>
              <img
                src={BTierBlunt}
                alt="BTierBlunt"
                className="object-scale-down w-24"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ArenaContent = () => {
  const {
    currentAccount,
    myFighters,
    myWeapons,
    fighters,
    isContextLoading,
    attackFighter,
  } = useContext(BlockchainContext);

  const [myFighterSelected, setMyFighterSelected] = useState(-1);
  const [isMyFighterSelected, setIsMyFighterSelected] = useState(false);
  const [myWeaponSelected, setMyWeaponSelected] = useState(-2);
  const [isMyWeaponSelected, setIsMyWeaponSelected] = useState(false);
  const [targetFighterSelected, setTargetFighterSelected] = useState(-1);
  const [isTargetFighterSelected, setIsTargetFighterSelected] = useState(false);

  useEffect(() => {
    if (myFighterSelected >= 0) {
      setIsMyFighterSelected(true);
      setMyWeaponSelected(-2);
      setIsMyWeaponSelected(false);
      setTargetFighterSelected(-1);
      setIsTargetFighterSelected(false);
    }
    console.log("My selected fighter is: " + myFighterSelected);
  }, [myFighterSelected]);

  useEffect(() => {
    if (myWeaponSelected >= -1) {
      setIsMyWeaponSelected(true);
    }
    console.log("My selected weapon is: " + myWeaponSelected);
  }, [myWeaponSelected]);

  useEffect(() => {
    if (targetFighterSelected >= 0) {
      setIsTargetFighterSelected(true);
    }
    console.log("Target selected fighter is: " + targetFighterSelected);
  }, [targetFighterSelected]);

  const handleAttack = (e) => {
    const myFighterId = myFighterSelected;
    const myWeaponId = myWeaponSelected;
    const targetFighterId = targetFighterSelected;
    e.preventDefault();
    if (myFighterId < 0 || myWeaponId < -1 || targetFighterId < 0) {
      return;
    }
    attackFighter(myFighterId, myWeaponId, targetFighterId);
  };

  return (
    <div className="flex flex-col md:p-4 px-2">
      {isContextLoading ? (
        <Loader />
      ) : currentAccount ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-white text-3xl text-center my-2 text-gradient">
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
                <NoWeaponCard
                  changeFunction={setMyWeaponSelected}
                  currentChoice={myWeaponSelected}
                  id={-1}
                />
                {myWeapons
                  .filter(
                    (weapon) =>
                      fighters[myFighterSelected].level >= weapon.levelReq
                  )
                  .filter((weapon) => {
                    const necessarySkill =
                      weapon.weapType == 0
                        ? fighters[myFighterSelected].agility
                        : fighters[myFighterSelected].strength;
                    return necessarySkill >= weapon.skillReq;
                  })
                  .map((weapon, i) => (
                    <MyWeaponCard
                      changeFunction={setMyWeaponSelected}
                      currentChoice={myWeaponSelected}
                      key={i}
                      id={weapon.id}
                      {...weapon}
                    />
                  ))}
              </div>
              <h2 className="text-white text-xl text-center my-2 py-2 text-gradient">
                Finally, because you chose Fighter #{myFighterSelected}, here
                are your potential targets!
              </h2>
              <div className="flex flex-wrap justify-center items-center md:my-5 my-3">
                {fighters
                  .filter(
                    (fighter) =>
                      myFighters.find(
                        (myFighter) => myFighter.id == fighter.id
                      ) === undefined
                  )
                  .filter(
                    (fighter) =>
                      fighter.level >= fighters[myFighterSelected].level
                  )
                  .filter((fighter) => !fighter.isForSale)
                  .slice(0, 3)
                  .map((fighter, i) => (
                    <MyFightersCard
                      key={i}
                      changeFunction={setTargetFighterSelected}
                      currentChoice={targetFighterSelected}
                      {...fighter}
                    />
                  ))}
              </div>
              {isMyWeaponSelected && isTargetFighterSelected && (
                <button
                  type="button"
                  onClick={handleAttack}
                  className="bg-[#8e0005] py-2 px-5 mf:px-7 mx-2 mt-3 mf:mx-4 mf:mt-6 rounded-full cursor-pointer hover:bg-[#b20006]"
                >
                  <p className="text-white text-lg font-bold">Attack!</p>
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-between items-center">
          <h2 className="text-white text-3xl text-center my-2 text-gradient">
            Connect your account to participate in battles!
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
