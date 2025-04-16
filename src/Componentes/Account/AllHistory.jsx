import React, { useState } from "react";
import AccountHistory from "./Accounthistory";
import DepositHistory from "../Money/MoneyIn/DepositHistory";
import WithdrawalHistory from "../Money/MoneyOut/WithdrawalHistory";
import TodayHistory from "./TodayHistory";
import GameWalletHistory from "./GameWalletHistory";
import RoiIncome from "../Income/RoiIncome";
import LevelIncome from "../Income/LevelIncome";
import ReferIncome from "../Income/ReferIncome";
import MatchingIncome from "../Income/MatchingIncome";
import InvestmentHistory from "../Investment/InvestmentHistory";

export default function AllHistory() {
  const [selected, setSelected] = useState(0);
  return (
    <div>
      <div className="flex  overflow-scroll gap-2 mt-4 justify-around w-full p-2 rounded-t-md bg-gradient-to-r from-purple-500 to-indigo-500">
        {links.map((item, index) => (
          <div
            className={`flex flex-col    flex-start items-center cursor-pointer  backdrop-blur-md bg-white/30    ${selected===index ? "border-2 border-gray-300 border-b-0 rounded-b-0 rounded-t" : "rounded"}`}
            onClick={() => setSelected(index)}
          >
            <img
              alt="icons"
              className="w-14 p-2 rounded-lg "
              src={item.icons}
            />
            <p className={`text-sm font-medium bg-black/30  px-2 py-0.5 w-full text-gray-200 mt-1 text-center whitespace-nowrap ${selected!==index && "rounded-b"} `} >
              {item.title}
            </p>
          </div>
        ))}
      </div>

      {/* <section className="flex overflow-scroll mt-4 gap-2 mb-2">
        {links.slice(0,4).map((item, index) => (
          <div
            key={index}
            title="tabs"
            onClick={() => setSelected(index)}
            className={`px-4 py-2  text-gray-200 whitespace-nowrap ${
              selected === index
                ? "bg-gradient-to-l from-orange-400 to-yellow-500 text-gray-800 font-semibold rounded-t-[10px]"
                : "border-[0.5px] rounded-t-[10px]"
            }`}
          >
            {item.title}
          </div>
        ))}
      </section>
      <section className="flex overflow-scroll mt-4 gap-2 mb-2">
        {links.slice(4,10).map((item, index) => (
          <div
            key={index}
            title="tabs"
            onClick={() => setSelected(index+4)}
            className={`px-4 py-2  text-gray-200 whitespace-nowrap ${
              selected === index+4
                ? "bg-gradient-to-l from-orange-400 to-yellow-500 text-gray-800 font-semibold rounded-t-[10px]"
                : "border-[0.5px] rounded-t-[10px]"
            }`}
          >
            {item.title}
          </div>
        ))}
      </section> */}

      <div className="border border-t-0 border-purple-500">
        {selected === 0 ? (
          <AccountHistory />
        ) : selected === 1 ? (
          <DepositHistory />
        ) : selected === 2 ? (
          <WithdrawalHistory />
        ) : selected === 3 ? (
          <TodayHistory />
        ) : selected === 4 ? (
          <GameWalletHistory />
        ) : selected === 5 ? (
          <RoiIncome />
        ) : selected === 6 ? (
          <LevelIncome />
        ) : selected === 7 ? (
          <ReferIncome />
        ) : selected === 8 ? (
          <MatchingIncome />
        ) : selected === 9 ? (
          <InvestmentHistory />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

const links = [
  {
    id: 1,
    title: "Account History",
    icons: require("../../assets/photos/financial-statement.png"),
  },
  {
    id: 2,
    title: "Deposit History",
    icons: require("../../assets/photos/save-money.png"),
  },
  {
    id: 3,
    title: "Withdrawal History",
    icons: require("../../assets/photos/withdraw.png"),
  },
  {
    id: 4,
    title: "Today Statement",
    icons: require("../../assets/photos/calendar.png"),
  },
  {
    id: 5,
    title: "Game Wallet",
    icons: require("../../assets/photos/joystick.png"),
  },
  {
    id: 5,
    title: "ROI Income",
    icons: require("../../assets/photos/salary.png"),
  },
  {
    id: 6,
    title: "Level Income",
    icons: require("../../assets/photos/mutual-fund.png"),
  },
  {
    id: 7,
    title: "Refer Income",
    icons: require("../../assets/photos/earnings.png"),
  },
  {
    id: 8,
    title: "Matching Income",
    icons: require("../../assets/photos/match.png"),
  },
  {
    id: 9,
    title: "Investment History",
    icons: require("../../assets/photos/earning.png"),
  },
];
