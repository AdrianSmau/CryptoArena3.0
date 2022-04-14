import React, { useContext } from "react";
import { useParams } from "react-router-dom";

import colosseum from "../../../images/colosseum.png";
import notFound from "../../../images/404.png";
import warrior from "../../../images/warrior256.png";
import samurai from "../../../images/samurai256.png";
import druid from "../../../images/druid256.png";

import Loader from "../common/Loader";

import { shorten_address } from "../../utils/shorten_address";
import { BlockchainContext } from "../../context/Context";

const FighterPageContentInfo = ({
  id,
  name,
  level,
  timestamp,
  fighterClass,
  winCount,
  lossCount,
  HP,
  strength,
  agility,
  luck,
  dexterity,
  spendablePoints,
  currentXP,
  levelUpXP,
  owner,
  url,
}) => {
  if (id === undefined) {
    return (
      <div className="flex flex-col justify-between items-center">
        <h2 className="text-white text-3xl text-center my-2 text-gradient">
          Oops! This Fighter does not exist!
        </h2>
        <img
          src={notFound}
          alt="404"
          className="object-scale-down w-80 md:mt-10 mt-5 text-center white-glassmorphism"
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-between items-center w-full">
      <div className="flex md:flex-row flex-col justify-around items-center p-2 w-full">
        <h1 className="text-white md:text-4xl text-3xl text-center my-2 text-gradient">
          [ID #{id}] {name} the{" "}
          {fighterClass == 0
            ? "Warrior"
            : fighterClass == 1
            ? "Samurai"
            : "Druid"}
          !
        </h1>
        <div className="rounded-lg border-solid border-4 border-black">
          <img
            src={
              fighterClass == 0 ? warrior : fighterClass == 1 ? samurai : druid
            }
            alt="classImage"
            className="object-scale-down md:w-48 w-32 text-center"
          />
        </div>
      </div>
      <div className="flex flex-col justify-around items-center p-2 md:mt-15 mt-10 w-full">
        <p className="text-white md:text-2xl text-xl text-center my-4 text-base">
          Fighter's name: {name}
        </p>
        <a
          href={`https://rinkeby.etherscan.io/address/${owner}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="text-white md:text-2xl text-xl text-center my-4 text-base">
            Fighter's owner: {shorten_address(owner)}
          </p>
        </a>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <p className="text-white md:text-2xl text-xl text-center my-4 text-base">
            Link to this NFT from Rariable here!
          </p>
        </a>
        <p className="text-white md:text-2xl text-xl text-center my-4 text-base">
          Fighter's level: {level} ({currentXP} / {levelUpXP} for progression)
        </p>
        <p className="text-white md:text-2xl text-xl text-center my-4 text-base">
          Fighter's cooldown date: {timestamp}
        </p>
        <p className="text-white md:text-2xl text-xl text-center my-4 text-base">
          Fighter's win/lose ratio: {winCount}W / {lossCount}L
        </p>
        <p className="text-white md:text-2xl text-xl text-center my-4 text-base">
          Fighter's total Health Points: {HP} (improved during fights for
          Druids)
        </p>
        <p className="text-white md:text-2xl text-xl text-center my-4 text-base">
          Fighter's STR skill: {strength}
        </p>
        <p className="text-white md:text-2xl text-xl text-center my-4 text-base">
          Fighter's AGL skill: {agility}
        </p>
        <p className="text-white md:text-2xl text-xl text-center my-4 text-base">
          Fighter's LCK skill: {luck}
        </p>
        <p className="text-white md:text-2xl text-xl text-center my-4 text-base">
          Fighter's DEX skill: {dexterity}
        </p>
        <p className="text-white md:text-2xl text-xl text-center my-4 text-base">
          Fighter's spendable points: {spendablePoints}
        </p>
      </div>
    </div>
  );
};

const FighterPageContent = () => {
  const { id } = useParams();
  const { currentAccount, fighters, isContextLoading } =
    useContext(BlockchainContext);
  return (
    <div className="flex w-full justify-center items-center md:p-8 py-12 px-2 2xl:px-14 font-medieval">
      {isContextLoading ? (
        <Loader />
      ) : currentAccount ? (
        <FighterPageContentInfo key={id} {...fighters[id]} />
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

export default FighterPageContent;
