import { useState } from "react";
import "./App.css";
import { Account, Contract, RpcProvider } from "starknet";
import { ABI } from "./assets/abi";
import { BigNumber } from "bignumber.js";
import { connect, disconnect } from "starknetkit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [address, setAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");

  import.meta.env.VITE_SOME_KE;

  const { VITE_SEPOLIA_URL, VITE_ACCOUNT_ADDRESS, VITE_PRIVATE_KEY } =
    import.meta.env;

  const CONTRACT_ADDRESS =
    "0x521323a2d9f8048e0b0a8e831bac74d1bea2887f542e933e81d47be57ad6010";

  const PROVIDER = new RpcProvider({
    nodeUrl: VITE_SEPOLIA_URL,
  });

  const connectWallet = async () => {
    if (address) {
      disconnect();
      setProvider(null);
      setAccount(null);
      setAddress(null);
      return;
    }

    const { wallet } = await connect({
      provider: PROVIDER,
    });
    console.log(wallet);

    if (wallet && wallet.isConnected) {
      setProvider(wallet.provider);
      setAccount(wallet.account);
      setAddress(wallet.selectedAddress);
    }
  };

  const get_balance = async () => {
    if (provider) {
      const contract = new Contract(ABI, CONTRACT_ADDRESS, provider);

      contract
        .get_balance()
        .then((bal) => {
          const newBal = new BigNumber(bal).toString();
          console.log("Balance is: ", newBal);
          setBalance(newBal);
        })
        .catch((err) => {
          toast.error("Error: ", err);
          console.log(err);
        });
    }
  };

  const increase_balance = async (balToAdd) => {
    if (account) {
      // const ACCOUNT = new Account(
      //   PROVIDER,
      //   VITE_ACCOUNT_ADDRESS,
      //   VITE_PRIVATE_KEY
      // );
      const contract = new Contract(ABI, CONTRACT_ADDRESS, account);

      const res = await contract.increase_balance(balToAdd);

      const txHash = res?.transaction_hash;

      const txResult = await provider.waitForTransaction(txHash);

      console.log("Tx Result: ", txResult);
      const events = contract.parseEvents(txResult);

      const newBalance =
        events[0]["simple_starknet::HelloStarknet::IncreaseBalanceEvent"]
          .new_balance;
      toast.success(`${BigNumber(newBalance).toString()} added successfully`);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    increase_balance(inputValue); // Call increase_balance with the current input value
    setInputValue(""); // Reset the input field after submission
  };

  return (
    <>
      <header className="header">
        <button onClick={connectWallet} className="connect-btn">
          {address ? `${address.substring(0, 10)}...` : "Connect Wallet"}
        </button>
      </header>

      <div className="container">
        <h1 className="title">Simple DApp</h1>

        <div className="card">
          <div>
            <form onSubmit={handleSubmit} className="form">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="input-field"
                placeholder="Enter amount"
                required
              />{" "}
              <button type="submit" className="submit-btn">
                Increase Balance
              </button>
            </form>
          </div>

          <div className="separator"></div>

          <div>
            <button onClick={get_balance} className="get-balance-btn">
              Get Balance
            </button>

            <h2 className="balance-text">{`Balance: ${
              balance ? balance : " "
            }`}</h2>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
