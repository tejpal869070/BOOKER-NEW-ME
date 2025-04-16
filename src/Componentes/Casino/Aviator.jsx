import React from "react";
import { AllBets, BetCashouts } from "../GamesComponent/Aviator/AllBets";
import AviatorPlain from "../GamesComponent/Aviator/AviatorPlain";

export default function Aviator() {
  return (
    <div className="m-auto  ">
      <div className="flex flex-wrap-reverse bg-[#0e0e0e] rounded-md p-2">
        <div className="w-[100%]  xl:w-[30%] bg-[#1b1c1d] rounded-md h-screen p-2 max-h-screen overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 bg-[#141516] rounded-xl p-0.5 inline">
            {tabSection1.map((item, index) => (
              <div
                className="rounded-xl cursor-pointer px-6 py-0.5 bg-[#2c2d30] text-xs font-smeibold text-gray-200"
                key={index}
              >
                {item.name}
              </div>
            ))}
          </div>

          {/* all bets */}
          <AllBets />
        </div>
        <div className="max-w-[100%] p-2 xl:max-w-[70%] bg-[#0e0e0e]   overflow-x-auto scrollbar-hide max-h-screen">
          {/* bet cashout history */}
          <BetCashouts />
          <AviatorPlain />
        </div>
      </div>
    </div> 
  );
} 

const tabSection1 = [
  { id: 1, name: "All Bets" },
  { id: 2, name: "My Bets" },
];
