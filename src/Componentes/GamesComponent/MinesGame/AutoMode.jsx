import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { mines } from "../../../assets/Data/GamesData";
 import { ToastContainer, toast } from "react-toastify";import 'react-toastify/dist/ReactToastify.css';
import { minesProfitTable } from "../../../assets/Data/MinesData";
import { GetUserDetails } from "../../../Controllers/User/UserController";
import { AiOutlineAreaChart } from "react-icons/ai";
import Graph from "./Graph";
import { MinesGameUpdateWallet } from "../../../Controllers/User/GamesController";

export default function AutoMode({
  isBetPlacedFunction,
  refreshHistoryFunction,
}) {
  const [totalBombs, setTotalBombs] = useState(1);
  const [amount, setAmount] = useState(10);
  const [totlaBalance, setTotalBalance] = useState();
  const [userSelectedIndex, setUserSelectedIndex] = useState([]);
  const [isAutoBetStart, setAutoBetStart] = useState(false);
  const [bombIndex, setBombIndex] = useState([]);
  const [diamndIndex, setDiamondIndex] = useState([]);
  const [totalBets, setTotalBets] = useState(0);
  const [stopLoss, setStopLoss] = useState(0);
  const [stopProfit, setStopProfit] = useState(0);
  const [increaseOnWin, setIncreaseOnWin] = useState(0);
  const [increaseOnLoss, setIncreaseOnLoss] = useState(0);
  const [isAllOpen, setAllOpen] = useState(false);
  const [betWin, setBetWin] = useState(false);
  const bombIndexRef = useRef(bombIndex);
  const [profit, setProfit] = useState(0);
  const timeoutRef = useRef([]);
  const balanceRef = useRef(totlaBalance);
  const amountRef = useRef(amount);
  const [startingBalance, setStartingBalance] = useState(totlaBalance);
  const [isBetLossed, setBetLossed] = useState(false);
  const [isGraph, setIsGraph] = useState(false);
  const initialBetAmount = amount;
  const [user, setUser] = useState({});

  const profitRef = useRef(profit);

  useEffect(() => {
    profitRef.current = profit;
  }, [profit]);

  // graph datat
  const [wageredAmount, setWegeredAmount] = useState(0);
  const [graphProfit, setGraphProfit] = useState(0);
  const [totalWin, setTotalWin] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);

  const [betAmountWin, setBetAmountWin] = useState();

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      const newBalance = Number(response[0].color_wallet_balnace);
      setUser(response[0]);
      setTotalBalance(newBalance);
      setStartingBalance(newBalance);
    } else {
      window.location.href = "/";
    }
  };

  const formData = {};
  const updateWalletBalance = async (type, amount) => {
    formData.type = type;
    formData.amount = amount;
    formData.game_type = "Mines";
    formData.uid = user?.uid;

    try {
      const response = await MinesGameUpdateWallet(formData);
      if (response.status) {
        refreshHistoryFunction();
      }
    } catch (error) {
      if (error?.response?.status === 302) {
        toast.error(error.response.data.message, {
          position: "top-center",
        });
      } else {
        toast.error("Server Error");
      }
    }
  };

  const handleCardClick = (item) => {
    const maxSelectable = 25 - totalBombs; // Calculate the maximum selectable cards

    setUserSelectedIndex((prev) => {
      const newIndex = prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : prev.length < maxSelectable
        ? [...prev, item.id]
        : prev;

      return newIndex;
    });
  };

  useEffect(() => {
    balanceRef.current = totlaBalance;
  }, [totlaBalance]);

  useEffect(() => {
    bombIndexRef.current = bombIndex;
  }, [bombIndex]);

  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  const autoFunction = async () => {
    setAllOpen(true);
    handleWallet("deduct");
    updateWalletBalance("deduct", amountRef.current);
    if (userSelectedIndex.some((item) => bombIndexRef.current.includes(item))) {
      setTotalLoss((pre) => pre + 1);
      setGraphProfit((pre) => pre - amountRef.current);
      const audio = new Audio(require("../../../assets/audio/blast1.mp3"));
      audio.play();
      setAmount((pre) => pre + (pre * Number(increaseOnLoss)) / 100);
      setBetLossed(true);
    } else {
      setBetWin(true);
      setBetAmountWin(amountRef.current);
      setTotalWin((pre) => pre + 1);
      setGraphProfit(
        (pre) =>
          pre +
          amountRef.current *
            minesProfitTable.find((item) => item.totalBomb === totalBombs)
              .profit[userSelectedIndex.length - 1]?.profit -
          amountRef.current
      );

      setBetLossed(false);
      if (increaseOnWin > 0) {
        setAmount((pre) => pre + (pre * Number(increaseOnWin)) / 100);
      } else {
        setAmount(initialBetAmount);
      }
      handleWallet("add");
      const audio = new Audio(
        require("../../../assets/audio/successSound.mp3")
      );
      audio.play();
    }

    setTimeout(() => {
      setAllOpen(false);
      setBetWin(false);
      generateRandom();
    }, 1500);
  };

  const handleWallet = async (type) => {
    if (type === "deduct") {
      if (!betWin) {
        setTotalBalance((prevBalance) => prevBalance - amountRef.current);
      }
    } else if (type === "add") {
      const calculatedProfit = minesProfitTable.find(
        (item) => item.totalBomb === totalBombs
      ).profit[userSelectedIndex.length - 1]?.profit;

      const profitAmount = amountRef.current * calculatedProfit;

      await updateWalletBalance("add", profitAmount);

      setProfit(calculatedProfit);
      setTotalBalance((prevBalance) => prevBalance + profitAmount);
    }
  };

  const handleAutoStart = () => {
    if (stopLoss > 0 && stopLoss < amountRef.current) {
      toast.error(
        "The stop-loss target cannot be lower than the current bet amount."
      );
      return;
    }
    setAutoBetStart(true);
    let currentBet = 0;

    const startBetting = () => {
      if (stopProfit > 0 || stopLoss > 0 || totalBets === 0) {
        const infiniteBetting = () => {
          if (balanceRef.current < amountRef.current) {
            stopAutoBet();
            toast.warn(
              <div className="flex justify-center items-center py-4 flex-col gap-2">
                <p>Insufficient Balance</p>
                <button
                  className="px-2 py-1 rounded-md bg-black text-gray-200"
                  onClick={() => {
                    const rechargeId =
                      document.getElementById("recharge-button");
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
            return;
          }
          setWegeredAmount((pre) => pre + amountRef.current);
          currentBet++;
          const currentBalance = balanceRef.current;
          if (
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
            autoFunction();
            timeoutRef.current.push(setTimeout(infiniteBetting, 2000));
          }
        };
        infiniteBetting();
      } else {
        const startRegularBetting = () => {
          if (balanceRef.current < amountRef.current) {
            stopAutoBet();
            toast.warn(
              <div className="flex justify-center items-center py-4 flex-col gap-2">
                <p>Insufficient Balance</p>
                <button
                  className="px-2 py-1 rounded-md bg-black text-gray-200"
                  onClick={() => {
                    const rechargeId =
                      document.getElementById("recharge-button");
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
            return;
          }
          if (currentBet < totalBets) {
            autoFunction();
            currentBet++;
            setWegeredAmount((pre) => pre + amountRef.current);
            timeoutRef.current.push(setTimeout(startRegularBetting, 2000));
          } else {
            stopAutoBet();
          }
        };
        startRegularBetting();
      }
    };

    startBetting();
     toast.success("Bet Placed. Game start", { position: "top-center" });
  };

  const stopAutoBet = () => {
    setStartingBalance(balanceRef.current);
    setAutoBetStart(false);
    generateRandom();
    setAllOpen(false);
    setBetWin(false);
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
    userDataGet();
  };

  const generateRandom = () => {
    const allRandomNumbers = new Set();
    while (allRandomNumbers.size < totalBombs) {
      const randomNumber = Math.floor(Math.random() * 25) + 1;
      allRandomNumbers.add(randomNumber);
    }
    const bombIndexes = Array.from(allRandomNumbers);
    const allIndexes = new Set(Array.from({ length: 25 }, (_, i) => i + 1));
    const diamondIndexes = Array.from(
      new Set([...allIndexes].filter((num) => !allRandomNumbers.has(num)))
    );

    setBombIndex(bombIndexes);
    setDiamondIndex(diamondIndexes);
  };

  useEffect(() => {
    generateRandom();
  }, [totalBombs]);

  useEffect(() => {
    isBetPlacedFunction(isAutoBetStart);
  }, [isAutoBetStart]);

  useEffect(() => {
    if (25 - userSelectedIndex.length < totalBombs) {
      setUserSelectedIndex([]);
    }
  }, [totalBombs, userSelectedIndex]);

  useEffect(() => {
    userDataGet();
  }, []);

  useEffect(() => {
    return () => {
      timeoutRef.current.forEach(clearTimeout);
      timeoutRef.current = [];
    };
  }, []);

  const doubleTheAmount = () => {
    if (amountRef.current * 2 > balanceRef.current) {
      setAmount(balanceRef.current);
    } else {
      setAmount((pre) => pre * 2);
    }
  };

  useEffect(() => {
    setProfit(
      minesProfitTable.find((item) => item.totalBomb === totalBombs).profit[
        userSelectedIndex.length - 1
      ]?.profit
    );
  }, [userSelectedIndex, bombIndexRef.current]);

  useEffect(() => {
    const element = document.getElementById("boxBoard");
    if (element) {
      const root = ReactDOM.createRoot(element);
      root.render(
        <div className="relative">
          <div className="grid grid-cols-5 gap-2 px-4 py-3">
            {mines.map((item, index) => (
              <button
                disabled={isAutoBetStart}
                key={index}
                onClick={() => handleCardClick(item)}
                className={`w-full h-16 flex justify-center items-center shadow-lg lg:h-28 rounded-xl ${  userSelectedIndex.includes(item.id) ? "bg-[#9000FF] border-b-4 border-[#7100C7]" : "bg-[#2f4553] border-b-4 border-[#213743]" }  `}
              >
                {isAllOpen ? (
                  diamndIndex.includes(item.id) ? (
                    <img
                      className="m-auto w-12 lg:w-16 animate-jump-in animate-duration-400"
                      src={require("../../../assets/photos/diamond-png.png")}
                      alt="imagggse"
                    />
                  ) : (
                    <img
                      className="m-auto w-16 animate-jump-in animate-duration-400"
                      src={require("../../../assets/photos/black-bomb.png")}
                      style={{ filter: "drop-shadow(2px 4px 6px black)" }}
                      alt="imagggse"
                    />
                  )
                ) : (
                  ""
                )}
              </button>
            ))}
          </div>
          {betWin && (
            <div className="absolute top-0 w-full h-full   flex justify-center items-center">
              <div>
                <div className="rounded-lg animate-jump-in p-4 border-2 bg-[#16242C] w-40 py-4 px-6 border-[#28A73C] flex flex-col gap-2 justify-center items-center">
                  <p className="text-center text-[#20E701] font-semibold text-lg lg:text-3xl">
                    {profitRef.current}x
                  </p>
                  <p className="text-center text-[#20E701] font-semibold text-lg border-t-2 border-gray-400 pt-0.5">
                    +$
                    {Number(
                      Number(betAmountWin) *
                        Number(
                          minesProfitTable.find(
                            (item) => item.totalBomb === totalBombs
                          ).profit[userSelectedIndex.length - 1]?.profit
                        )
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
  }, [
    userSelectedIndex,
    isAutoBetStart,
    isAllOpen,
    betWin,
    bombIndex,
    betAmountWin,
  ]);

  return (
    <div>
      <ToastContainer />
      <div>
        <div className="flex justify-between dark:text-gray-200">
          <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">Bet Amount</p>
          <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">${Number(totlaBalance).toFixed(2)}</p>
        </div>
        <div className="flex relative items-center">
          <input
            className="w-full rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
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
        <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
          Number Of Bets
        </p>
        {stopLoss > 0 || stopProfit > 0 ? (
          <p className="w-full rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm">
            ♾️
          </p>
        ) : (
          <input
            className="w-full rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
            placeholder="Enter Bets Number "
            value={totalBets}
            type="tel"
            disabled={isAutoBetStart}
            onChange={(e) => setTotalBets(e.target.value)}
          />
        )}

        <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
          Bombs
        </p>
        <div className="flex justify-between ">
          <div className="flex w-1/2 ">
            <button
              disabled={totalBombs === 1 || isAutoBetStart}
              onClick={() => setTotalBombs(totalBombs - 1)}
              className="rounded-l py-1 w-[25%] bg-gray-800 text-gray-200 text-center px-2 cursor-pointer"
            >
              -
            </button>
            <div className="py-1 w-[50%] bg-gray-200 text-gray-800 px-4 text-center">
              {totalBombs}
            </div>
            <button
              disabled={totalBombs === 24 || isAutoBetStart}
              onClick={() => setTotalBombs(totalBombs + 1)}
              className="rounded-r py-1 w-[25%] bg-gray-800 text-gray-200 text-center px-2 cursor-pointer"
            >
              +
            </button>
          </div>
          <p className="font-medium dark:text-gray-200">
            Profit{" "}
            <span className="ml-2 font-semibold text-xl text-green-300">
              x
              {minesProfitTable.find((item) => item.totalBomb === totalBombs)
                .profit[userSelectedIndex.length - 1]?.profit || 0}
            </span>
          </p>
        </div>

        {isAutoBetStart ? (
          <button
            onClick={() => stopAutoBet()}
            className={`w-full rounded font-semibold text-lg text-white py-2 mt-3 bg-green-400`}
          >
            Stop Auto Bet
          </button>
        ) : (
          <button
            onClick={() => handleAutoStart()}
            disabled={userSelectedIndex.length === 0}
            className={`w-full rounded  font-semibold py-2 text-sm mt-3      text-[#2f2e2e] py-2 mt-3 ${
              userSelectedIndex.length > 0 ? "bg-[#20e701]" : "bg-gray-400"
            }`}
          >
            Start Auto Bet
          </button>
        )}
      </div>

      <div>
        <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
          Stop On Profit
        </p>
        <input
          className="w-full rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
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
        <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
          Stop On Loss
        </p>
        <input
          className="w-full rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
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
        <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
          Increase on WIN
        </p>
        <div className="relative">
          <input
            className="w-full rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
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
        <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
          Increase on LOSS
        </p>
        <div className="relative">
          <input
            className="w-full rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
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
