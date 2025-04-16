import React, { useEffect, useRef, useState } from "react";
import bg1 from "../../assets/photos/dragon-bg-3.jpg";
import bg2 from "../../assets/photos/1.svg";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { GetUserDetails } from "../../Controllers/User/UserController";
import { MinesGameUpdateWallet } from "../../Controllers/User/GamesController";
import { toast, ToastContainer } from "react-toastify";
import { DragonTowerData } from "../../assets/Data/DragonTowerData";
import GameHistory from "../GamesComponent/Limbo/GameHistory";

class EggImg extends React.Component {
  render() {
    return (
      <img
        alt="egg"
        className="m-auto h-[45px] absolute left-0 right-0 bottom-1"
        src={require("../../assets/photos/egg.png")}
      />
    );
  }
}
class FireEgg extends React.Component {
  render() {
    return (
      <img
        alt="fireegg"
        className="m-auto h-[45px] absolute left-0 right-0 bottom-1"
        src={require("../../assets/photos/fire-lgg.gif")}
      />
    );
  }
}

class WinPopup extends React.Component {
  render() {
    const { amount, profit } = this.props;
    return (
      <div className="absolute animate-jump-in top-0 w-full h-full flex justify-center items-center">
        <img
          alt="success"
          src={require("../../assets/photos/winimg.png")}
          className="w-80"
        />
        <p className="absolute mt-20 font-bold text-2xl text-[#13b70a]">
          ${Number(amount * profit).toFixed(2)}
        </p>
      </div>
    );
  }
}

