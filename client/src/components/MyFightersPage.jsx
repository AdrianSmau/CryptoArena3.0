import React, { useContext } from "react";
import { Link } from "react-router-dom";

import Loader from "./Loader";

import colosseum from "../../images/colosseum.png";

import warrior from "../../images/warrior256.png";
import samurai from "../../images/samurai256.png";
import druid from "../../images/druid256.png";

import { BlockchainContext } from "../context/Context";

const MyFightersPageCard = ({
  id,
  name,
  level,
  timestamp,
  fighterClass,
  currentXP,
  levelUpXP,
}) => {
  return (
    <div className="bg-[#181918] m-2 flex flex-1 2xl:min-w-[380px] 2xl:max-w-[475px] sm:min-w-[255px] sm:max-w-[275px] flex-col p-2 rounded-md hover:shadow-2xl">
      <div className="flex flex-col items-center w-full mt-2">
        <div className="w-full mb-2 p-1">
          <p className="text-white text-base sm:text-sm text-xs">Fighter's ID: {id}</p>
          <p className="text-white text-base sm:text-sm text-xs">Fighter's name: {name}</p>
          <p className="text-white text-base sm:text-sm text-xs">Fighter's level: {level}</p>
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
          <p className="text-white sm:font-bold font-semibold">{`Cooldown: ${timestamp}`}</p>
        </div>
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
  );
};

const MyFightersPage = () => {
  const { currentAccount, myFighters, isContextLoading } =
    useContext(BlockchainContext);
  return (
    <div className="flex flex-col md:p-4 py-2 px-2">
      {isContextLoading ? (
        <Loader />
      ) : currentAccount ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-white text-3xl text-center my-2 py-2 text-gradient">
            Welcome to your Barracks! Your fighters and weapons are displayed
            below!
          </h1>
          <div className="flex flex-wrap justify-center items-center md:mt-5 mt-3">
            {myFighters.reverse().map((fighter, i) => (
              <MyFightersPageCard key={i} {...fighter} />
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
