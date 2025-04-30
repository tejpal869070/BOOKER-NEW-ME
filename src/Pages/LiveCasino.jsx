import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import MinesGame from "../Componentes/Casino/MinesGame";
import WheelGame from "../Componentes/Casino/WheelGame";
import Limbo from "../Componentes/Casino/Limbo";
import DragonTower from "../Componentes/Casino/DragonTower";
import GameLoading from "../Componentes/GameLoading";
import CoinFlip from "../Componentes/Casino/CoinFlip";
import { getAllGames } from "../Controllers/User/GamesController";
import Match from "../Componentes/Casino/Match";
import MatchDashboard from "../Componentes/Casino/MatchDashboard";

export default function LiveCasino() {
  const location = useLocation();
  const [preload, setPreload] = useState(false);
  const [gameData, setGameData] = useState([]);
  const [gameComponent, setGameComponent] = useState(null);

  // get path and query to display content in inner section
  const paramsData = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    const data = {};
    for (const [key, value] of queryParams.entries()) {
      data[key] = value;
    }
    return data;
  }, [location.search]);

  // --------------------------
  useEffect(() => {
    const fatchGames = async () => {
      try {
        const response = await getAllGames();
        setGameData(response?.data);
      } catch (error) {
        window.alert("Somthing Went Wrong !");
      }
    };

    fatchGames();
  }, []);
  // --------------------------

  useEffect(() => {
    if (paramsData && paramsData.game) {
      setPreload(true);
      const timeoutId = setTimeout(() => {
        setPreload(false);
        const renderGameComponent = () => {
          if (
            paramsData?.game === "mines" &&
            gameData?.some((item) => item.game_name === "Mines")
          ) {
            setGameComponent(<MinesGame />);
          } else if (
            paramsData?.game === "wheel" &&
            gameData?.some((item) => item.game_name === "Wheel")
          ) {
            setGameComponent(<WheelGame />);
          } else if (
            paramsData?.game === "limbo" &&
            gameData?.some((item) => item.game_name === "Limbo")
          ) {
            setGameComponent(<Limbo />);
          } else if (
            paramsData?.game === "dragon-tower" &&
            gameData?.some((item) => item.game_name === "Dragon Tower")
          ) {
            setGameComponent(<DragonTower />);
          } else if (
            paramsData?.game === "coin-flip" &&
            gameData?.some((item) => item.game_name === "Coin Flip")
          ) {
            setGameComponent(<CoinFlip />);
          } else if (paramsData?.game === "match-lobby") {
            setGameComponent(<Match />);
          }else if (paramsData?.game === "match") {
            setGameComponent(<MatchDashboard />);
          } else {
            setGameComponent(<Maintainance />);
          }
        };
        renderGameComponent();
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [paramsData, gameData]);

  const Maintainance = () => {
    return (
      <div className=" w-[70vw] h-[60dvh] flex justify-center items-center">
        <img
          alt="amain"
          className="w-80"
          src={require("../assets/photos/under-maintenance.png")}
        />
      </div>
    );
  };

  return (
    <div>
      {preload ? (
        <div>
          <GameLoading />
        </div>
      ) : (
        gameComponent
      )}
    </div>
  );
}
