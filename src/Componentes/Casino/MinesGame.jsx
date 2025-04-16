import React from "react";
import { useState } from "react";
import ManualMode from "../GamesComponent/MinesGame/ManualMode";
import AutoMode from "../GamesComponent/MinesGame/AutoMode";
import GameHistory from "../GamesComponent/Limbo/GameHistory";
import bg1 from "../../assets/photos/game-bg-3.jpg"

export default function MinesGame() {
  const [selected, setSelected] = useState("Manual");
  const [isBetPlaced, setIsBetPlaced] = useState();
  const [isRecharged, setRecharged] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(false);

  const refreshHistoryFunction = () => {
    setRefreshHistory((pre) => !pre);
  };

  const handleClick = (type) => {
    setSelected(type);
  };

  const isBetPlacedFunction = (betPlaced) => {
    if (betPlaced) {
      setIsBetPlaced(true);
    } else {
      setIsBetPlaced(false);
    }
  };

  return (
    <div className="min-h-screen ">
      {/* {isFlashPopup && <FlashPopup handleClose={handleClose} />} */}
      <div className="flex flex-wrap-reverse m-auto  max-w-[421px] md:max-w-[500px] lg:max-w-5xl">
        <div className="w-[100%]  lg:w-[30%]  p-6 h-screen/2 bg-[#213743]">
          <div className="w-full flex space-x-2 bg-gray-800 rounded-full px-2 py-2">
            <button
              onClick={() => handleClick("Manual")}
              disabled={isBetPlaced}
              className={`relative w-1/2 px-6 py-2 rounded-full overflow-hidden  font-medium   transition-all  ${
                selected === "Manual"
                  ? "bg-blue-500 text-gray-100"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              <span
                className={`absolute rounded-lg inset-0 z-[-1] bg-blue-500 transition-all duration-300 ease-in-out 
            ${
              selected === 1 ? "transform scale-x-100" : "transform  scale-x-0"
            } origin-right`}
              />
              Manual
            </button>

            <button
              onClick={() => handleClick("Auto")}
              disabled={isBetPlaced}
              className={`relative w-1/2 px-6 py-2 rounded-full overflow-hidden  font-medium transition-all  ${
                selected === "Auto"
                  ? "bg-blue-500 text-gray-100"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              <span
                className={`absolute rounded-lg inset-0 z-[-1] bg-blue-500 transition-all duration-300 ease-in-out 
            ${
              selected === 2 ? "transform scale-x-100" : "transform scale-x-0"
            } origin-left`}
              />
              Auto
            </button>
          </div>

          {selected === "Manual" ? (
            <ManualMode
              isBetPlacedFunction={(isBetPlaced) =>
                isBetPlacedFunction(isBetPlaced)
              }
              isRecharged={isRecharged}
              refreshHistoryFunction={refreshHistoryFunction}
            />
          ) : (
            <AutoMode
              isBetPlacedFunction={(isBetPlaced) =>
                isBetPlacedFunction(isBetPlaced)
              }
              refreshHistoryFunction={refreshHistoryFunction}
            />
          )}
        </div>
        <div
          id="boxBoard"
          className=" relative w-[100%]  lg:w-[70%]  p-6 h-screen/2  bg-[#0f212e]" 
        ></div>
      </div>
      <div className="m-auto mt-6  max-w-[421px] md:max-w-[500px] lg:max-w-5xl">
        <GameHistory type={"mines"} refreshHistory={refreshHistory} />
      </div>
    </div>
  );
}
