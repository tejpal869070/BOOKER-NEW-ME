import React, { useEffect, useState } from "react";
import ballimg from "../../../assets/photos/ball4.png";
import ballimg2 from "../../../assets/photos/ball3.jpg";
import footballimg from "../../../assets/photos/football.webp";
import {
  CricketData,
  FootballData,
  TennisData,
} from "../../../assets/Data/GamesData";
import MatchTable from "./MatchTable";

export default function InplayCustom({ type }) { 
  const [cricketData, setCricketData] = useState([]);
  const [footballData, setFootballData] = useState([]);
  const [tennisData, setTennisData] = useState([]);

  const gameTypeData = [
    { name: "CRICKET", img: ballimg },
    { name: "FOOTBALL", img: footballimg },
    { name: "TENNIS", img: ballimg2 },
  ];

  useEffect(() => {
    const getData = () => {
      setCricketData(
        CricketData.filter((item) => item.type === type.toString())
      );
      setFootballData(
        FootballData.filter((item) => item.type === type.toString())
      );
      setTennisData(TennisData.filter((item) => item.type === type.toString()));
    };
    getData();
  }, [type]);

  return (
    <div>
      <div className="flex flex-col gap-8">
        {gameTypeData.map((item, index) => (
          <div key={index} className=" bg-[#ffce9e] py-2 rounded-lg ">
            <p className="flex gap-2 pl-4 font-bold items-center border-b-2 border-gray pb-2">
              <img alt="imageer" src={item.img} className="w-6 h-6" />
              {item.name}
            </p>
            {item.name === "CRICKET" ? (
              <MatchTable data={cricketData} />
            ) : item.name === "FOOTBALL" ? (
              <MatchTable data={footballData} />
            ) : item.name === "TENNIS" ? (
              <MatchTable data={tennisData} />
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
