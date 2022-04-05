import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { arenaABI, address } from "../utils/constants";

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

  const [fighters, setFighters] = useState([]);
  const [myFighters, setMyFighters] = useState([]);
  const [fightersCount, setFightersCount] = useState(
    localStorage.getItem("fightersCount")
  );

  const [attackLogs, setAttackLogs] = useState(
    localStorage.getItem("attackLogs")
  );

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
          level: currentFighter.fighter.level,
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
        setFighters(formattedFighters);
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
        setMyFighters(formattedFighters);
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

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: address,
              gas: "A410",
            },
          ],
        });

        const hash = await contract._createFirstFighter(
          fighterName,
          fighterClass
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
        var currentAttackLogs = [];
        var doIHaveWeapon = true;
        const contract = getArenaContract();

        contract.on(
          "ArenaEvent",
          (attackerId, targetId, damage, wasCritical) => {
            if (damage == 0) {
              currentAttackLogs.push(
                `Fighter ${fighters[targetId].name} dodged ${fighters[attackerId].name}'s attack!`
              );
            } else {
              if (wasCritical) {
                currentAttackLogs.push(
                  `Fighter ${fighters[attackerId].name} dealt a critical hit on ${fighters[targetId].name} for ${damage} damage!`
                );
              } else {
                currentAttackLogs.push(
                  `Fighter ${fighters[attackerId].name} hit ${fighters[targetId].name} for ${damage} damage!`
                );
              }
            }
          }
        );

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: address,
              gas: "11940",
            },
          ],
        });

        if (myWeaponId == -1) {
          doIHaveWeapon = false;
          myWeaponId = 0;
        }

        const hash = await contract.attack(
          myFighterId,
          doIHaveWeapon,
          myWeaponId,
          targetFighterId
        );

        setIsLoading(true);
        await hash.wait();
        setIsLoading(false);

        setAttackLogs(currentAttackLogs);
        console.log(currentAttackLogs);
        window.location.replace("http://localhost:3000/arena");
      } else {
        console.log("Ethereum is not present!");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  /* ----------------------------------------------------------------------------- */

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfFightersExist();
  }, [fightersCount]);

  return (
    <BlockchainContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formDataFighter,
        createNewFighter,
        fighters,
        myFighters,
        handleChangeFighter,
        isLoading,
        isContextLoading,
        attackFighter,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
