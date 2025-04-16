import React, { useEffect, useState } from "react";
import { ColorGameAllResult } from "../../Controllers/User/GamesController";
import swal from "sweetalert";
import { Loading1, Loading3 } from "../Loading1";

export default function ColorGameHistory({
  gameType,
  refreshHistory,
  isCountDown,
}) {
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const getGameHistory = async (gameType) => {
    try {
      const response = await ColorGameAllResult(gameType);
      if (response.status) {
        setGameHistory(response.data);
        setLoading(false);
      } else {
        window.location.reload();
      }
    } catch (error) {
      swal({
        title: "Error!",
        text: "Something Went Wrong",
        icon: "error",
        buttons: {
          confirm: "OK",
        },
        dangerMode: true,
      }).then((willRedirect) => {
        if (willRedirect) {
          window.location.reload();
        }
      });
    }
  };

  useEffect(() => {
    getGameHistory(gameType);
  }, [gameType, refreshHistory, isCountDown]);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
        <Loading3 />
      </div>
    );
  }

  return (
    <div>
      <div className="color-game-history">
        <button className="bg-[#ff9600]">Game History</button>
      </div>
      <div className="relative overflow-x-auto  z-0">
        <p className="font-semibold dark:text-gray-200">Game Records : </p>
        <div className="grid grid-cols-5 md:grid-cols-10   gap-4 mt-4">
          {gameHistory &&
            gameHistory.map((item, index) => (
              <div
                className="relative flex justify-center w-16 h-16"
                key={index}
              >
                <div
                  className="w-10 h-10 relative  text-white rounded-full flex items-center justify-center font-semibold text-lg"
                  style={{ backgroundColor: item.color_code.split(",")[0] }}
                >
                  <p className="z-[999]">{item.number}</p>
                </div>
                {item.number === "5" || item.number === "0" ? (
                  <div
                    className="absolute w-5 h-10 rounded-r-full right-3   "
                    style={{ backgroundColor: item.color_code.split(",")[1] }}
                  ></div>
                ) : (
                  ""
                )}
                <div className="absolute font-medium bottom-1 bg-gray-400 rounded-lg px-3 ">
                  {item.period.slice(-4)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
