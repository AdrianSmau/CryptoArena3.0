import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

import Loader from "../common/Loader";
import BuyingModal from "./BuyingModal";
import BuyingReceipt from "./BuyingReceipt";

import warrior from "../../../images/warrior256.png";
import samurai from "../../../images/samurai256.png";
import druid from "../../../images/druid256.png";

import colosseum from "../../../images/colosseum.png";

import { shorten_address } from "../../utils/shorten_address";
import { BlockchainContext } from "../../context/Context";

const BuyableCard = ({
  id,
  name,
  level,
  fighterClass,
  strength,
  agility,
  dexterity,
  luck,
  sellerFunction,
  priceFunction,
  buyFunction,
}) => {
  const [seller, setSeller] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [price, setPrice] = useState(0);
  const [isPrice, setIsPrice] = useState(false);

  const [showBuyModal, setShowBuyModal] = useState(false);

  useEffect(() => {
    if (!seller || !price) {
      sellerFunction(id).then((res) => setSeller(shorten_address(res)));
      priceFunction(id).then((res) => setPrice(res));
      setIsSeller(true);
      setIsPrice(true);
    }
  }, []);

  const BuyModal = () => {
    const handleBuyButton = (e) => {
      e.preventDefault();
      setShowBuyModal(false);
      buyFunction(id, ethers.utils.formatEther(price));
    };

    return (
      <div className="bg-neutral-800 bg-opacity-80 fixed inset-0 z-50">
        <div className="flex h-screen justify-center items-center">
          <div className="flex flex-col justify-center items-center bg-black p-2 md:p-4 border-4 border-red-900 rounded-xl">
            <p className="text-white md:text-xl text-2xl pb-2 md:pb-4 text-center text-gradient">
              Are you sure you want to buy Fighter {id} for{" "}
              {ethers.utils.formatEther(price)} ETH?
            </p>
            <div className="flex flex-row">
              <button
                type="button"
                onClick={handleBuyButton}
                className="bg-[#8e0005] py-2 px-5 mf:px-7 mx-2 mt-3 mf:mx-4 mf:mt-6 rounded-full cursor-pointer hover:bg-[#b20006]"
              >
                <p className="text-white text-base font-semibold">Yes</p>
              </button>
              <button
                type="button"
                onClick={() => setShowBuyModal(false)}
                className="bg-[#8e0005] py-2 px-5 mf:px-7 mx-2 mt-3 mf:mx-4 mf:mt-6 rounded-full cursor-pointer hover:bg-[#b20006]"
              >
                <p className="text-white text-base font-semibold">No</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-[#181918] m-4 flex flex-1 2xl:min-w-[450px] 2xl:max-w-[500px] sm:min-w-[270px] sm:max-w-[300px] flex-col p-3 rounded-md hover:shadow-2xl">
        <div className="flex flex-col items-center w-full mt-3">
          <div className="w-full mb-6 p-2">
            <p className="text-white text-base">
              [ID #{id}] {name} the{" "}
              {fighterClass == 0
                ? "Warrior"
                : fighterClass == 1
                ? "Samurai"
                : "Druid"}
            </p>
            <p className="text-white text-base">Fighter's level: {level}</p>
            <p className="text-white text-base">
              Stats: STR {strength} AGL {agility} DEX {dexterity} LCK {luck}
            </p>
          </div>
          <img
            src={
              fighterClass == 0 ? warrior : fighterClass == 1 ? samurai : druid
            }
            alt="classImage"
            className="object-scale-down w-32"
          />
          <div className="bg-black sm:text-base text-sm p-1 sm:px-3 px-2 w-max rounded-3xl -mt-3 shadow-2xl text-center">
            <Link
              to={`/fighters/${id}`}
              className="text-white sm:font-bold font-semibold"
            >
              View Fighter's Page
            </Link>
          </div>
          {isSeller && isPrice ? (
            <>
              <div className="bg-black sm:text-base text-sm p-1 sm:px-3 px-2 w-max rounded-3xl mt-0.25 shadow-2xl text-center">
                <a
                  href={`https://rinkeby.etherscan.io/address/${seller}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="text-white sm:font-bold font-semibold">
                    Seller: {shorten_address(seller)}
                  </p>
                </a>
              </div>
              <div className="bg-black sm:text-base text-sm p-1 sm:px-3 px-2 w-max rounded-3xl mt-0.25 shadow-2xl text-center">
                <p
                  onClick={() => setShowBuyModal(true)}
                  className="text-white sm:font-bold font-semibold cursor-pointer"
                >{`Buy NOW for ${ethers.utils.formatEther(price)} ETH`}</p>
              </div>
            </>
          ) : (
            <Loader />
          )}
        </div>
      </div>
      {showBuyModal && <BuyModal />}
    </>
  );
};

const MarketContent = () => {
  const {
    currentAccount,
    fighters,
    isContextLoading,
    getSeller,
    getPrice,
    buyFighter,
    displayFighterBuyConfirmation,
    isLoading,
  } = useContext(BlockchainContext);
  return (
    <>
      {isContextLoading ? (
        <Loader />
      ) : currentAccount ? (
        <div className="flex w-full justify-center items-center 2xl:px-20">
          <div className="flex flex-col md:p-4 py-2 px-2">
            <h3 className="text-white text-3xl text-center my-2 text-gradient">
              Welcome to the Market! Buy any Fighter listed up for sale using
              ETH!
            </h3>
            <div className="flex flex-wrap justify-center items-center mt-10">
              {fighters
                .reverse()
                .filter((fighter) => fighter.isForSale)
                .map((fighter, i) => (
                  <BuyableCard
                    key={i}
                    sellerFunction={getSeller}
                    priceFunction={getPrice}
                    buyFunction={buyFighter}
                    {...fighter}
                  />
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-center items-center md:p-8 py-12 px-2 2xl:px-14 font-medieval">
          <div className="flex flex-col justify-between items-center">
            <h2 className="text-white text-3xl text-center my-2 text-gradient">
              Connect your account to see the Market!
            </h2>
            <img
              src={colosseum}
              alt="colosseum"
              className="object-scale-down w-80 md:mt-10 mt-5 text-center white-glassmorphism"
            />
          </div>
        </div>
      )}
      {isLoading && <BuyingModal />}
      {displayFighterBuyConfirmation && <BuyingReceipt />}
    </>
  );
};

export default MarketContent;
