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
              gas: "0x7B0C",
            },
          ],
        });

        const hash = await contract._createFirstFighter(
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

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: address,
              gas: "0x7B0C",
            },
          ],
        });

        setAttackStats([]);
        setYouWon(false);

        const targetWeapons = await contract._getWeaponByFighterId(
          targetFighterId
        );

        var hasTargetWeapon = false;
        var chosenWeaponId = -1;
        var bestDamage = 15;
        const targetFighter = fighters[targetFighterId];
        targetWeapons
          .filter((weapon) => weapon.weapon.levelReq <= targetFighter.level)
          .forEach((weapon) => {
            if (weapon.weapon.weapType === 0) {
              if (weapon.weapon.skillReq <= targetFighter.agility) {
                if (targetFighter.fighterClass === 1) {
                  if (weapon.weapon.damage * 2 > bestDamage) {
                    if (!hasTargetWeapon) {
                      hasTargetWeapon = true;
                    }
                    bestDamage = weapon.weapon.damage * 2;
                    chosenWeaponId = weapon.id;
                  }
                } else {
                  if (weapon.weapon.damage > bestDamage) {
                    if (!hasTargetWeapon) {
                      hasTargetWeapon = true;
                    }
                    bestDamage = weapon.weapon.damage;
                    chosenWeaponId = weapon.id;
                  }
                }
              }
            } else {
              if (weapon.weapon.skillReq <= targetFighter.strength) {
                if (targetFighter.fighterClass === 0) {
                  if (weapon.weapon.damage * 2 > bestDamage) {
                    if (!hasTargetWeapon) {
                      hasTargetWeapon = true;
                    }
                    bestDamage = weapon.weapon.damage * 2;
                    chosenWeaponId = weapon.id;
                  }
                } else {
                  if (weapon.weapon.damage > bestDamage) {
                    if (!hasTargetWeapon) {
                      hasTargetWeapon = true;
                    }
                    bestDamage = weapon.weapon.damage;
                    chosenWeaponId = weapon.id;
                  }
                }
              }
            }
          });

        if (chosenWeaponId === -1) {
          chosenWeaponId = 0;
          console.log(
            `For enemy fighter, no weapon was chosen, target damage is ${bestDamage}`
          );
        } else {
          console.log(
            `For enemy fighter, weapon ${chosenWeaponId} was chosen, target damage is ${bestDamage}`
          );
        }

        const result = await contract.attack(
          myFighterId,
          doIHaveWeapon,
          myWeaponId,
          targetFighterId,
          hasTargetWeapon,
          chosenWeaponId,
          {
            gasLimit: `0x${(
              210000 +
              5000 *
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
        displayAttackLogs,
        setDisplayAttackLogs,
        attackStats,
        youWon,
        displayError,
        setDisplayError,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
