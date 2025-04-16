import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import ManualMode from "../GamesComponent/WheelGame/ManualMode";
import AutoMode from "../GamesComponent/WheelGame/AutoMode";
import GameHistory from "../GamesComponent/Limbo/GameHistory";

const WheelGame = () => {
  const [selected, setSelected] = useState("Manual");
  const [refreshHistory, setRefreshHistory] = useState(false);

  const refreshHistoryFunction = () => {
    setRefreshHistory((pre) => !pre);
  };

  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const gameType = queryParams.get("gameType");

    if (gameType) {
      setSelected(gameType);
    }
  }, [location.search]);

  return (
    <div>
      <div className=" ">
        {selected === "Auto" ? (
          <AutoMode refreshHistoryFunction={refreshHistoryFunction} />
        ) : (
          <ManualMode refreshHistoryFunction={refreshHistoryFunction}/>
        )}
      </div>
      <div className="m-auto mt-6  max-w-[421px] md:max-w-[500px] lg:max-w-5xl">
        <GameHistory type={"wheel"} refreshHistory={refreshHistory} />{" "}
      </div>
    </div>
  );
};

export default WheelGame;
