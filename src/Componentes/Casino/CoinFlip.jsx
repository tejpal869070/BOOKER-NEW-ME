import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { SiHeadspace } from "react-icons/si";
import { TbSquareRotatedFilled } from "react-icons/tb";
import headsImage from "../../assets/photos/heads.png";
import tailsImage from "../../assets/photos/tails.png";
import GameHistory from "../GamesComponent/Limbo/GameHistory";
import bg1 from "../../assets/photos/coin-flip-bg.png";
import { toast, ToastContainer } from "react-toastify";
import { GetUserDetails } from "../../Controllers/User/UserController";
import { MinesGameUpdateWallet } from "../../Controllers/User/GamesController";
import { FaViacoin } from "react-icons/fa6";

export default function CoinFlip() {
  const [amount, setAmount] = useState(10);
  const [refreshHistory, setRefreshHistory] = useState(false);
  const [selected, setSelected] = useState("heads");
  const [totalBalance, setTotalBalance] = useState(0);
  const [user, setUser] = useState({});
  const [isWon, setWon] = useState(false);
  const [processing, setProcesssing] = useState(false);

  const [flipResult, setFlipResult] = useState(null);
  const [flipping, setFlipping] = useState(false);

  const amountRef = useRef(amount);
  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  const doubleTheAmount = () => {
    if (amountRef.current * 2 > totalBalance) {
      setAmount(totalBalance);
    } else {
      setAmount((pre) => pre * 2);
    }
  };

  const flipCoin = async () => {
    toast.dismiss();
    setProcesssing(true);
    if (amount < 1 || isNaN(amount)) {
      toast.warn("Minimum bet amount is $1", {
        position: "top-center",
      });
      setProcesssing(false);
      return;
    } else if (!selected) {
      toast.warn("Please select a side", {
        position: "top-center",
      });
      setProcesssing(false);
      return;
    } else if (amount > totalBalance) {
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
      setProcesssing(false);
      return;
    }
    const updateWallet = await updateWalletBalance("deduct", amountRef.current);
    if (updateWallet) {
      toast.success("Bet Placed", {
        position: "top-center",
      });
      const audio = new Audio(require("../../assets/audio/coin-flip-2.mp3"));
      audio.play();
      flipFunction();
      setProcesssing(false);
    }
    setProcesssing(false);
  };

  const flipFunction = () => {
    setFlipping(true);
    setFlipResult(null);
    const result = Math.random() < 0.5 ? "heads" : "tails";

    setTimeout(() => {
      setFlipping(false);
      setFlipResult(result);
      successFunction(result);
    }, 2000);
    setTimeout(() => {
      setFlipResult(null);
    }, 5000);
  };

  const successFunction = async (result) => {
    toast.dismiss();
    const audio = new Audio(require("../../assets/audio/coin-game-win.mp3"));
    audio.play();
    if (selected === result) {
      setWon(true);
      await updateWalletBalance("add", amountRef.current * 2);
    } else {
      setWon(false);
    }
  };

  // update wallet balance online---------------------------------------------
  const formData = {};
  const updateWalletBalance = async (type, amount) => {
    formData.type = type;
    formData.amount = amount;
    formData.game_type = "Coin Flip";
    formData.uid = user?.uid;
    // formData.details = { limboTarget: target };

    try {
      const response = await MinesGameUpdateWallet(formData);
      if (response && response.status) {
        return true;
      }
    } catch (error) {
      if (error?.response?.status === 302) {
        toast.error(error.response.data.message, {
          position: "top-center",
        });
      } else {
        toast.error("Server Error", {
          position: "top-center",
        });
      }
    } finally {
      userDataGet();
      refreshHistoryFunction();
    }
  };

  const refreshHistoryFunction = () => {
    setRefreshHistory((pre) => !pre);
  };

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
      setTotalBalance(Number(response[0].color_wallet_balnace));
    } else {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    userDataGet();
  }, []);

  return (
    <div>
      <ToastContainer />
      <div className="min-h-screen ">
        {/* {isFlashPopup && <FlashPopup handleClose={handleClose} />} */}
        <div className="flex flex-wrap-reverse m-auto  max-w-[421px] md:max-w-[500px] lg:max-w-5xl">
          <div className="w-[100%]  lg:w-[30%]  p-6 h-screen/2 bg-[#213743]">
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
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  disabled={flipping}
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
                    className="px-1.5  py-1.5 bg-gray-500 text-gray-200   text-sm  font-medium"
                  >
                    1/2
                  </button>
                  <button
                    onClick={() => doubleTheAmount()}
                    className="px-1.5  py-1.5 bg-gray-500 text-gray-200 border-l-2 text-sm cursor-pointer font-medium border-gray-200"
                  >
                    2x
                  </button>
                </div>
              </div>
              <p className="mt-3 lg:mt-2 lg:text-xs text-gray-200 font-medium">
                Bombs
              </p>
              <div className="flex  mt-1 ">
                <div className="flex  w-full justify-between">
                  <button
                    onClick={() => setSelected("heads")}
                    disabled={flipping}
                    className={`rounded-l hover:rounded-l-xl transition-all duration-300 ease-in-out flex items-center gap-2 justify-center text-sm py-2 w-[48%] bg-gray-800 text-gray-200 text-center px-2 cursor-pointer ${
                      selected === "heads" && "bg-indigo-500 shadow-md"
                    } `}
                  >
                    Heads <SiHeadspace size={16} color="#ffa200" />
                  </button>

                  <button
                    onClick={() => setSelected("tails")}
                    disabled={flipping}
                    className={`rounded-r  hover:rounded-r-xl transition-all duration-300 ease-in-out flex items-center gap-2 justify-center text-sm py-2 w-[48%] bg-gray-800 text-gray-200 text-center px-2 cursor-pointer ${
                      selected === "tails" && "bg-indigo-500 shadow-md"
                    } `}
                  >
                    Tails <TbSquareRotatedFilled size={16} color="#ffa200" />
                  </button>
                </div>
              </div>
              {flipping ? (
                <button className="w-full rounded bg-[#20e701] font-semibold py-2 text-sm mt-3">
                  <div className="flex justify-center items-center">
                    <div className="border-gray-300 h-6 w-6 animate-spin duration-100 rounded-full border-4 border-t-blue-600" />
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => flipCoin()}
                  disabled={flipping || processing}
                  className="w-full rounded bg-[#20e701] font-bold py-2 text-xs mt-3"
                >
                  FLIP COIN
                </button>
              )}
            </div>
          </div>
          <div
            className=" relative w-[100%]  lg:w-[70%] overflow-hidden   p-6 min-h-[50vh] md:min-h-[60vh]  bg-[#0f212e] bg-no-repeat bg-center bg-cover"
            style={{ backgroundImage: `url(${bg1})` }}
          >
            <div className="flex flex-col items-center justify-center  ">
              <div className="  absolute flex flex-col items-center justify-center  bottom-0 w-full h-full">
                {flipResult !== null ? (
                  <div className="relative w-40 h-40 animate-jump-in">
                    <img
                      alt="coin heads"
                      src={flipResult === "heads" ? headsImage : tailsImage}
                      className="side heads absolute w-full h-full"
                      style={{ filter: "drop-shadow(0px 0px 47px gold)" }}
                    />
                  </div>
                ) : (
                  <div
                    className={` relative w-40 h-40 ${
                      flipping ? "coin-fast " : "coin  animate-jump-in"
                    }`}
                  >
                    <img
                      alt="coin heads"
                      src={headsImage}
                      className="side heads absolute w-full h-full"
                    />
                    <img
                      alt="coin tails"
                      src={tailsImage}
                      className="side tails absolute w-full h-full"
                    />
                  </div>
                )}
              </div>
              {
                <div
                  className={`absolute bottom-[10%] text-center text-2xl font-bold ${
                    isWon ? " text-[#20e701]" : "text-red-500"
                  }`}
                >
                  <img
                    alt="sdon"
                    src={require("../../assets/photos/coin-flip-win.png")}
                    className="w-40"
                  />
                  {flipResult === null ? (
                    <p className="w-[82%] py-1 m-auto text-center rounded-b-lg backdrop-blur-sm bg-black/30">
                      <FaViacoin className="m-auto animate-rotate-y animate-infinite animate-ease-linear" />
                    </p>
                  ) : (
                    <p className="w-[82%] py-1 m-auto rounded-b-lg backdrop-blur-sm bg-black/30">
                      $
                      {isWon
                        ? Number(amount * 2).toFixed(2)
                        : Number(amount).toFixed(2)}
                    </p>
                  )}
                </div>
              }
            </div>
          </div>
        </div>
        <div className="m-auto mt-6  max-w-[421px] md:max-w-[500px] lg:max-w-5xl">
          <GameHistory type={"Coin Flip"} refreshHistory={refreshHistory} />
        </div>
      </div>
    </div>
  );
}
