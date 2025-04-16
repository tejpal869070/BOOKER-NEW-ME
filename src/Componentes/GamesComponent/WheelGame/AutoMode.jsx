import React, { useEffect, useRef, useState } from "react";
import GameTypeSelector from "./GameTypeSelector";
import { toast, ToastContainer } from "react-toastify";
import { WheelData } from "../../../assets/Data/WheelData";
import { MinesGameUpdateWallet } from "../../../Controllers/User/GamesController";
import { GetUserDetails } from "../../../Controllers/User/UserController";
import { AiOutlineAreaChart } from "react-icons/ai";
import Graph from "../MinesGame/Graph";
import bg1 from "../../../assets/photos/game-bg-2.jpg";

export default function AutoMode({ refreshHistoryFunction }) {
  const [amount, setAmount] = useState(10);
  const [totalBalance, setTotalBalance] = useState(0);
  const [gameType, setGameType] = useState("low");
  const [colors, setColors] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isWin, setWin] = useState(false);
  const [winAmount, setWinAmount] = useState();
  const [stopLoss, setStopLoss] = useState(0);
  const [stopProfit, setStopProfit] = useState(0);
  const [increaseOnWin, setIncreaseOnWin] = useState(0);
  const [increaseOnLoss, setIncreaseOnLoss] = useState(0);
  const [autoSpin, setAutoSpin] = useState(false);
  const [startingBalance, setStartingBalance] = useState(totalBalance);
  const amountRef = useRef(amount);
  const autoSpinRef = useRef(null);
  const currentRotationRef = useRef(currentRotation);
  const balanceRef = useRef(totalBalance);
  const startingBalanceRef = useRef(startingBalance);
  const [initialBetAmount, setInitialBetAmount] = useState();
  const [desiredSpins, setDesiredSpins] = useState(0);
  const [spinCount, setSpinCount] = useState(0);

  const [user, setUser] = useState({});

  // New state to track if a spin is in progress
  const [isSpinning, setIsSpinning] = useState(false);

  // graph data
  const [isGraph, setIsGraph] = useState(false);
  const [wageredAmount, setWegeredAmount] = useState(0);
  const [graphProfit, setGraphProfit] = useState(0);
  const [totalWin, setTotalWin] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);

  const doubleTheAmount = () => {
    if (amountRef.current * 2 > totalBalance) {
      setAmount(totalBalance);
    } else {
      setAmount((pre) => pre * 2);
    }
  };

  const selectGameType = (e) => {
    setGameType(e.target.value);
  };

  const handleSpinFunction = (amount) => {
    setSpinCount((pre) => pre + 1);
    const audio = new Audio(require("../../../assets/audio/spin-232536.mp3"));
    audio.play();
    setWin(false);
    setWinAmount(amount);
    setGameStarted(true);
    setIsSpinning(true); // Set spinning to true when spin starts
    const newRotation = Math.floor(Math.random() * 360) + 1800;
    const totalRotation = currentRotationRef.current + newRotation;
    setRotation(-totalRotation);

    const adjustedRotation = totalRotation % 360;
    const angle = (adjustedRotation / 360) * 100;

    if (colors.length > 0) {
      if (gameType === "low" || gameType === "medium") {
        const index = Math.floor(
          (adjustedRotation % 360) / (360 / colors.length)
        );
        var landedColor = colors[index];
      } else {
        let cumulativeArea = 0;
        var landedColor = null;

        for (const color of colors) {
          cumulativeArea += color.area;
          if (angle <= cumulativeArea) {
            landedColor = color;
            break;
          }
        }
      }

      setTimeout(() => {
        setSelectedColor(landedColor);
        setTransitionEnabled(false);
        setCurrentRotation(totalRotation);
        setGameStarted(false);
        setWin(true);
        setIsSpinning(false);
        setTimeout(() => {
          setWin(false);
        }, 2000);
      }, 3200);
    }
  };

  const handleSpinClick = async () => {
    const currentBalance = balanceRef.current;
    if (isSpinning) {
      toast.warn("Please wait for the current spin to finish.");
      return;
    }
    if (stopLoss < amountRef.current && stopLoss > 0) {
      toast.error(
        "The stop-loss target cannot be lower than the current bet amount."
      );
      stopAutoSpin();
      return;
    } else if (amountRef.current > currentBalance || amountRef.current === 0) {
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
      stopAutoSpin();
      return;
    } else if (
      currentBalance >=
        Number(startingBalanceRef.current) + Number(stopProfit) &&
      Number(stopProfit) > 0
    ) {
      toast.warn("You have reached your stop profit", {
        position: "top-center",
      });
      stopAutoSpin();
      return;
    } else if (
      currentBalance <= Number(startingBalanceRef.current) - Number(stopLoss) &&
      Number(stopLoss) > 0
    ) {
      toast.warn("You have reached your stop loss", {
        position: "top-center",
      });
      stopAutoSpin();
      return;
    } else {
      setWegeredAmount((pre) => pre + amountRef.current);
      handleSpinFunction(amountRef.current);
      setTotalBalance((pre) => pre - amountRef.current);
      updateWalletBalance("deduct", amountRef.current);
      refreshHistoryFunction();
    }
  };

  const startAutoSpin = () => {
    setInitialBetAmount(amount);
    setAutoSpin(true);
    setSpinCount(0);
    handleSpinClick();
    autoSpinRef.current = setInterval(() => {
      handleSpinClick();
    }, 3500);
  };

  const stopAutoSpin = () => {
    setAutoSpin(false);
    clearInterval(autoSpinRef.current);
    setStartingBalance(balanceRef.current);
  };

  useEffect(() => {
    if (spinCount === desiredSpins) {
      stopAutoSpin();
    }
  }, [spinCount]);

  useEffect(() => {
    return () => {
      stopAutoSpin();
    };
  }, []);

  // update wallet balance online---------------------------------------------
  const formData = {};
  const updateWalletBalance = async (type, amount) => {
    formData.type = type;
    formData.amount = amount;
    formData.game_type = "Wheel";
    formData.uid = user?.uid;
    formData.details = {
      multiplier: selectedColor?.profit,
    };

    try {
      const response = await MinesGameUpdateWallet(formData);
      if (response && response.status) {
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

  useEffect(() => {
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

    userDataGet();
  }, []);

  useEffect(() => {
    setColors(WheelData.find((item) => item.gameType === gameType).colors);
  }, [gameType]);

  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  useEffect(() => {
    const updateBalance = async () => {
      if (isWin) {
        // if win
        if (selectedColor?.profit !== 0.0) {
          if (increaseOnWin > 0) {
            setAmount((pre) => pre + (pre * Number(increaseOnWin)) / 100);
          }
          setAmount(initialBetAmount);
          setGraphProfit(
            (pre) =>
              pre +
              amountRef.current * selectedColor?.profit -
              amountRef.current
          );
          setTotalWin((pre) => pre + 1);
          setTotalBalance(
            (pre) => pre + amountRef.current * selectedColor?.profit
          );
          await updateWalletBalance(
            "add",
            amountRef.current * selectedColor?.profit
          );
          refreshHistoryFunction();
        } else {
          if (increaseOnLoss > 0) {
            setAmount((pre) => pre + (pre * Number(increaseOnLoss)) / 100);
          }

          setGraphProfit((pre) => pre - amountRef.current);
          setTotalLoss((pre) => pre + 1);
        }
      }
    };

    updateBalance();
  }, [selectedColor, isWin]);

  useEffect(() => {
    if (!transitionEnabled) {
      const timer = setTimeout(() => {
        setTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);

  useEffect(() => {
    return () => {
      clearInterval(autoSpinRef.current); // Clear the interval on unmount
    };
  }, []);

  useEffect(() => {
    currentRotationRef.current = currentRotation;
  }, [currentRotation]);

  useEffect(() => {
    balanceRef.current = totalBalance;
  }, [totalBalance]);

  useEffect(() => {
    startingBalanceRef.current = startingBalance;
  }, [startingBalance, totalBalance]);

  return (
    <div>
      <ToastContainer />
      <div className="flex m-auto max-w-[421px] md:max-w-[500px] lg:max-w-5xl  flex-wrap-reverse">
        <div className="w-[100%] flex flex-col-reverse lg:flex-col  lg:w-[30%]    p-6 h-screen/2 bg-[#213743]">
          <div className="mt-4 lg:mt-0">
            <GameTypeSelector gameStarted={autoSpin} />
          </div>
          <div className="flex flex-col">
            <div className="order-2 lg:order-1">
              <div>
                <div className="flex justify-between dark:text-gray-200">
                  <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
                    Bet Amount
                  </p>
                  <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
                    ${Number(totalBalance).toFixed(2)}
                  </p>
                </div>
                <div className="flex relative items-center">
                  <input
                    className="w-full rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
                    placeholder="Enter Amount "
                    type="tel"
                    value={amount}
                    disabled={autoSpin}
                    onChange={(e) => setAmount(Number(e.target.value))} // Convert to number
                  />
                  <div className="absolute right-0.5">
                    <button
                      onClick={() => setAmount((pre) => pre / 2)}
                      disabled={autoSpin}
                      className="px-1.5 py-1.5 bg-gray-500 text-gray-200 text-sm font-medium"
                    >
                      1/2
                    </button>
                    <button
                      onClick={() => doubleTheAmount()}
                      disabled={autoSpin}
                      className="px-1.5 py-1.5 bg-gray-500 text-gray-200 border-l-2 cursor-pointer text-sm font-medium border-gray-200"
                    >
                      2x
                    </button>
                  </div>
                </div>
                <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
                  Risk
                </p>
                <select
                  value={gameType}
                  disabled={autoSpin}
                  onChange={(e) => selectGameType(e)} // Changed to onChange
                  className="w-full rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
                  Desired Spins (0 for infinite)
                </p>
                <input
                  className="w-full rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
                  placeholder="Enter number of spins"
                  type="tel"
                  value={desiredSpins}
                  disabled={autoSpin}
                  onChange={(e) => setDesiredSpins(Number(e.target.value) || 0)}
                />
              </div>
            </div>
            <button
              className={`mt-4 order-1 lg:order-2 px-6 py-3 ${
                autoSpin ? "bg-red-500" : "bg-blue-500"
              } w-full rounded bg-[#20e701] font-semibold py-2 text-sm mt-3`}
              onClick={() => {
                if (autoSpin) {
                  stopAutoSpin();
                } else {
                  startAutoSpin();
                }
              }}
            >
              {autoSpin ? "Stop Auto Bet" : "Start Auto Bet"}
            </button>
            <div className="order-3 lg:order-3">
              <div>
                <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
                  Stop On Profit
                </p>
                <input
                  className="w-full rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
                  placeholder="0.0000"
                  type="tel"
                  disabled={autoSpin}
                  value={stopProfit}
                  onChange={(e) => setStopProfit(e.target.value) || 0}
                />
              </div>
              <div>
                <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
                  Stop On Loss
                </p>
                <input
                  className="w-full rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
                  placeholder="0.0000"
                  type="tel"
                  disabled={autoSpin}
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value) || 0}
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
                    disabled={autoSpin}
                    value={increaseOnWin}
                    onChange={(e) => setIncreaseOnWin(e.target.value)}
                  />
                  <p className="absolute right-2 h-full flex items-center justify-center text-gray-800 font-semibold top-0 bottom-0">
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
                    disabled={autoSpin}
                    value={increaseOnLoss}
                    onChange={(e) => setIncreaseOnLoss(e.target.value)}
                  />
                  <p className="absolute right-2 h-full flex items-center justify-center text-gray-800 font-semibold top-0 bottom-0">
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
          </div>
        </div>
        <div
          id="wheelBoard"
          className="relative  w-[100%]  lg:w-[70%] p-6 h-screen/2 bg-[#0F212E] bg-cover bg-center "
          style={{ backgroundImage: `url(${bg1})` }}
        >
          <div className="flex justify-center items-center">
            <div className="relative flex flex-col items-center mt-10">
              {/* Pin */}
              <div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24"
                style={{ zIndex: 2 }}
              >
                <img
                  alt="pin"
                  src={require("../../../assets/photos/pin.gif")}
                />
              </div>
              <div className="border-[20px] border-[#263742] rounded-full mt-4 shadow-lg">
                <div
                  className={`relative flex justify-center items-center w-[300px] md:w-[450px] h-[300px] md:h-[450px] rounded-full`}
                  style={{
                    background: `conic-gradient(${colors
                      ?.map((item, index) => {
                        const startAngle = (index * 360) / colors.length;
                        const endAngle =
                          startAngle +
                          (gameType === "low" || gameType === "medium"
                            ? 360 / colors.length
                            : (item.area * 360) / 100);
                        return `${item.color} ${startAngle}deg ${endAngle}deg`;
                      })
                      .join(", ")})`,
                    transform: `rotate(${rotation}deg)`,
                    transition: transitionEnabled
                      ? "transform 3s ease-out"
                      : "none",
                  }}
                >
                  {colors.map((item, index) => {
                    const startAngle =
                      gameType === "high"
                        ? 327.6
                        : (index * 360) / colors.length;
                    const endAngle =
                      startAngle +
                      (gameType === "low" || gameType === "medium"
                        ? 360 / colors.length
                        : (item.area * 360) / 100);
                    const midAngle = startAngle + (endAngle - startAngle) / 2;

                    return (
                      <div
                        key={index}
                        className="absolute flex items-center justify-center h-[30%] text-sm font-bold text-white"
                        style={{
                          transform: `rotate(${midAngle}deg) translate(0, -130%) rotate(-${0}deg)`,
                          transformOrigin: "center",
                          position: "absolute",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          color: item.color,
                        }}
                      >
                        {item.profit}x
                      </div>
                    );
                  })}
                  <div className="w-[85%] h-[85%] bg-[#0F212E] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 w-full m-auto mt-6">
            {colors &&
              Array.from(
                new Map(colors?.map((item) => [item.color, item])).values()
              ).map((item, index) => (
                <section
                  key={index}
                  className="relative overflow-hidden px-4 flex justify-center items-center text-[#FBFBFB] font-semibold py-3 rounded bg-[#2F4553]"
                >
                  <p
                    className="relative z-[99]"
                    style={{ textShadow: "0px 0px 4px black" }}
                  >
                    {Number(item.profit).toFixed(2)}x
                  </p>
                  <div
                    className={`absolute bottom-0 w-full rounded-b ${
                      selectedColor?.color === item.color
                        ? "h-full rounded-t animate-fade-up animate-once animate-duration-[400ms]"
                        : "h-2"
                    }`}
                    style={{ backgroundColor: `${item.color}` }}
                  ></div>
                </section>
              ))}
          </div>

          {isWin && (
            <div className="absolute w-full h-full flex justify-center items-center top-0 left-0 z-[500]">
              <div className="border-2 animate-jump border-gray-500 flex flex-col gap-2 justify-center items-center p-6 rounded-full">
                <p className="font-bold text-4xl text-[#406C82]">
                  {selectedColor?.profit}x
                </p>
                <p
                  className={`text-lg font-bold ${
                    winAmount * selectedColor?.profit === 0
                      ? "text-red-800"
                      : "text-[#13b70a]"
                  }`}
                >
                  {winAmount * selectedColor?.profit !== 0
                    ? `+$${Number(winAmount * selectedColor?.profit).toFixed(
                        2
                      )}`
                    : `-$${Math.abs(winAmount).toFixed(2)}`}
                </p>
              </div>
            </div>
          )}

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
      </div>
    </div>
  );
}
