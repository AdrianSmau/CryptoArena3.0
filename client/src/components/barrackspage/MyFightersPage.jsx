import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import Loader from "../common/Loader";

import colosseum from "../../../images/colosseum.png";

import warrior from "../../../images/warrior256.png";
import samurai from "../../../images/samurai256.png";
import druid from "../../../images/druid256.png";

import ATierBlunt from "../../../images/ATierBlunt.png";
import ATierSlash from "../../../images/ATierSlash.png";
import BTierBlunt from "../../../images/BTierBlunt.png";
import BTierSlash from "../../../images/BTierSlash.png";
import STierBlunt from "../../../images/STierBlunt.png";
import STierSlash from "../../../images/STierSlash.png";

import LoadingRedeemModal from "./LoadingRedeemModal";
import SpendablePointsResult from "./SpendablePointsResult";

import { BlockchainContext } from "../../context/Context";

const MyFightersPageCard = ({
  id,
  name,
  level,
  timestamp,
  fighterClass,
  currentXP,
  levelUpXP,
  spendablePoints,
  spendablePointsFunction,
  showResultModal,
  isLoading,
}) => {
  const [showModal, setShowModal] = useState(false);

  const SpendablePointsModal = () => {
    const [pointsLeft, setPointsLeft] = useState(spendablePoints);
    const [strPoints, setStrPoints] = useState(0);
    const [aglPoints, setAglPoints] = useState(0);
    const [lckPoints, setLckPoints] = useState(0);
    const [dexPoints, setDexPoints] = useState(0);

    return (
      <div className="bg-neutral-800 bg-opacity-80 fixed inset-0 z-50">
        <div className="flex h-screen justify-center items-center">
          <div className="flex flex-col justify-center items-center bg-black p-2 md:p-4 border-4 border-red-900 rounded-xl">
            <p className="text-white md:text-2xl text-3xl text-center text-gradient">
              You have {pointsLeft} point(s) left to spend for Fighter {name}!
            </p>
            <div className="flex flex-col md:my-8 my-5">
              {/* ------------ STRENGTH SECTION ------------ */}
              <div className="flex flex-row justify-center items-center md:my-2 my-3">
                <button
                  type="button"
                  onClick={() => {
                    if (strPoints == 0) {
                      return;
                    }
                    setPointsLeft(pointsLeft + 1);
                    setStrPoints(strPoints - 1);
                  }}
                  className="bg-[#8e0005] py-2 px-5 mf:px-7 rounded-full cursor-pointer hover:bg-[#b20006]"
                >
                  <p className="text-white text-base font-semibold">-</p>
                </button>
                <div className="md:mx-6 mx-4">
                  <p className="text-white text-base sm:text-md text-lg">
                    STR points assigned: {strPoints}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (pointsLeft == 0) {
                      return;
                    }
                    setPointsLeft(pointsLeft - 1);
                    setStrPoints(strPoints + 1);
                  }}
                  className="bg-[#8e0005] py-2 px-5 mf:px-7 rounded-full cursor-pointer hover:bg-[#b20006]"
                >
                  <p className="text-white text-base font-semibold">+</p>
                </button>
              </div>

              {/* ------------ AGILITY SECTION ------------ */}
              <div className="flex flex-row justify-center items-center md:my-2 my-3">
                <button
                  type="button"
                  onClick={() => {
                    if (aglPoints == 0) {
                      return;
                    }
                    setPointsLeft(pointsLeft + 1);
                    setAglPoints(aglPoints - 1);
                  }}
                  className="bg-[#8e0005] py-2 px-5 mf:px-7 rounded-full cursor-pointer hover:bg-[#b20006]"
                >
                  <p className="text-white text-base font-semibold">-</p>
                </button>
                <div className="md:mx-6 mx-4">
                  <p className="text-white text-base sm:text-md text-lg">
                    AGL points assigned: {aglPoints}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (pointsLeft == 0) {
                      return;
                    }
                    setPointsLeft(pointsLeft - 1);
                    setAglPoints(aglPoints + 1);
                  }}
                  className="bg-[#8e0005] py-2 px-5 mf:px-7 rounded-full cursor-pointer hover:bg-[#b20006]"
                >
                  <p className="text-white text-base font-semibold">+</p>
                </button>
              </div>

              {/* ------------ LUCK SECTION ------------ */}
              <div className="flex flex-row justify-center items-center md:my-2 my-3">
                <button
                  type="button"
                  onClick={() => {
                    if (lckPoints == 0) {
                      return;
                    }
                    setPointsLeft(pointsLeft + 1);
                    setLckPoints(lckPoints - 1);
                  }}
                  className="bg-[#8e0005] py-2 px-5 mf:px-7 rounded-full cursor-pointer hover:bg-[#b20006]"
                >
                  <p className="text-white text-base font-semibold">-</p>
                </button>
                <div className="md:mx-6 mx-4">
                  <p className="text-white text-base sm:text-md text-lg">
                    LCK points assigned: {lckPoints}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (pointsLeft == 0) {
                      return;
                    }
                    setPointsLeft(pointsLeft - 1);
                    setLckPoints(lckPoints + 1);
                  }}
                  className="bg-[#8e0005] py-2 px-5 mf:px-7 rounded-full cursor-pointer hover:bg-[#b20006]"
                >
                  <p className="text-white text-base font-semibold">+</p>
                </button>
              </div>

              {/* ------------ DEXTERITY SECTION ------------ */}
              <div className="flex flex-row justify-center items-center md:my-2 my-3">
                <button
                  type="button"
                  onClick={() => {
                    if (dexPoints == 0) {
                      return;
                    }
                    setPointsLeft(pointsLeft + 1);
                    setDexPoints(dexPoints - 1);
                  }}
                  className="bg-[#8e0005] py-2 px-5 mf:px-7 rounded-full cursor-pointer hover:bg-[#b20006]"
                >
                  <p className="text-white text-base font-semibold">-</p>
                </button>
                <div className="md:mx-6 mx-4">
                  <p className="text-white text-base sm:text-md text-lg">
                    DEX points assigned: {dexPoints}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (pointsLeft == 0) {
                      return;
                    }
                    setPointsLeft(pointsLeft - 1);
                    setDexPoints(dexPoints + 1);
                  }}
                  className="bg-[#8e0005] py-2 px-5 mf:px-7 rounded-full cursor-pointer hover:bg-[#b20006]"
                >
                  <p className="text-white text-base font-semibold">+</p>
                </button>
              </div>
            </div>
            <div className="flex flex-row">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  spendablePointsFunction(
                    id,
                    strPoints,
                    aglPoints,
                    lckPoints,
                    dexPoints
                  );
                }}
                className="bg-[#8e0005] py-2 px-5 mf:px-7 mx-2 mt-3 mf:mx-4 mf:mt-6 rounded-full cursor-pointer hover:bg-[#b20006]"
              >
                <p className="text-white text-base font-semibold">Redeem</p>
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-[#8e0005] py-2 px-5 mf:px-7 mx-2 mt-3 mf:mx-4 mf:mt-6 rounded-full cursor-pointer hover:bg-[#b20006]"
              >
                <p className="text-white text-base font-semibold">Cancel</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-[#181918] m-2 flex flex-1 2xl:min-w-[380px] 2xl:max-w-[475px] sm:min-w-[255px] sm:max-w-[275px] flex-col p-2 rounded-md hover:shadow-2xl">
        <div className="flex flex-col items-center w-full mt-2">
          <div className="w-full mb-2 p-1">
            <p className="text-white text-base sm:text-sm text-xs">
              Fighter's ID: {id}
            </p>
            <p className="text-white text-base sm:text-sm text-xs">
              Fighter's name: {name}
            </p>
            <p className="text-white text-base sm:text-sm text-xs">
              Fighter's level: {level}
            </p>
            <p className="text-white text-base sm:text-sm text-xs">
              Fighter's class:{" "}
              {fighterClass == 0
                ? "Warrior"
                : fighterClass == 1
                ? "Samurai"
                : "Druid"}
            </p>
            <p className="text-white text-base sm:text-sm text-xs">
              Progress: {`${currentXP} XP / ${levelUpXP} XP for leveling up!`}
            </p>
          </div>
          <img
            src={
              fighterClass == 0 ? warrior : fighterClass == 1 ? samurai : druid
            }
            alt="classImage"
            className="object-scale-down w-24"
          />
          <div className="bg-black sm:text-sm text-xs p-2 sm:px-2 px-1 w-max rounded-3xl -mt-5 shadow-2xl text-center">
            <p className="text-white sm:font-bold font-semibold">{`Cooldown: ${timestamp.toLocaleString()}`}</p>
          </div>
          {spendablePoints > 0 && (
            <div className="bg-black sm:text-sm text-xs p-2 sm:px-2 px-1 w-max rounded-3xl mt-0.25 shadow-2xl text-center">
              <button
                onClick={() => setShowModal(true)}
                className="text-white sm:font-bold font-semibold"
              >
                Spend fighter's available points!
              </button>
            </div>
          )}
          <div className="bg-black sm:text-sm text-xs p-1 sm:px-2 px-1 w-max rounded-3xl mt-0.25 shadow-2xl text-center">
            <Link
              to={`/fighters/${id}`}
              className="text-white sm:font-bold font-semibold"
            >
              View Fighter's Page
            </Link>
          </div>
        </div>
      </div>
      {showModal && <SpendablePointsModal />}
      {showResultModal && <SpendablePointsResult />}
      {isLoading && <LoadingRedeemModal />}
    </>
  );
};

