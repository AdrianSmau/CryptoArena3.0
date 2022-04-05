import React, { useContext } from "react";
import { Link } from "react-router-dom";

import Loader from "../common/Loader";

import warrior from "../../../images/warrior256.png";
import samurai from "../../../images/samurai256.png";
import druid from "../../../images/druid256.png";

import colosseum from "../../../images/colosseum.png";

import { shorten_address } from "../../utils/shorten_address";
import { BlockchainContext } from "../../context/Context";

const LatestFightersCard = ({
  id,
  name,
  level,
  timestamp,
  fighterClass,
  currentXP,
  levelUpXP,
  owner,
}) => {
  return (
    <div className="bg-[#181918] m-4 flex flex-1 2xl:min-w-[450px] 2xl:max-w-[500px] sm:min-w-[270px] sm:max-w-[300px] flex-col p-3 rounded-md hover:shadow-2xl">
      <div className="flex flex-col items-center w-full mt-3">
        <div className="w-full mb-6 p-2">
          <a
            href={`https://rinkeby.etherscan.io/address/${owner}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-white text-base">
              Owner: {shorten_address(owner)}
            </p>
          </a>
          <p className="text-white text-base">Fighter's ID: {id}</p>
          <p className="text-white text-base">Fighter's name: {name}</p>
          <p className="text-white text-base">Fighter's level: {level}</p>
          <p className="text-white text-base">
            Fighter's class:{" "}
            {fighterClass == 0
              ? "Warrior"
              : fighterClass == 1
              ? "Samurai"
              : "Druid"}
          </p>
          <p className="text-white text-base">
            Progress: {`${currentXP} XP / ${levelUpXP} XP for leveling up!`}
          </p>
        </div>
        <img
          src={
            fighterClass == 0 ? warrior : fighterClass == 1 ? samurai : druid
          }
          alt="classImage"
          className="object-scale-down w-32"
        />
        <div className="bg-black sm:text-lg text-base p-2 sm:px-3 px-2 w-max rounded-3xl -mt-5 shadow-2xl text-center">
          <p className="text-white sm:font-bold font-semibold">{`Cooldown: ${timestamp}`}</p>
        </div>
        <div className="bg-black sm:text-base text-sm p-1 sm:px-3 px-2 w-max rounded-3xl mt-0.25 shadow-2xl text-center">
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

const LatestFighters = () => {
  const { currentAccount, fighters, isContextLoading } =
    useContext(BlockchainContext);
  return (
    <>
      {isContextLoading ? (
        <Loader />
      ) : currentAccount ? (
        <div className="flex w-full justify-center items-center 2xl:px-20">
          <div className="flex flex-col md:p-4 py-2 px-2">
            <h3 className="text-white text-3xl text-center my-2 text-gradient">
              The challengers of the Arena are waiting for you!
            </h3>
            <div className="flex flex-wrap justify-center items-center mt-10">
              {fighters.reverse().map((fighter, i) => (
                <LatestFightersCard key={i} {...fighter} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-center items-center md:p-8 py-12 px-2 2xl:px-14 font-medieval">
          <div className="flex flex-col justify-between items-center">
            <h2 className="text-white text-3xl text-center my-2 text-gradient">
              Connect your account to see the archive of all the Fighters!
            </h2>
            <img
              src={colosseum}
              alt="colosseum"
              className="object-scale-down w-80 md:mt-10 mt-5 text-center white-glassmorphism"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LatestFighters;
