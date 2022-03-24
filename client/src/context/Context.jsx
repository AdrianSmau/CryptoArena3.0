import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

export const BlockchainContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  return contract;
};

export const BlockchainProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({ fighterName: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask!");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        //getAllTransactions();
      } else {
        console.log("No accounts found!");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
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

  const createFighter = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask!");
      const { fighterName } = formData;
      const contract = getEthereumContract();

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: contractAddress,
            gas: "0x5208",
          },
        ],
      });

      const hash = await contract._createFighter(fighterName);

      setIsLoading(true);
      console.log(`Loading - ${hash.hash}`);
      await hash.wait();
      setIsLoading(false);
      console.log(`Success - ${hash.hash}`);

      const myFighters = await contract._getMyFighters();

      console.log(myFighters);
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object!");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <BlockchainContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        createFighter,
        handleChange,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