export default function DragonTower() {
  const [selected, setSelected] = useState("Manual");
  const [user, setUser] = useState({});
  const [amount, setAmount] = useState(10);
  const [totlaBalance, setTotalBalance] = useState();
  const [cols, setCols] = useState(4);
  const [level, setLevel] = useState("easy");
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [rows, setRows] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [towerData, setTowerData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openedTowerData, setOpenedTowerData] = useState([]);
  const [isBombFound, setBombFound] = useState(false);
  const [openableTower, setOpenableTower] = useState(1);
  const [profitTable, setProfitTable] = useState([]);
  const [profit, setProfit] = useState(1.0);
  const [refreshHistory, setRefreshHistory] = useState(false);
  const [isWon, setWon] = useState(false);
  const [isSound, setSound] = useState(true);

  // refresh game history---------------------------------------
  const refreshHistoryFunction = () => {
    setRefreshHistory((pre) => !pre);
  };

  const handleClick = (type) => {
    setSelected(type);
  };
  const amountRef = useRef(amount);

  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  const doubleTheAmount = () => {
    if (amountRef.current * 2 > totlaBalance) {
      setAmount(totlaBalance);
    } else {
      setAmount((pre) => pre * 2);
    }
  };

  // bet function----------------------------------------------------
  const handleBet = async () => {
    if (amount < 10) {
      toast.warn("Minimum bet is $10", { position: "top-center" });
      return;
    } else if (totlaBalance < amount) {
      toast.error("Insufficient balance", { position: "top-center" });
      return;
    }
    const walletResponse = await updateWalletBalance("deduct", amount);
    toast.success("Bet Placed. Game start", { position: "top-center" });
    if (walletResponse) {
      setIsPlaying(true);
      return;
    }
  };

  // cashout function----------------------------------------------
  const handleCashout = async () => {
    if (isPlaying) {
      await updateWalletBalance("add", amount * profit);
      setBombFound(true);
      setWon(true);
      resetGame();
    }
  };

  // tower click function----------------------------------------------
  const handleTowerClick = (item, innerIndex) => {
    if (item.bombID === innerIndex) {
      setBombFound(true);
      resetGame();
      return;
    }
    const newTowerData = {
      towerID: item.towerID,
      bombID: item.bombID,
      openedBox: innerIndex,
    };
    setOpenedTowerData((prevState) => [...prevState, newTowerData]);
    setOpenableTower(openableTower + 1);
    // setp profit--------
    const checkProfit = profitTable.find(
      (item) => item.id === openedTowerData.length + 1
    );
    if (checkProfit) {
      setProfit(checkProfit?.multiplier);
    }
  };

  // reset game on cashout, on loss--------------------------------------------
  const resetGame = () => {
    setOpenableTower(0);
    setIsPlaying(false);
    setTimeout(() => {
      setBombFound(false);
      setOpenableTower(1);
      setOpenedTowerData([]);
      generateRandomNumbers();
      setProfit(0);
      setWon(false);
    }, 3000);
  };

  // update wallet balance online---------------------------------------------
  const formData = {};
  const updateWalletBalance = async (type, amount) => {
    formData.type = type;
    formData.amount = amount;
    formData.game_type = "Dragon Tower";
    formData.uid = user?.uid;
    formData.details = { dragonCashout: profit };

    try {
      const response = await MinesGameUpdateWallet(formData);
      if (response && response.status) {
        refreshHistoryFunction();
        return true;
      }
    } catch (error) {
      if (error?.response?.status === 302) {
        toast.error(error.response.data.message, {
          position: "top-center",
        });
      } else {
        toast.error("Server Error");
      }
      return false;
    } finally {
      userDataGet();
    }
  };

  // select game level-------------------------------------------
  useEffect(() => {
    if (level === "easy") {
      setCols(4);
    } else if (level === "medium") {
      setCols(3);
    } else if (level === "hard") {
      setCols(2);
    }
  }, [level, cols]);

  // generate random number--------------------------------------
  const generateRandomNumbers = () => {
    const numbers = [];
    for (let i = 0; i < 9; i++) {
      numbers.push(Math.floor(Math.random() * cols) + 1);
    }
    setRandomNumbers(numbers);
  };
  useEffect(() => {
    generateRandomNumbers();
  }, [cols]);

  //set bomb -------------------------------------------------------
  useEffect(() => {
    const result = rows
      .map((item, index) => ({
        towerID: item,
        bombID: randomNumbers[index],
      }))
      .reverse();
    setTowerData(result);
  }, [cols, rows, randomNumbers]);

  // get user details---------------------------------------------
  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setTotalBalance(Number(response[0].color_wallet_balnace));
      setUser(response[0]);
    } else {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    userDataGet();
  }, []);

  // game profit table-------------------------------------------------
  useEffect(() => {
    const result = DragonTowerData.find(
      (item) => item.type === level
    )?.multiplierData;
    setProfitTable(result);
  }, [level]);

  // win game if max profit-------------------------------------------------
  useEffect(() => {
    if (openedTowerData.length === 9) {
      handleCashout();
    }
  }, [openedTowerData]);

  // game sound----------------------------------------------
  useEffect(() => {
    const gameAudio = new Audio(require("../../assets/audio/game-sound.mp3"));
    gameAudio.loop = true;

    if (isSound) {
      gameAudio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    } else {
      gameAudio.pause();
      gameAudio.currentTime = 0;
    }

    // Cleanup function to stop the audio when the component unmounts or isSound changes
    return () => {
      gameAudio.pause();
      gameAudio.currentTime = 0;
    };
  }, [isSound]);

  return (
    <div>
      <ToastContainer />
      <div className="flex flex-wrap-reverse m-auto  max-w-[421px] md:max-w-[500px] lg:max-w-5xl">
        <div className="w-[100%] flex flex-col-reverse lg:flex-col  lg:w-[30%]  p-6 h-screen/2 bg-[#213743] ">
          <div className="w-full flex space-x-2 bg-gray-800 rounded-full px-2 py-2 lg mt-2">
            <button
              onClick={() => handleClick("Manual")}
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
          </div>
          <div>
            <div className="flex mt-1 justify-between text-gray-200">
              <p className="lg:text-xs font-medium">Bet Amount</p>
              <p className="lg:text-xs  ">
                ${Number(totlaBalance).toFixed(2)}{" "}
              </p>
            </div>
            <div className="flex relative mt-0.5 items-center">
              <input
                className="w-full rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
                placeholder="Enter Amount "
                value={amount}
                disabled={isPlaying}
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
                  className="px-1.5  py-2 bg-[#2f4553] text-gray-200   text-xs  font-medium  "
                  disabled={isPlaying}
                >
                  1/2
                </button>
                <button
                  onClick={() => doubleTheAmount()}
                  className="px-1.5  py-2 bg-[#2f4553] text-gray-200 border-l-2 text-xs cursor-pointer font-medium border-gray-200"
                  disabled={isPlaying}
                >
                  2x
                </button>
              </div>
            </div>
            <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
              Difficulty
            </p>
            <select
              onChange={(e) => setLevel(e.target.value)}
              disabled={isPlaying}
              className="w-full rounded border-2 mt-0.5 border-[#2f4553] px-2  py-2 focus:outline-none  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
            >
              <option value="easy">Easy</option>
              <option value="medium"> Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          {isPlaying ? (
            <div>
              <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
                Total Profit ({Number(profit).toFixed(2)}x)
              </p>
              <input
                className="w-full mt-0.5 rounded border-2 border-[#2f4553] px-2 py-2  outline-none font-semibold bg-[#0f212e] text-gray-100 text-sm"
                placeholder="Profit"
                disabled
                value={Number(amount * profit).toFixed(2)}
              />
              <button
                onClick={() => handleCashout()}
                // disable cashout while opened is 0
                disabled={openedTowerData.length === 0}
                className="w-full rounded bg-[#20e701] font-semibold py-2 text-sm mt-3"
              >
                Cashout
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleBet()}
              disabled={isBombFound}
              className="w-full rounded bg-[#20e701] font-semibold py-2 text-sm mt-3"
            >
              Bet
            </button>
          )}
        </div>
        <div
          id=""
          className=" relative w-[100%]  lg:w-[70%] bg-cover bg-black  p-6 h-screen/2  "
          style={{
            backgroundImage: `url(${bg1})`,
          }}
        >
          {/* sound */}
          <div
            className="absolute top-1 left-1"
            onClick={() => setSound((pre) => !pre)}
          >
            {isSound ? (
              <HiMiniSpeakerWave
                size={20}
                color="white"
                className="cursor-pointer bg-red-500 rounded-full p-0.5"
              />
            ) : (
              <HiMiniSpeakerXMark
                size={20}
                color="white"
                className="cursor-pointer bg-red-500 rounded-full p-0.5"
              />
            )}
          </div>
          {/* dragon img */}
          <img
            alt="dragon"
            className="m-auto h-20"
            src={require("../../assets/photos/dragon1.png")}
          />
          <div
            className={`relative bg-[#182433] p-2 w-[100%] lg:w-[80%] m-auto rounded-lg border-8 border-[#56687a] ${
              !isPlaying && "cursor-not-allowed"
            }`}
          >
            {towerData &&
              towerData.map((item, index) => (
                <div key={index} className="flex justify-around">
                  {Array.from({ length: cols }).map((item2, innerIndex) => (
                    <button
                      key={innerIndex}
                      className={`mb-3 relative h-10 bg-contain rounded ${
                        openableTower === item.towerID
                          ? "bg-[#20e701]  "
                          : "bg-[#213743]"
                      } ${
                        level === "easy"
                          ? "w-[24%]"
                          : level === "medium"
                          ? "w-[32%]"
                          : "w-[49%]"
                      }`}
                      style={{
                        backgroundImage: `url(${bg2})`,
                      }}
                      disabled={!isPlaying || item.towerID !== openableTower}
                      onClick={() => handleTowerClick(item, innerIndex + 1)}
                    >
                      {/* Images */}
                      {isBombFound ? (
                        item.bombID === innerIndex + 1 ? (
                          <FireEgg />
                        ) : (
                          <EggImg />
                        )
                      ) : openedTowerData.some(
                          (i) =>
                            i.towerID === item.towerID &&
                            i.openedBox === innerIndex + 1
                        ) ? (
                        <EggImg />
                      ) : null}
                    </button>
                  ))}
                </div>
              ))}

            {isWon && <WinPopup amount={amount} profit={profit} />}
          </div>
        </div>
      </div>
      <div className="m-auto mt-6  max-w-[421px] md:max-w-[500px] lg:max-w-5xl">
        <GameHistory type={"Dragon Tower"} refreshHistory={refreshHistory} />{" "}
      </div>
    </div>
  );
}

// {!isBombFound && openedTower.includes(index + 1) ? (
//   item.bombID === innerIndex + 1 ? (
//     <FireEgg />
//   ) : (
//     <EggImg />
//   )
// ) : (
//   ""
// )}