const MyWeaponsPageCard = ({
  id,
  levelReq,
  damage,
  skillReq,
  weapType,
  tier,
}) => {
  return (
    <div className="bg-[#181918] m-2 flex flex-1 2xl:min-w-[380px] 2xl:max-w-[475px] sm:min-w-[255px] sm:max-w-[275px] flex-col p-2 rounded-md hover:shadow-2xl">
      <div className="flex flex-col items-center w-full mt-2">
        <div className="w-full mb-2 p-1">
          <p className="text-white text-base sm:text-sm text-xs">
            Weapon's ID: {id}
          </p>
          <p className="text-white text-base sm:text-sm text-xs">
            Weapon's tier:{" "}
            {tier == 0 ? "S-tier" : tier == 1 ? "A-Tier" : "B-Tier"}
          </p>
          <p className="text-white text-base sm:text-sm text-xs">
            Weapon's type: {weapType == 0 ? "Slash" : "Blunt"}
          </p>
          <p className="text-white text-base sm:text-sm text-xs">
            Weapon's level requirement: {levelReq}
          </p>
          <p className="text-white text-base sm:text-sm text-xs">
            Weapon's skill requirement:{" "}
            {weapType == 0 ? `${skillReq} AGL` : `${skillReq} STR`}
          </p>
          <p className="text-white text-base sm:text-sm text-xs">
            Weapon's base damage: {damage}
          </p>
        </div>
        <img
          src={
            weapType == 0
              ? tier == 0
                ? STierSlash
                : tier == 1
                ? ATierSlash
                : BTierSlash
              : tier == 0
              ? STierBlunt
              : tier == 1
              ? ATierBlunt
              : BTierBlunt
          }
          alt="classImage"
          className="object-scale-down w-24"
        />
      </div>
    </div>
  );
};

const MyFightersPage = () => {
  const {
    currentAccount,
    myFighters,
    myWeapons,
    isContextLoading,
    redeemSpendablePoints,
    displaySpendingResult,
    isLoading,
  } = useContext(BlockchainContext);

  return (
    <div className="flex flex-col md:p-4 py-2 px-2">
      {isContextLoading ? (
        <Loader />
      ) : currentAccount ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-white text-3xl text-center my-2 text-gradient">
            Welcome to your Barracks! Your fighters and weapons are displayed
            below!
          </h1>
          <div className="flex flex-wrap justify-center items-center md:mt-5 mt-3">
            {myFighters.reverse().map((fighter, i) => (
              <MyFightersPageCard
                key={i}
                spendablePointsFunction={redeemSpendablePoints}
                showResultModal={displaySpendingResult}
                isLoading={isLoading}
                {...fighter}
              />
            ))}
          </div>
          <div className="flex flex-wrap justify-center items-center md:mt-5 mt-3">
            {myWeapons.reverse().map((weapon, i) => (
              <MyWeaponsPageCard key={i} {...weapon} />
            ))}
          </div>
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

export default MyFightersPage;
