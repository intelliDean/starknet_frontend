import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Account, Contract, RpcProvider } from "starknet";
import { ABI } from "./assets/abi";
import { BigNumber } from "bignumber.js";
require("dotenv").config();
import { connect, disconnect } from "starknetkit";

function App() {
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [address, setAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const { SEPOLIA_URL, ACCOUNT_ADDRESS, PRIVATE_KEY } = process.env;

  // const CONTRACT_ADDRESS =
  //   "0x1640d05ae55d102d69ba4b3df9bf37dc922fbe052370cd2c09cda648680edec";
  // const ACCOUNT_ADDRESS =
  //   "0x30af85ba62c6c82af49fa10c24508b07d6a6530968127f0a06ea85676440f91";
  // const PRIVATE_KEY = "0xc6cbb21fe055f0fff4f7fa1b801427b5";

  const PROVIDER = new RpcProvider({ nodeUrl: SEPOLIA_URL });

  const connectWallet = async () => {
    const { wallet } = await connect();

    if (wallet && wallet.isConnected) {
      setProvider(wallet.account.provider);
      setAccount(wallet.account);
      setAddress(wallet.selectedAddress);
    }
  };

  const get_balance = async () => {
    const contract = new Contract(ABI, CONTRACT_ADDRESS, PROVIDER);

    contract
      .get_balance()
      .then((bal) => {
        const newBal = new BigNumber(bal).toString();
        console.log("Balance is: ", newBal);
        setBalance(newBal);
      })
      .catch((err) => {
        console.log(err);
      });
    // console.log(await contract.get_balance());
  };

  const increase_balance = async (balToAdd) => {
    const ACCOUNT = new Account(PROVIDER, ACCOUNT_ADDRESS, PRIVATE_KEY);
    const contract = new Contract(ABI, CONTRACT_ADDRESS, ACCOUNT);

    contract
      .increase_balance(balToAdd.toString())
      .then((res) => {
        console.log("Waiting for: ", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    increase_balance(inputValue); // Call increase_balance with the current input value
    setInputValue(""); // Reset the input field after submission
  };

  return (
    <>
      <div>
        <h1>DApp to increase and get balance</h1>
      </div>
      <div className="card">
        <div>
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
          />{" "}
          <br></br>
          <button type="submit">Increase Balance</button>
        </form>
      </div>
      <h3>{`Current balance is ${balance ? balance : 0}`}</h3>
      <div>
        <button onClick={get_balance}>Get Balance</button>
      </div>
    </>
  );
}

export default App;
