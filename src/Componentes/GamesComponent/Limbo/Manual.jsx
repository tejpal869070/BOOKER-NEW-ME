import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import HistoryTop from "./HistoryTop";
import CountUp from "react-countup";
 import { ToastContainer, toast } from "react-toastify";import 'react-toastify/dist/ReactToastify.css';

export default function Manual() {
  const [amount, setAmount] = useState(100);
  const [totlaBalance, setTotalBalance] = useState();
  const [randomNumber, setRandomNumber] = useState();
  const [history, setHistory] = useState([]);
  const [target, setTarget] = useState(1.01);
  const [winChance, setWinChance] = useState();

  const doubleTheAmount = () => {
    if (amountRef.current * 2 > totlaBalance) {
      setAmount(totlaBalance);
    } else {
      setAmount((pre) => pre * 2);
    }
  };

  const amountRef = useRef(amount);
  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  const handleBetPlace = () => {
    if (amount < 1) {
      toast.error("Min. amount is $1", {
        position: "top-center",
      });
      return;
    } else if (target < 1.01) {
      toast.error("Target should be greater than 1.01", {
        position: "top-center",
      });
      return;
    }
    setRandomNumber(1);
    const randomNumber = (Math.random() * 99 + 1).toFixed(2);
    setRandomNumber(parseFloat(randomNumber));
    setHistory((prevData) => [...prevData, randomNumber]);
  };

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
  };

  

  // useEffect(() => {
  //   const element = document.getElementById("limboBoard");
  //   if (element) {
  //     ReactDOM.createRoot(element).render(
  //       <div className="min-h-[60vh] relative">
  //         <HistoryTop history={history} />
  //         <div className="mt-20  flex justify-center  items-center w-full h-full">
  //           <p className="text-8xl text-center font-semibold text-[#00e701]">
  //             {/* {randomNumber.toFixed(2)}x */}
  //             <CountUp end={randomNumber} decimals={2} duration={1} />x
  //           </p>
  //         </div>
  //         <div className="absolute bottom-0 flex justify-between items-center w-full bg-gray-700 rounded p-2 ">
  //           <div className="w-[50%]">
  //             <p className="text-sm text-gray-300 mb-1 font-medium">
  //               Target Multipiler
  //             </p>
  //             <input
  //               value={target}
  //               onChange={(e) => setTarget(e.target.value)}
  //               className="w-[95%] pl-2 text-gray-200 text-sm py-1 bg-gray-900 border-gray-500 border-2 rounded outline-none focus:border-0"
  //             />
  //           </div>
  //           <div className="w-[50%]">
  //             <p className="text-sm text-gray-300 mb-1 font-medium">
  //               Win Chance
  //             </p>
  //             <input
  //               value={winChance}
  //               onChange={(e) => setWinChance(e.target.value)}
  //               className="w-[95%] pl-2 text-gray-200 text-sm py-1 bg-gray-900 border-gray-500 border-2 rounded outline-none focus:border-0"
  //             />
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }
  // }, [randomNumber, history]);

  return (
    <div>
      <ToastContainer />
      <div>
        <div className="flex justify-between dark:text-gray-200">
          <p className="lg:text-sm font-medium">Bet Amount</p>
          <p>${amount}</p>
        </div>
        <div className="flex relative items-center">
          <input
            className="w-full rounded border px-2 py-1  outline-none font-semibold text-lg"
            placeholder="Enter Amount "
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="absolute right-0.5 ">
            <button
              onClick={() => {
                if (amount > 1) {
                  setAmount((pre) => pre / 2);
                } else {
                  setAmount(1);
                }
              }}
              className="px-1.5  py-2 bg-gray-500 text-gray-200   text-sm  font-medium  "
            >
              1/2
            </button>
            <button
              onClick={() => doubleTheAmount()}
              className="px-1.5  py-2 bg-gray-500 text-gray-200 border-l-2 text-sm cursor-pointer  font-medium border-gray-200"
            >
              2x
            </button>
          </div>
        </div>
        <p className="mt-3 lg:mt-2 lg:text-sm dark:text-gray-200 font-medium">
          Profit On Win
        </p>
        <input
          className="w-full rounded border px-2 py-1  outline-none font-semibold text-lg"
          placeholder="Enter Amount "
          // value={amount}
          // onChange={(e) => setAmount(e.target.value)}
        />
        <button
          // disabled={isBetPlaced || openedMines.length > 0}
          onClick={() => handleBetPlace()}
          className="w-full rounded bg-[#20e701] font-semibold text-lg text-gray-700 py-2 mt-3"
        >
          Place Bet
        </button>
      </div>
    </div>
  );
}
