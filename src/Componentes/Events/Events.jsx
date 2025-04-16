import React, { useState } from "react";
import TodayUpcoming from "./CustomTab/TodayUpcoming";
import ballimg from "../../assets/photos/ball4.png";
import ballimg2 from "../../assets/photos/ball3.jpg";
import footballimg from "../../assets/photos/football.webp";
import groundimg from "../../assets/photos/ground.webp";

export default function Events({ gameType }) {
  const [selectedButton, setSelectedButton] = useState(1);

  const buttons = [
    { text: "INPLAY", value: 1 },
    { text: "UPCOMING", value: 2 },
  ];

  return (
    <div className="relative ">
      <p className="uppercase font-bold dark:text-white">
        <img
          alt="imageer"
          src={
            gameType === "cricket"
              ? ballimg
              : gameType === "football"
              ? footballimg
              : gameType === "tennis"
              ? ballimg2
              : ""
          }
          className="w-8 h-8"
        />
        {gameType}
      </p>
      <div className="  flex gap-4 mt-6 mb-8">
        {buttons.map((item, index) => (
          <button
            className="relative"
            onClick={() => setSelectedButton(item.value)}
            key={index}
          >
            <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
            <span
              className={`${
                selectedButton === index + 1 ? "bg-yellow-400" : "bg-white"
              } fold-bold relative inline-block h-full w-full rounded border-2 border-black  px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900`}
            >
              {item.text}
            </span>
          </button>
        ))}
      </div>
      <div>
        {selectedButton === 1 ? (
          <TodayUpcoming type="inplay" gameType={gameType} />
        ) : selectedButton === 2 ? (
          <TodayUpcoming type="incoming" gameType={gameType} />
        ) : (
          ""
        )}
      </div>


      <div
          className="absolute w-full h-full top-0 bg-black bg-cover bg-center flex inset-0 justify-center align-center items-center bg-no-repeat"
          style={{ backgroundImage: `url(${groundimg})` }}
        >
          <p
            className="text-6xl text-center font-bold  "
            style={{ textShadow: "3px 2px 19px white" }}
          >
            Coming Soon
          </p>
        </div>
    </div>
  );
}
