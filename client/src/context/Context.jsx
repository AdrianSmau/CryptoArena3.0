import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { arenaABI, address } from "../utils/constants";
import axios from "axios";

export const BlockchainContext = React.createContext();

const { ethereum } = window;

const getArenaContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(address, arenaABI, signer);

  return contract;
};

export const BlockchainProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formDataFighter, setFormDataFighter] = useState({ fighterName: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isContextLoading, setIsContextLoading] = useState(false);

  const [currentPredictionLoss, setCurrentPredictionLoss] = useState(-1);

  const [fighters, setFighters] = useState([]);
  const [myFighters, setMyFighters] = useState([]);
  const [myWeapons, setMyWeapons] = useState([]);
  const [myPupils, setMyPupils] = useState(0);

  const [showRecruitModal, setShowRecruitModal] = useState(false);

  const [fightersCount, setFightersCount] = useState(
    localStorage.getItem("fightersCount")
  );

  const [attackStats, setAttackStats] = useState([]);
  const [youWon, setYouWon] = useState(false);
  // 0 - you dodged
  // 1 - target dodged
  // 2 - you dealt critical damage
  // 3 - target dealt critical damage
  // 4 - you hit normal attack
  // 5 - target hit normal attack

  const [displayAttackLogs, setDisplayAttackLogs] = useState(false);
  const [displayError, setDisplayError] = useState(false);

  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [displayReceipt, setDisplayReceipt] = useState(false);

  const [displaySpendingResult, setDisplaySpendingResult] = useState(false);

  const [displayUpForSaleConfirmation, setDisplayUpForSaleConfirmation] =
    useState(false);

  const [displayFighterBuyConfirmation, setDisplayFighterBuyConfirmation] =
    useState(false);

  const [displayGiftConfirmation, setDisplayGiftConfirmation] = useState(false);

  const [formDataPurchase, setFormDataPurchase] = useState({
    level: 0,
    type: -1,
    tier: -1,
    value: 0,
  });

  const handleChangeFighter = (e, name) => {
    setFormDataFighter((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length) {
          setIsContextLoading(true);
          setCurrentAccount(accounts[0]);
          await getLatestFighters(0);
          await getMyFighters(accounts[0]);
          await getMyWeapons(accounts[0]);
          await getMyPupils(accounts[0]);
          setIsContextLoading(false);
        } else {
          console.log("No accounts found!");
        }
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  const checkIfFightersExist = async () => {
    try {
      if (ethereum) {
        if (currentAccount) {
          const arenaContract = getArenaContract();
          const allFighters = await arenaContract._getFightersCount();
          window.localStorage.setItem("fightersCount", allFighters);
        } else {
          console.log("No account set!");
        }
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (ethereum) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts);
        setCurrentAccount(accounts[0]);
        window.location.reload();
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  /* ----------------------FIGHTER FACTORY------------------------------------------------------- */

  const getLatestFighters = async (fightCount) => {
    try {
      if (ethereum) {
        const arenaContract = getArenaContract();
        const latestFighters = await arenaContract._getLatestFighters(
          fightCount
        );
        const formattedFighters = latestFighters.map((currentFighter) => ({
          id: currentFighter.id.toNumber(),
          name: currentFighter.fighter.name,
          isForSale: currentFighter.fighter.isForSale,
          level: currentFighter.fighter.level,
          url:
            "https://rinkeby.rarible.com/token/" +
            address.toLowerCase() +
            ":" +
            currentFighter.id,
          timestamp: new Date(
            new Number(currentFighter.fighter.readyTime) * 1000
          ).toLocaleString(),
          fighterClass: currentFighter.fighter.class,
          winCount: currentFighter.fighter.winCount,
          lossCount: currentFighter.fighter.lossCount,
          HP: currentFighter.fighter.HP,
          strength: currentFighter.fighter.strength,
          agility: currentFighter.fighter.agility,
          luck: currentFighter.fighter.luck,
          dexterity: currentFighter.fighter.dexterity,
          currentXP: currentFighter.fighter.currentXP,
          levelUpXP: currentFighter.fighter.levelUpXP,
          owner: currentFighter.owner,
          spendablePoints: currentFighter.fighter.spendablePoints,
        }));
        setFighters(formattedFighters.reverse());
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  const getMyFighters = async (account) => {
    try {
      if (ethereum) {
        const arenaContract = getArenaContract();
        const myFighters = await arenaContract._getUserFighters(account);
        const formattedFighters = myFighters.map((currentFighter) => ({
          id: currentFighter.id.toNumber(),
          name: currentFighter.fighter.name,
          level: currentFighter.fighter.level,
          timestamp: new Date(
            new Number(currentFighter.fighter.readyTime) * 1000
          ),
          fighterClass: currentFighter.fighter.class,
          winCount: currentFighter.fighter.winCount,
          lossCount: currentFighter.fighter.lossCount,
          HP: currentFighter.fighter.HP,
          strength: currentFighter.fighter.strength,
          agility: currentFighter.fighter.agility,
          luck: currentFighter.fighter.luck,
          dexterity: currentFighter.fighter.dexterity,
          currentXP: currentFighter.fighter.currentXP,
          levelUpXP: currentFighter.fighter.levelUpXP,
          spendablePoints: currentFighter.fighter.spendablePoints,
        }));
        setMyFighters(formattedFighters.reverse());
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  const getMyWeapons = async (account) => {
    try {
      if (ethereum) {
        const arenaContract = getArenaContract();
        const myWeapons = await arenaContract._getUserWeapons(account);
        const formattedWeapons = myWeapons.map((currentWeapon) => ({
          id: currentWeapon.id.toNumber(),
          levelReq: currentWeapon.weapon.levelReq,
          damage: currentWeapon.weapon.damage,
          skillReq: currentWeapon.weapon.skillReq,
          weapType: currentWeapon.weapon.weapType,
          tier: currentWeapon.weapon.tier,
        }));
        setMyWeapons(formattedWeapons.reverse());
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  const getMyPupils = async (account) => {
    try {
      if (ethereum) {
        const arenaContract = getArenaContract();
        const availablePupils = await arenaContract.fetchAvailablePupils(
          account
        );
        setMyPupils(availablePupils);
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  const createNewFighter = async (fighterClass) => {
    try {
      if (ethereum) {
        const fighterName = formDataFighter.fighterName;
        const contract = getArenaContract();

        const hash = await contract.createFirstFighter(
          fighterName,
          fighterClass,
          {
            gasLimit: "0x33450",
          }
        );

        setIsLoading(true);
        await hash.wait();
        setIsLoading(false);

        const currentFightersCount = await contract._getFightersCount();
        setFightersCount(currentFightersCount.toNumber());
        window.location.reload();
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  const recruitPupil = async (fighterClass) => {
    try {
      if (ethereum) {
        const fighterName = formDataFighter.fighterName;
        const contract = getArenaContract();

        const hash = await contract.redeemAvailablePupil(
          fighterName,
          fighterClass,
          {
            gasLimit: "0x33450",
          }
        );

        setIsLoading(true);
        await hash.wait();
        setIsLoading(false);

        const currentFightersCount = await contract._getFightersCount();
        setFightersCount(currentFightersCount.toNumber());
        window.location.reload();
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  const attackFighter = async (myFighterId, myWeaponId, targetFighterId) => {
    try {
      if (ethereum) {
        var doIHaveWeapon = true;

        if (myWeaponId === -1) {
          doIHaveWeapon = false;
          myWeaponId = 0;
        }

        const contract = getArenaContract();

        setAttackStats([]);

        contract.on(
          "ArenaEvent",
          async (attackerId, targetId, damage, wasCritical) => {
            var result = -1;
            if (damage == 0) {
              if (attackerId == myFighterId) {
                result = 0;
              } else {
                result = 1;
              }
            } else {
              if (wasCritical) {
                if (attackerId == myFighterId) {
                  result = 2;
                } else {
                  result = 3;
                }
              } else {
                if (attackerId == myFighterId) {
                  result = 4;
                } else {
                  result = 5;
                }
              }
            }
            setAttackStats((currentStats) => [...currentStats, result]);
          }
        );

        contract.once("WhoWon", async (IWon) => {
          setYouWon(IWon);
        });

        setYouWon(false);

        const result = await contract.attack(
          myFighterId,
          doIHaveWeapon,
          myWeaponId,
          targetFighterId,
          {
            gasLimit: `0x${(
              210000 +
              7500 *
                (fighters[myFighterId].level + fighters[targetFighterId].level)
            ).toString(16)}`,
          }
        );

        setIsLoading(true);
        await result.wait();
        setIsLoading(false);

        setDisplayAttackLogs(true);
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setDisplayError(true);
    }
  };

  const computeWeaponPrice = async (level, tier) => {
    try {
      if (ethereum) {
        const contract = getArenaContract();
        const price = await contract._computeWeaponPrice(level, tier);

        return price;
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  const showConfirmationDisplay = async (level, tier, type, value) => {
    try {
      if (ethereum) {
        setFormDataPurchase((prevState) => ({
          ...prevState,
          ["level"]: level,
          ["tier"]: tier,
          ["type"]: type,
          ["value"]: value,
        }));
        setDisplayConfirmationModal(true);
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  const purchaseWeapon = async (level, tier, type, value) => {
    try {
      if (ethereum) {
        const contract = getArenaContract();

        const result = await contract._purchaseWeapon(level, type, tier, {
          gasLimit: "0x1FBD0",
          value: ethers.utils.parseEther(value)._hex,
        });

        setIsLoading(true);
        await result.wait();
        setIsLoading(false);

        setDisplayReceipt(true);
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setDisplayError(true);
    }
  };

  const redeemSpendablePoints = async (id, str, agl, lck, dex) => {
    try {
      if (ethereum) {
        const contract = getArenaContract();

        const result = await contract._spendAvailablePoints(
          id,
          str,
          agl,
          lck,
          dex,
          {
            gasLimit: "0xC350",
          }
        );

        setIsLoading(true);
        await result.wait();
        setIsLoading(false);

        setDisplaySpendingResult(true);
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setDisplayError(true);
    }
  };

  const putOnMarket = async (id, price) => {
    try {
      if (ethereum) {
        const contract = getArenaContract();

        const result = await contract.putUpForSale(
          id,
          ethers.utils.parseEther(price),
          {
            gasLimit: "0x249F0",
          }
        );

        setIsLoading(true);
        await result.wait();
        setIsLoading(false);

        setDisplayUpForSaleConfirmation(true);
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setDisplayError(true);
    }
  };

  const getPredictionLoss = async () => {
    try {
      return axios
        .get("http://127.0.0.1:5000/loss")
        .catch((err) => {
          console.log(err);
        })
        .then((response) => setCurrentPredictionLoss(response.data));
    } catch (error) {
      console.log(error);
      setDisplayError(true);
    }
  };

  const getPredictedPrice = async (id) => {
    try {
      if (ethereum) {
        // Request prediction form Flask server
        const body = JSON.stringify({
          level: fighters[id].level,
          class: fighters[id].fighterClass,
          wins: fighters[id].winCount,
          losses: fighters[id].lossCount,
        });

        return axios
          .post("http://127.0.0.1:5000/predict", body, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      setDisplayError(true);
    }
  };

  const buyFighter = async (id, price) => {
    try {
      if (ethereum) {
        const contract = getArenaContract();

        const result = await contract.buyFighter(id, {
          gasLimit: "0x249F0",
          value: ethers.utils.parseEther(price)._hex,
        });

        setIsLoading(true);
        await result.wait();
        setIsLoading(false);

        // Send data to Flask server in order to feed the algorithm
        const body = JSON.stringify({
          features: {
            level: fighters[id].level,
            class: fighters[id].fighterClass,
            wins: fighters[id].winCount,
            losses: fighters[id].lossCount,
          },
          target: (20 * price) / 21,
        });

        axios
          .post("http://127.0.0.1:5000/feed", body, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            setCurrentPredictionLoss(response.data);
          })
          .catch((err) => {
            console.log(err);
          });

        setDisplayFighterBuyConfirmation(true);
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setDisplayError(true);
    }
  };

  const giftFighter = async (id, receiver) => {
    try {
      if (ethereum) {
        const contract = getArenaContract();

        const result = await contract.giftFighter(receiver, id, {
          gasLimit: "0x249F0",
        });

        setIsLoading(true);
        await result.wait();
        setIsLoading(false);

        setDisplayGiftConfirmation(true);
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setDisplayError(true);
    }
  };

  const getSeller = async (id) => {
    try {
      if (ethereum) {
        const contract = getArenaContract();

        const seller = await contract.getFighterSeller(id);

        return seller;
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setDisplayError(true);
    }
  };

  const getPrice = async (id) => {
    try {
      if (ethereum) {
        const contract = getArenaContract();

        const price = await contract.getFighterPrice(id);

        return price;
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setDisplayError(true);
    }
  };

  /* ----------------------------------------------------------------------------- */

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfFightersExist();
    getPredictionLoss();
  }, [fightersCount]);

  return (
    <BlockchainContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formDataFighter,
        createNewFighter,
        recruitPupil,
        fighters,
        myFighters,
        myWeapons,
        handleChangeFighter,
        isLoading,
        isContextLoading,
        attackFighter,
        displayAttackLogs,
        setDisplayAttackLogs,
        attackStats,
        youWon,
        displayError,
        setDisplayError,
        purchaseWeapon,
        computeWeaponPrice,
        showConfirmationDisplay,
        formDataPurchase,
        setFormDataPurchase,
        displayConfirmationModal,
        setDisplayConfirmationModal,
        displayReceipt,
        setDisplayReceipt,
        redeemSpendablePoints,
        putOnMarket,
        displaySpendingResult,
        setDisplaySpendingResult,
        buyFighter,
        setDisplayFighterBuyConfirmation,
        displayFighterBuyConfirmation,
        displayUpForSaleConfirmation,
        setDisplayUpForSaleConfirmation,
        giftFighter,
        displayGiftConfirmation,
        setDisplayGiftConfirmation,
        myPupils,
        showRecruitModal,
        setShowRecruitModal,
        getSeller,
        getPrice,
        getPredictedPrice,
        currentPredictionLoss,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
