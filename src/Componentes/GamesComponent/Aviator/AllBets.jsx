import React, { useEffect, useState } from "react";
import {
  AllBetsData,
  BetCashoutHistory,
} from "../../../assets/Data/AviatorData";

export function AllBets() {
  const [totalBets, setTotalBets] = useState(0);
  const [allBetsData, setAllBetsdata] = useState([]);
  const [rendomBetAmouts, setRandomBetAmounts] = useState([]);

  // Generate 25 random amounts---------------------------------
  useEffect(() => {
    const randomNumbers = [];
    for (let i = 0; i < 25; i++) {
      const randomNumber = Math.floor(Math.random() * (900 - 10 + 1)) + 10;
      randomNumbers.push(randomNumber);
    }
    setRandomBetAmounts(randomNumbers);
  }, []);

  // total bets-------------------------------------------------
  useEffect(() => {
    const total = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
    if (totalBets < total) {
      setTotalBets(total);
    }
  }, [totalBets]);

  useEffect(() => {
    const previousData = [...AllBetsData];
    const updatedData = previousData.map((item, index) => {
      return {
        ...item,
        betAmount: rendomBetAmouts[index] || item.betAmount,
      };
    });

    const sortedData = updatedData.sort((a, b) => b.betAmount - a.betAmount);
 
    setAllBetsdata(sortedData);
  }, [rendomBetAmouts]);

  return (
    <div className="mt-2">
      <p className="text-xs font-medium text-gray-200">
        Total Bets {totalBets}
      </p>
      <section className="  p-0.5 flex justify-between rounded-md px-1 mb-0.5">
        <div className="flex   gap-1">
          <p className="text-xs font-medium text-gray-400">User</p>
        </div>
        <div className="text-xs font-medium text-gray-400 flex justify-between gap-2">
          Bet INR
        </div>
        <div className="text-xs font-medium text-gray-400">Cashout INR</div>
      </section>
      {allBetsData.map((item, index) => (
        <section
          className={` p-0.5 flex justify-between items-center text-xs font-semibold rounded-md px-1 mb-0.5 ${
            item.isCashout
              ? "bg-[#123405] border border-green-500 text-gray-200"
              : "bg-[#101112] text-gray-400"
          }`}
        >
          <div className="flex   gap-1">
            <img
              src={require("../../../assets/photos/profile.png")}
              alt="profile"
              className="w-6"
            />
            <p className=" ">{item.userId}</p>
          </div>
          <div className="flex justify-between bg-red w-[30%]">
            {Number(item.betAmount * 10).toFixed(2)}
            {item.isCashout && (
              <p className="text-[#883cea] bg-[#091A03] px-1 rounded-md inline">
                {item.cashOut}
              </p>
            )}
          </div>
          <div className="  ">{Number(item.betAmount * 10 * item.cashOut).toFixed(2)}</div>
        </section>
      ))}
    </div>
  );
}

export function BetCashouts() {
  return (
    <div className=" flex flex-row gap-1 overflow-x-auto scrollbar-hide">
      {BetCashoutHistory.map((item, index) => (
        <div
          className="px-2 rounded-full text-xs text-[#2d97d6] font-semibold bg-gray-700"
          key={index}
        >
          {Number(item.target).toFixed(2)}x
        </div>
      ))}
    </div>
  );
}
