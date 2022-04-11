import React, { useContext, useEffect, useState } from "react";

import { ethers } from "ethers";

import Loader from "../common/Loader";

import colosseum from "../../../images/colosseum.png";

import ATierBlunt from "../../../images/ATierBlunt.png";
import ATierSlash from "../../../images/ATierSlash.png";
import BTierBlunt from "../../../images/BTierBlunt.png";
import BTierSlash from "../../../images/BTierSlash.png";
import STierBlunt from "../../../images/STierBlunt.png";
import STierSlash from "../../../images/STierSlash.png";

import { BlockchainContext } from "../../context/Context";

const MerchantContent = () => {
  const {
    currentAccount,
    isContextLoading,
    computeWeaponPrice,
    showConfirmationDisplay,
  } = useContext(BlockchainContext);

  const [levelSelected, setLevelSelected] = useState(0);
  const [isLevelSelected, setIsLevelSelected] = useState(false);
  const [tierSelected, setTierSelected] = useState(-1);
  const [isTierSelected, setIsTierSelected] = useState(false);
  const [typeSelected, setTypeSelected] = useState(-1);
  const [isTypeSelected, setIsTypeSelected] = useState(false);

  const [computedCost, setComputedCost] = useState(0);

  const handleTypeAndTierChange = (tier, type) => {
    setTierSelected(tier);
    setTypeSelected(type);
  };

  const AvailableWeapons = ({ tier, type, currentTier, currentType }) => {
    return (
      <div className="relative p-2">
        {tier == currentTier && type == currentType && (
          <div className="absolute -inset-2.5 bg-[#940000] rounded-md blur-md"></div>
        )}
        <div
          onClick={() => handleTypeAndTierChange(tier, type)}
          className="relative p-2 bg-[#181918] flex flex-1 2xl:min-w-[215px] 2xl:max-w-[305px] sm:min-w-[175px] sm:max-w-[200px] flex-col rounded-md hover:shadow-2xl"
        >
          {type == 0 ? (
            tier == 0 ? (
              <div className="flex flex-col justify-center items-center w-full my-2 w-full">
                <p className="text-white text-base sm:text-sm text-xs">
                  S-Tier Slash Weapon
                </p>
                <img
                  src={STierSlash}
                  alt="STierSlash"
                  className="object-scale-down w-24"
                />
              </div>
            ) : tier == 1 ? (
              <div className="flex flex-col justify-center items-center w-full mt-2 w-full mb-2">
                <p className="text-white text-base sm:text-sm text-xs">
                  A-Tier Slash Weapon
                </p>
                <img
                  src={ATierSlash}
                  alt="ATierSlash"
                  className="object-scale-down w-24"
                />
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center w-full mt-2 w-full mb-2">
                <p className="text-white text-base sm:text-sm text-xs">
                  B-Tier Slash Weapon
                </p>
                <img
                  src={BTierSlash}
                  alt="BTierSlash"
                  className="object-scale-down w-24"
                />
              </div>
            )
          ) : tier == 0 ? (
            <div className="flex flex-col justify-center items-center w-full mt-2 w-full mb-2">
              <p className="text-white text-base sm:text-sm text-xs">
                S-Tier Blunt Weapon
              </p>
              <img
                src={STierBlunt}
                alt="STierBlunt"
                className="object-scale-down w-24"
              />
            </div>
          ) : tier == 1 ? (
            <div className="flex flex-col justify-center items-center w-full mt-2 w-full mb-2">
              <p className="text-white text-base sm:text-sm text-xs">
                A-Tier Blunt Weapon
              </p>
              <img
                src={ATierBlunt}
                alt="ATierBlunt"
                className="object-scale-down w-24"
              />
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center w-full mt-2 w-full mb-2">
              <p className="text-white text-base sm:text-sm text-xs">
                B-Tier Blunt Weapon
              </p>
              <img
                src={BTierBlunt}
                alt="BTierBlunt"
                className="object-scale-down w-24"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleLevelSubmit = (e) => {
    e.preventDefault();
    if (levelSelected >= 1) {
      setIsLevelSelected(true);
    }
    console.log("My selected level is: " + levelSelected);
  };

  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    if (
      levelSelected < 1 ||
      typeSelected < 0 ||
      typeSelected > 1 ||
      tierSelected < 0 ||
      tierSelected > 2
    ) {
      return;
    }
    showConfirmationDisplay(
      levelSelected,
      tierSelected,
      typeSelected,
      computedCost
    );
  };

  useEffect(() => {
    if (tierSelected >= 0) {
      setIsTierSelected(true);
      const getPrice = async () => {
        const price = await computeWeaponPrice(levelSelected, tierSelected);
        console.log(ethers.utils.formatEther(price));
        setComputedCost(ethers.utils.formatEther(price));
      };
      getPrice();
    }
    console.log("My selected tier is: " + tierSelected);
  }, [tierSelected]);

  useEffect(() => {
    if (typeSelected >= 0) {
      setIsTypeSelected(true);
    }
    console.log("My selected type is: " + typeSelected);
  }, [typeSelected]);

  return (
    <div className="flex flex-col md:p-4 px-2">
      {isContextLoading ? (
        <Loader />
      ) : currentAccount ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-white text-3xl text-center my-2 text-gradient">
            Welcome to the Merchant! You can purchase a custom-fitted weapon! Go
            ahead and choose a level, a weapon tier and a weapon type!
          </h1>
          <h2 className="text-white text-xl text-center my-2 py-2 text-gradient">
            Type below the weapon level of your choice!
          </h2>
          <div className="flex flex-wrap justify-center items-center md:my-5 my-3">
            <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center red-glassmorphism">
              <input
                placeholder="Enter your chosen weapon level!"
                type="number"
                step="1"
                value={levelSelected}
                onChange={(e) => setLevelSelected(e.target.value)}
                className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
              />
              <button
                type="button"
                onClick={handleLevelSubmit}
                className="text-white w-full mt-2 border-[1px] p-2 border-[#fff] rounded-full cursor-pointer"
              >
                Choose level!
              </button>
            </div>
          </div>
          {isLevelSelected && (
            <>
              <h2 className="text-white text-xl text-center my-2 py-2 text-gradient">
                Next up, select your weapon type and tier!
              </h2>
              <div className="flex flex-wrap justify-center items-center md:my-5 my-3">
                {
                  <AvailableWeapons
                    tier={0}
                    type={0}
                    currentTier={tierSelected}
                    currentType={typeSelected}
                  />
                }
                {
                  <AvailableWeapons
                    tier={0}
                    type={1}
                    currentTier={tierSelected}
                    currentType={typeSelected}
                  />
                }
                {
                  <AvailableWeapons
                    tier={1}
                    type={0}
                    currentTier={tierSelected}
                    currentType={typeSelected}
                  />
                }
                {
                  <AvailableWeapons
                    tier={1}
                    type={1}
                    currentTier={tierSelected}
                    currentType={typeSelected}
                  />
                }
                {
                  <AvailableWeapons
                    tier={2}
                    type={0}
                    currentTier={tierSelected}
                    currentType={typeSelected}
                  />
                }
                {
                  <AvailableWeapons
                    tier={2}
                    type={1}
                    currentTier={tierSelected}
                    currentType={typeSelected}
                  />
                }
              </div>
              {isTierSelected && isTypeSelected && (
                <>
                  <h2 className="text-white text-xl text-center my-2 py-2 text-gradient">
                    Your computed price for the created weapon is {computedCost}
                  </h2>
                  <button
                    type="button"
                    onClick={handlePurchaseSubmit}
                    className="bg-[#8e0005] py-2 px-5 mf:px-7 mx-2 mt-3 mf:mx-4 mf:mt-6 rounded-full cursor-pointer hover:bg-[#b20006]"
                  >
                    <p className="text-white text-lg font-bold">Purchase!</p>
                  </button>
                </>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-between items-center">
          <h2 className="text-white text-3xl text-center my-2 text-gradient">
            Connect your account to purchase new Weapons!
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

export default MerchantContent;
