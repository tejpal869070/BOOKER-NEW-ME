import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
// import Board from "../GamesComponent/Limbo/Board";
import { toast, ToastContainer } from "react-toastify";
import CountUp from "react-countup";
import HistoryTop from "../GamesComponent/Limbo/HistoryTop";
import { GetUserDetails } from "../../Controllers/User/UserController";
import { MinesGameUpdateWallet } from "../../Controllers/User/GamesController";
import GameHistory from "../GamesComponent/Limbo/GameHistory";
import { AiOutlineAreaChart } from "react-icons/ai";
import Graph from "../GamesComponent/MinesGame/Graph";
import bg1 from "../../assets/photos/game-bg-1.png";

export default function Limbo() {
  const [selected, setSelected] = useState("Manual");
  const [amount, setAmount] = useState(1);
  const [totlaBalance, setTotalBalance] = useState();
  const [randomNumber, setRandomNumber] = useState();
  const [target, setTarget] = useState(1.01);
  const [history, setHistory] = useState([]);
  const [winChance, setWinChance] = useState();
  const [isAutoBetStart, setAutoBetStart] = useState(false);
  const [isManualBetStart, setManualBetStart] = useState(false);
  const [stopLoss, setStopLoss] = useState(0);
  const [stopProfit, setStopProfit] = useState(0);
  const [increaseOnWin, setIncreaseOnWin] = useState(0);
  const [increaseOnLoss, setIncreaseOnLoss] = useState(0);
  const [totalBets, setTotalBets] = useState(0);
  const [user, setUser] = useState();
  const [isWin, setWin] = useState();
  const [playedGames, setPlayedGames] = useState(0);
  const [gameToWin, setGameToWin] = useState(0);
  const intervalId = useRef(null);
  const [refreshHistory, setRefreshHistory] = useState(false);
  const autoBetRef = useRef(null);
  const totalBalanceRef = useRef(totlaBalance);
  const playedGamesRef = useRef(playedGames);
  const [startingBalance, setStartingBalance] = useState(totlaBalance);
  const [isGraph, setIsGraph] = useState(false);

  // graph datat
  const [wageredAmount, setWegeredAmount] = useState(0);
  const [graphProfit, setGraphProfit] = useState(0);
  const [totalWin, setTotalWin] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);

  const handleClick = (type) => {
    setSelected(type);
    setPlayedGames(0);
  };

  const doubleTheAmount = () => {
    if (amountRef.current * 2 > totlaBalance) {
      setAmount(totlaBalance);
    } else {
      setAmount((pre) => pre * 2);
    }
  };

  const handleBetPlace = async () => {
    if (selected === "Manual") {
      await betFunction();
    } else {
      if (totalBalanceRef.current < amount) {
        toast.warn("Inufficient balance");
      } else if (stopLoss > 0 && stopLoss < amountRef.current) {
        toast.error(
          "The stop-loss target cannot be lower than the current bet amount."
        );
      } else {
        autoBetFunction();
      }
    }
  };

  const autoBetFunction = async () => {
    await betFunction();
    autoBetRef.current = setInterval(async () => {
      await betFunction();
    }, 2500);
  };
  // clearInterval(autoBetRef.current);

  const stopAutoBet = () => {
    setAutoBetStart(false);
    setPlayedGames(0);
    clearInterval(autoBetRef.current);
    setStartingBalance(totalBalanceRef.current);
  };

  const betFunction = async () => {
    const currentBalance = totalBalanceRef.current;
    if (selected === "Manual") {
      mainBetFunction();
    } else {
      if (totalBets === 0 || totalBets === undefined) {
        mainBetFunction();
      } else {
        if (Number(totalBets) === Number(playedGamesRef.current)) {
          stopAutoBet();
        } else if (
          currentBalance >= Number(startingBalance) + Number(stopProfit) &&
          Number(stopProfit) > 0
        ) {
          stopAutoBet();
        } else if (
          currentBalance <= Number(startingBalance) - Number(stopLoss) &&
          Number(stopLoss) > 0
        ) {
          stopAutoBet();
        } else {
          mainBetFunction();
        }
      }
    }
  };

  const mainBetFunction = async () => {
    if (amount < 1 || target < 1.01) {
      toast.error("Min. amount is $1 & target is 1.01", {
        position: "top-center",
      });
      stopAutoBet();
      return;
    } else if (amount > totlaBalance) {
      toast.warn(
        <div className="flex justify-center items-center py-4 flex-col gap-2">
          <p>Insufficient Balance</p>
          <button
            className="px-2 py-1 rounded-md bg-black text-gray-200"
            onClick={() => {
              const rechargeId = document.getElementById("recharge-button");
              if (rechargeId) {
                rechargeId.click();
              }
            }}
          >
            Recharge Game Wallet
          </button>
        </div>,
        {
          position: "top-center",
        }
      );
      stopAutoBet();
      return;
    }
    if (selected === "Auto") {
      setAutoBetStart(true);
    }
    setWegeredAmount((pre) => pre + amountRef.current);
    setPlayedGames((pre) => pre + 1);
    setManualBetStart(true);
    await updateWalletBalance("deduct", amountRef.current);
    toast.success("Bet Placed. Game start", { position: "top-center" });
    setRandomNumber(1);
    if (playedGames >= gameToWin) {
      const randomNumber = (
        Math.random() * Number(target) +
        Number(target)
      ).toFixed(2);
      setRandomNumber(parseFloat(randomNumber));
      setHistory((prevData) => [...prevData, { target, randomNumber }]);
      if (selected === "Manual") {
        setPlayedGames(0);
      }
      updateBalanceShow(randomNumber);
      generateGameToWin();
    } else {
      const randomNumber = 1 + Math.random() * (target - 1);
      setRandomNumber(parseFloat(randomNumber.toFixed(2)));
      setHistory((prevData) => [...prevData, { target, randomNumber }]);
      updateBalanceShow(randomNumber);
    }
    setTimeout(() => {
      setManualBetStart(false);
    }, 1000);
  };

  const updateBalanceShow = async (randomNumber) => {
    if (Number(randomNumber).toFixed(2) >= Number(target).toFixed(2)) {
      await updateWalletBalance("add", amountRef.current * target);
      setTotalWin((pre) => pre + 1);
      setGraphProfit((pre) => pre + amount * target - amount);
      setWin(true);
      if (increaseOnWin > 0) {
        setAmount((pre) => pre + (pre * Number(increaseOnWin)) / 100);
      }
    } else {
      setWin(false);
      setGraphProfit((pre) => pre - amount);
      setTotalLoss((pre) => pre + 1);
      if (increaseOnLoss > 0) {
        setAmount((pre) => pre + (pre * Number(increaseOnLoss)) / 100);
      }
    }
    refreshHistoryFunction();
  };

  const refreshHistoryFunction = () => {
    setRefreshHistory((pre) => !pre);
  };

  // update wallet balance online---------------------------------------------
  const formData = {};
  const updateWalletBalance = async (type, amount) => {
    formData.type = type;
    formData.amount = amount;
    formData.game_type = "Limbo";
    formData.uid = user?.uid;
    formData.details = { limboTarget: target };

    try {
      const response = await MinesGameUpdateWallet(formData);
      if (response && response.status) {
      }
    } catch (error) {
      if (error?.response?.status === 302) {
        toast.error(error.response.data.message, {
          position: "top-center",
        });
        stopAutoBet();
      } else {
        toast.error("Server Error");
        stopAutoBet();
      }
    } finally {
      userDataGet();
    }
  };

  const amountRef = useRef(amount);
  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setTotalBalance(Number(response[0].color_wallet_balnace));
      setUser(response[0]);
      const newBalance = Number(response[0].color_wallet_balnace);
      setStartingBalance(newBalance);
    } else {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    userDataGet();
  }, []);

  const generateGameToWin = useCallback(() => {
    const gameToWin = Math.floor(Math.random() * Number(target));
    setGameToWin(gameToWin);
  }, [target]);

  useEffect(() => {
    setPlayedGames(0);
    setTotalBets(0);
    setStopLoss(0);
    setStopProfit(0);
    setIncreaseOnLoss(0);
    setIncreaseOnWin(0);
    setAmount(1);
  }, [selected]);

  useEffect(() => {
    generateGameToWin();
  }, [generateGameToWin, target]);

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  useEffect(() => {
    totalBalanceRef.current = totlaBalance;
  }, [totlaBalance]);

  useEffect(() => {
    playedGamesRef.current = playedGames;
  }, [playedGames]);

  useEffect(() => {
    const chance = (1 / target) * 100;
    setWinChance(chance);
  }, [target]);

  useEffect(() => {
    return () => {
      clearInterval(autoBetRef.current); // Clear the interval on unmount
    };
  }, []);

  return (
    <div className="min-h-screen ">
      <ToastContainer />
      {/* {isFlashPopup && <FlashPopup handleClose={handleClose} />} */}
      <div className="flex flex-wrap-reverse m-auto rounded-lg overflow-hidden  max-w-[421px] md:max-w-[500px] lg:max-w-5xl">
        <div className="w-[100%]  lg:w-[30%]  p-6 h-screen/2 bg-[#213743]">
          {/* <div className="w-full flex space-x-2 bg-gray-800 rounded-full px-2 py-2">
            <button
              onClick={() => handleClick("Manual")}
              disabled={isAutoBetStart || isManualBetStart}
              className={`relative w-full px-6 py-2 rounded-full overflow-hidden  font-medium   transition-all  ${
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
              disabled={isAutoBetStart || isManualBetStart}
              disabled
              className={` cursor-not-allowed relative w-1/2 px-6 py-2 rounded-full overflow-hidden  font-medium transition-all  ${
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
          </div> */}

          {selected === "Manual" ? (
            <div>
              <div className="flex justify-between dark:text-gray-200">
                <p className="lg:text-sm font-medium">Bet Amount</p>
                <p>${Number(totlaBalance).toFixed(2)}</p>
              </div>
              <div className="flex relative items-center">
                <input
                  className="w-full rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
                  placeholder="Enter Amount"
                  value={amount}
                  disabled={isManualBetStart}
                  type="tel"
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="absolute right-0.5 ">
                  <button
                    onClick={() => {
                      if (amount > 1) {
                        setAmount((pre) => pre / 2);
                      } else {
                        setAmount(1);
                      }
                    }}
                    className="px-1.5  py-2 bg-[#2f4553] text-gray-200   text-xs  font-medium border-r-2"
                  >
                    1/2
                  </button>
                  <buton
                    onClick={() => doubleTheAmount()}
                    className="px-1.5  py-2 bg-[#2f4553] text-gray-200   text-xs  font-medium"
                  >
                    2x
                  </buton>
                </div>
              </div>
              <p className="mt-3 lg:mt-2 lg:text-sm dark:text-gray-200 font-medium">
                Profit On Win
              </p>
              <input
                className="w-full rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
                placeholder="Enter Amount "
                disabled
                value={(amount * target - amount).toFixed(2)}
              />
              <button
                onClick={() => handleBetPlace()}
                disabled={isManualBetStart}
                className="w-full rounded bg-[#20e701] font-semibold py-2 text-sm mt-3"
              >
                Place Bet
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between dark:text-gray-200">
                <p className="lg:text-sm font-medium">Bet Amount</p>
                <p>${Number(totlaBalance).toFixed(2)}</p>
              </div>
              <div className="flex relative items-center">
                <input
                  className="w-full rounded border px-2 py-1 outline-none font-semibold text-lg bg-[#0F212E] text-[#f7efe8]"
                  placeholder="Enter Amount "
                  value={isAutoBetStart ? Number(amount).toFixed(2) : amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  disabled={isAutoBetStart}
                  type="tel"
                />
                <div className="absolute right-0.5   ">
                  <button
                    onClick={() => setAmount((pre) => pre / 2)}
                    className="px-1.5  py-1.5 bg-gray-500 text-gray-200   text-sm  font-medium  "
                  >
                    1/2
                  </button>
                  <button
                    onClick={() => doubleTheAmount()}
                    className="px-1.5  py-1.5 bg-gray-500 text-gray-200 border-l-2 text-sm cursor-pointer  font-medium border-gray-200"
                  >
                    2x
                  </button>
                </div>
              </div>
              <p className="lg:text-sm text-gray-200 font-medium mt-1">
                Number of Bets
              </p>
              {stopLoss > 0 || stopProfit > 0 ? (
                <p className="w-full rounded border px-2 py-1 outline-none font-semibold text-lg bg-[#0F212E] text-[#f7efe8]">
                  ♾️
                </p>
              ) : (
                <input
                  className="w-full rounded border px-2 py-1 outline-none font-semibold text-lg bg-[#0F212E] text-[#f7efe8]"
                  placeholder="Enter Bets Number "
                  value={totalBets}
                  disabled={isAutoBetStart}
                  type="tel"
                  onChange={(e) => setTotalBets(e.target.value)}
                />
              )}

              {isAutoBetStart ? (
                <button
                  onClick={() => stopAutoBet()}
                  className={`w-full rounded font-semibold text-lg text-white py-2 mt-3 bg-green-400`}
                >
                  Stop Auto Bet
                </button>
              ) : (
                <button
                  onClick={() => handleBetPlace()}
                  disabled={target < 1.01 || amount < 1}
                  className={`w-full rounded font-semibold text-lg text-[#2f2e2e] py-2 mt-3 bg-[#20e701]  `}
                >
                  Start Auto Bet
                </button>
              )}

              <div>
                <p className="lg:text-sm text-gray-200 font-medium mt-1 mb-1">
                  Stop On Profit
                </p>
                <input
                  className="w-full rounded border px-2 py-1 outline-none font-semibold text-lg bg-[#0F212E] text-[#f7efe8]"
                  placeholder="0.0000"
                  type="tel"
                  value={stopProfit}
                  disabled={isAutoBetStart}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!isNaN(value)) {
                      setStopProfit(value);
                    }
                  }}
                />
              </div>
              <div>
                <p className="lg:text-sm text-gray-200 font-medium mt-1 mb-1">
                  Stop On Loss
                </p>
                <input
                  className="w-full rounded border px-2 py-1 outline-none font-semibold text-lg bg-[#0F212E] text-[#f7efe8]"
                  placeholder="0.0000"
                  value={stopLoss}
                  type="tel"
                  disabled={isAutoBetStart}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!isNaN(value)) {
                      setStopLoss(value);
                    }
                  }}
                />
              </div>
              <div>
                <p className="lg:text-sm text-gray-200 font-medium mt-1 mb-1">
                  Increase on WIN
                </p>
                <div className="relative">
                  <input
                    className="w-full rounded border px-2 py-1 outline-none font-semibold text-lg bg-[#0F212E] text-[#f7efe8]"
                    placeholder="0.0000"
                    type="tel"
                    value={increaseOnWin}
                    disabled={isAutoBetStart}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!isNaN(value)) {
                        setIncreaseOnWin(value);
                      }
                    }}
                  />
                  <p className="absolute right-2 h-full flex items-center justify-center text-gray-200 font-semibold top-0 bottom-0">
                    %
                  </p>
                </div>
              </div>
              <div>
                <p className="lg:text-sm text-gray-200 font-medium mt-1 mb-1">
                  Increase on LOSS
                </p>
                <div className="relative">
                  <input
                    className="w-full rounded border px-2 py-1 outline-none font-semibold text-lg bg-[#0F212E] text-[#f7efe8]"
                    placeholder="0.0000"
                    type="tel"
                    value={increaseOnLoss}
                    disabled={isAutoBetStart}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!isNaN(value)) {
                        setIncreaseOnLoss(value);
                      }
                    }}
                  />
                  <p className="absolute right-2 h-full flex items-center justify-center text-gray-200 font-semibold top-0 bottom-0">
                    %
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-2 mt-1 rounded bg-gray-900">
                <AiOutlineAreaChart
                  size={24}
                  color="white"
                  className="cursor-pointer"
                  onClick={() => setIsGraph((pre) => !pre)}
                />
              </div>
            </div>
          )}
        </div>
        <div
          className=" relative w-[100%]  lg:w-[70%] bg-cover bg-no-repeat bg-center   px-6 py-2    "
          style={{ backgroundImage: `url(${bg1})` }}
        >
          <div className="min-h-[60vh] md:min-h-[60vh] relative">
            <HistoryTop history={history} />
            <div className="mt-20  flex justify-center  items-center w-full h-full">
              <p
                className={`text-8xl text-center font-semibold ${
                  isWin ? "text-[#00e701]" : "text-red-500"
                }`}
              >
                {/* {randomNumber.toFixed(2)}x */}
                <CountUp end={randomNumber} decimals={2} duration={1} />x
              </p>
            </div>
            <div className="absolute bottom-0 flex justify-between items-center w-full bg-gray-700 rounded p-2 ">
              <div className="w-[50%]">
                <p className="text-sm text-gray-300 mb-1 font-medium">
                  Target Multipiler
                </p>
                <input
                  value={target}
                  type="tel"
                  disabled={isAutoBetStart || isManualBetStart}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-[95%] pl-2 text-gray-200 text-sm py-1 bg-gray-900 border-gray-500 border-2 rounded outline-none focus:border-0"
                />
              </div>
              <div className="w-[50%]">
                <p className="text-sm text-gray-300 mb-1 font-medium">
                  Win Chance %
                </p>
                <input
                  value={winChance}
                  type="tel"
                  disabled
                  className="w-[95%] pl-2 text-gray-200 text-sm py-1 bg-gray-900 border-gray-500 border-2 rounded outline-none focus:border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="m-auto mt-6  max-w-[421px] md:max-w-[500px] lg:max-w-5xl">
        <GameHistory type={"limbo"} refreshHistory={refreshHistory} />{" "}
      </div>

      {isGraph && (
        <Graph
          wageredAmount={wageredAmount}
          graphProfit={graphProfit}
          totalWin={totalWin}
          totalLoss={totalLoss}
          handleClose={() => setIsGraph(false)}
          resetGraph={() => {
            setWegeredAmount(0);
            setGraphProfit(0);
            setTotalWin(0);
            setTotalLoss(0);
          }}
        />
      )}
    </div>
  );
}
