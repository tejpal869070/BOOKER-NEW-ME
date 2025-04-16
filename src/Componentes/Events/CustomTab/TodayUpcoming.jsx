import React, { useEffect, useState } from "react";
import MatchTable from "./MatchTable";
import {
  CricketData,
  FootballData,
  TennisData,
} from "../../../assets/Data/GamesData";

export default function TodayUpcoming({ type, gameType }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getGameData = async () => {
      if (gameType === "cricket") {
        if (type === "inplay") {
          setData(CricketData.filter((item) => item.type === "inplay"));
        } else {
          setData(CricketData.filter((item) => item.type !== "inplay"));
        }
      } else if (gameType === "football") {
        if (type === "inplay") {
          setData(FootballData.filter((item) => item.type === "inplay"));
        } else {
          setData(FootballData.filter((item) => item.type !== "inplay"));
        }
      } else if (gameType === "tennis") {
        if (type === "inplay") {
          setData(TennisData.filter((item) => item.type === "inplay"));
        } else {
          setData(TennisData.filter((item) => item.type !== "inplay"));
        }
      }
    };

    getGameData();
  }, [type, gameType]);

  return (
    <div className=" bg-[#ffce9e] py-2 rounded-lg">
      <MatchTable data={data} />
    </div>
  );
}

// if (type === "inplay") {
// setData(CricketData.filter((item) => item.type === "inplay"));
// } else {
// setData(CricketData.filter((item) => item.type !== "inplay"));
// }
