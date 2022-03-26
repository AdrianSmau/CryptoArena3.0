import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  fighterFactoryABI,
  weaponFactoryABI,
  fighterFactoryAddress,
  weaponFactoryAddress,
} from "../utils/constants";

export const BlockchainContext = React.createContext();

const { ethereum } = window;

const getFighterFactoryContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    fighterFactoryAddress,
    fighterFactoryABI,
    signer
  );

  return contract;
};

const getWeaponFactoryContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    weaponFactoryAddress,
    weaponFactoryABI,
    signer
  );

  return contract;
};

export const BlockchainProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formDataFighter, setFormDataFighter] = useState({ fighterName: "" });
  const [formDataWeapon, setFormDataWeapon] = useState({
    level: "",
    type: "",
    tier: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fightersCount, setFightersCount] = useState(
    localStorage.getItem("fightersCount")
  );
  const [fighters, setFighters] = useState([]);

  const handleChangeFighter = (e, name) => {
    setFormDataFighter((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };

  const handleChangeWeapon = (e, name) => {
    setFormDataWeapon((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };

  const getAllFighters = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask!");
      const fighterContract = getFighterFactoryContract();
      const availableFighters = await fighterContract._getAllFighters();
      const formattedFighters = availableFighters.map((currentFighter) => ({
        name: currentFighter.fighter.name,
        level: currentFighter.fighter.level,
        timestamp: new Date(
          new Number(currentFighter.fighter.readyTime) * 1000
        ).toLocaleString(),
        fighterClass: currentFighter.fighter.class,
        winCount: currentFighter.fighter.winCount,
        lossCount: currentFighter.fighter.lossCount,
        owner: currentFighter.owner,
      }));

      setFighters(formattedFighters);
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask!");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllFighters();
      } else {
        console.log("No accounts found!");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  const checkIfTransactionsExist = async () => {
    try {
      const fighterContract = getFighterFactoryContract();
      const currentFightersCount = await fighterContract._getFightersCount();

      window.localStorage.setItem("fightersCount", currentFightersCount);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask!");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  {
    /* ----------------------------------------------------------------------------- */
  }

  const createAndGetFighters = async (fighterClass) => {
    try {
      if (!ethereum) return alert("Please install MetaMask!");
      const fighterName = formDataFighter.fighterName;
      const contract = getFighterFactoryContract();

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: fighterFactoryAddress,
            gas: "0x5208",
          },
        ],
      });

      const hash = await contract._createFighter(fighterName, fighterClass);

      setIsLoading(true);
      console.log(`Loading - ${hash.hash}`);
      await hash.wait();
      console.log(`Success - ${hash.hash}`);
      setIsLoading(false);

      const currentFightersCount = await contract._getFightersCount();

      setFightersCount(currentFightersCount.toNumber());
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  const createAndGetWeapons = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask!");
      const { level, type, tier } = formDataWeapon;
      const contract = getWeaponFactoryContract();

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: weaponFactoryAddress,
            gas: "0x5208",
          },
        ],
      });

      //TBA
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  {
    /* ----------------------------------------------------------------------------- */
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, [fightersCount]);

  return (
    <BlockchainContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formDataFighter,
        formDataWeapon,
        createAndGetFighters,
        createAndGetWeapons,
        handleChangeFighter,
        handleChangeWeapon,
        fighters,
        isLoading,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
