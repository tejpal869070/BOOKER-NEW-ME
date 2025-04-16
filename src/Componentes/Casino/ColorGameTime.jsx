import React, { useCallback, useEffect, useState } from "react";
import Timer from "../GamesComponent/Timer";
import ColorGameHistory from "../GamesComponent/ColorGameHistory";
import ColorGameMyHistory from "../GamesComponent/ColorGameMyHistory";
import bg1 from "../../assets/photos/bg1.png";
import ColorGamePopup from "../GamesComponent/ColorGamePopup";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import {
  ColorGameColors,
  ColorGameCurrentData,
  ColorGameNumbers,
} from "../../Controllers/User/GamesController";
import swal from "sweetalert";
import { Loading1, Loading3 } from "../Loading1";
import { GetUserDetails } from "../../Controllers/User/UserController";
import offer1 from "../../assets/photos/offer1.jpg";
import offer2 from "../../assets/photos/offer2.jpg";
import offer3 from "../../assets/photos/offer3.jpg";
import { toast, ToastContainer } from "react-toastify";
import { IoMdVolumeHigh } from "react-icons/io";
import betSuccessGif from "../../assets/photos/bet-success.gif";
import { FaVolumeMute } from "react-icons/fa";
import audio1 from "../../assets/audio/betPlace.mp3";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import Countdown from "../GamesComponent/Countdown";

export default function ColorGame({ gameType }) {
  const [selectedHistoryTab, setSelectedHistoryTab] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [GameColors, setGameColors] = useState([]);
  const [GameNumber, setGameNumber] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentGameLoading, setCurrentGameLoading] = useState();
  const [currentGameData, setCurrentGameData] = useState();
  const [isCountDown, setIsCountDown] = useState(false);
  const [popupData, setPopupData] = useState();
  const [refreshHistory, setRefreshHis] = useState(true);
  const [user, setUser] = useState();
  const [userLoading, setUserLoading] = useState(true);
  const [betPlace, setBetPlaced] = useState(false);
  const [sound, isSound] = useState(false);
  const [isBetWin, setBetWin] = useState(false);
  const [winAmount, setWinAmount] = useState();

  const [remainingSecond, setRemainingSecond] = useState();

  // whether red or green can be selected
  const [RedSelected, setRedSelected] = useState(true);
  const [GreenSelected, setGreenSelected] = useState(true);

  const controllSound = () => {
    isSound((pre) => !pre);
  };

  const betWon = (totalAmount) => {
    setWinAmount(totalAmount);
    setBetWin(true);
    setTimeout(() => {
      setBetWin(false);
      setWinAmount(0);
    }, 2000);
  };

  const openPopup = (item) => {
    setIsPopupOpen(true);
    setPopupData(item);
  };

  const closePopup = (type) => {
    setRefreshHis((pre) => !pre);
    if (type === "success") {
      setIsPopupOpen(false);
      userDataGet();
      setBetPlaced(true);
      setTimeout(() => {
        setBetPlaced(false);
      }, 800);
    } else {
      setIsPopupOpen(false);
      userDataGet();
    }
  };

  // color game colors and number api
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [numbersResponse, colorsResponse] = await Promise.all([
          ColorGameNumbers(gameType),
          ColorGameColors(gameType),
        ]);
        setGameNumber(numbersResponse.data);
        setGameColors(colorsResponse.data);
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
            window.location.href = "/home";
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameType]);

  // ongoing game data
  const currentData = useCallback(async () => {
    setCurrentGameLoading(true);
    try {
      const response = await ColorGameCurrentData(gameType);
      setCurrentGameData(response.data[0]);
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
          window.location.href = "/home";
        }
      });
    } finally {
      setCurrentGameLoading(false);
    }
  }, [gameType]);

  useEffect(() => {
    currentData();
  }, [currentData]);

  // when game end
  const refresh = () => {
    setRefreshHis((pre) => !pre);
    setIsCountDown(false);
    currentData();
    userDataGet();
  };

  // count down start
  const countdownFunction = (seconds) => {
    setIsCountDown(true);
    setIsPopupOpen(false);
    setRemainingSecond(seconds);
  };

  const userDataGet = async () => {
    setUserLoading(true);
    try {
      const response = await GetUserDetails();
      if (response !== null && response.length > 0) {
        setUser(response[0]);
      } else {
        setUser(null); // Optionally reset user state
      }
    } catch (error) {
      // Optionally handle error state or notify the user
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    userDataGet();
  }, []);

  useEffect(() => {
    const sound1 = document.getElementById("sound3");
    if (sound && betPlace) {
      sound1.play();
    }
  }, [sound, betPlace]);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
        <Loading3 />
      </div>
    );
  }

  return (
    <div className="flex">
      <audio id="sound3">
        <source src={audio1} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <ToastContainer />
      <div className="w-full">
        <div></div>
        {/* home volume balance */}
        <div className=" flex justify-between items-center px-2">
          <div className="flex items-center justify-center gap-2">
            <Link
              className="cursor-pointer   "
              to={{ pathname: "", search: "?game=color-game" }}
            >
              <IoHome size={24} className="dark:text-white" />
            </Link>
            {sound ? (
              <IoMdVolumeHigh
                size={24}
                className="cursor-pointer text-gray-900 dark:text-gray-200"
                onClick={controllSound}
              />
            ) : (
              <FaVolumeMute
                size={24}
                className="cursor-pointer text-gray-900 dark:text-gray-200"
                onClick={controllSound}
              />
            )}
          </div>
          <p className="font-medium dark:text-gray-200 text-medium pr-4">
            Balance : $ {user && Number(user.color_wallet_balnace).toFixed(2)}
          </p>
        </div>

        <div
          className="flex bg-no-repeat bg-cover px-2 md:px-4 justify-between w-full border-b-2 border-gray pb-2"
          style={{ backgroundImage: `url(${bg1})` }}
        >
          <div className="py-2">
            <p className="text-sm font-semibold">Period</p>
            <p className="font-bold">
              {currentGameData && currentGameData.period}
            </p>
          </div>
          <div>
            {currentGameData?.end_date && (
              <Timer
                currentGameData={currentGameData}
                refresh={refresh}
                countdownFunction={(seconds) => countdownFunction(seconds)}
                sound={sound}
              />
            )}
          </div>
        </div>

        <div className="relative bg-gradient-to-r from-rose-100 to-teal-100 dark:bg-gradient-to-r dark:from-slate-500 dark:to-slate-800 py-4">
          {/* color buttons */}
          <div className="flex justify-around lg:justify-center lg:gap-12 justify-center py-2 border-b-2 border-white">
            {GameColors &&
              GameColors.map((item, index) => (
                <button
                  key={index}
                  disabled={
                    !GreenSelected
                      ? index === 0
                      : !RedSelected
                      ? index === 2
                      : false
                  }
                  onClick={() => openPopup(item)}
                  className={`px-6 md:px-8 cursor-pointer  hover:shadow-lg  py-3  ${index===0 ? "rounded-tr-2xl rounded-bl-2xl": index===2 ? "rounded-tl-2xl rounded-br-2xl":"rounded-xl"}`}
                  style={{ backgroundColor: item.color_code }}
                >
                  <button className="text-2xl font-bold text-white">
                    {item.color_name}
                  </button>
                </button>
              ))}
          </div>

          {/* color numbers */}
          <div className="  p-4 border-b-2 border-white">
            <div className="grid grid-cols-5 grid-rows-2 gap-4 lg:px-10">
              {GameNumber &&
                GameNumber.map((item, index) => (
                  <ColorCircle
                    index={index}
                    key={item.id}
                    number={item.number}
                    orders={item.orders}
                    popupData={item}
                    currentGameData={currentGameData}
                    refresh={() => {
                      userDataGet();
                      setRefreshHis((pre) => !pre);
                      setBetPlaced(true);
                      setTimeout(() => {
                        setBetPlaced(false);
                      }, 700);
                    }}
                  />
                ))}
            </div>
          </div>

          {/* Countdown Flip */}
          {isCountDown && (
            <div className="absolute w-full h-full top-0 bg-[#000000c9] flex justify-center items-center">
              <Countdown seconds={Number(remainingSecond)} />
            </div>
          )}
          {isBetWin && (
            <div className="z-[999] absolute top-0 w-full h-full backdrop-blur-[2px] flex  justify-center items-center">
              <img
                alt="banner"
                loading="lazy"
                src={
                  winAmount > 0
                    ? require("../../assets/photos/winimg.png")
                    : require("../../assets/photos/lossimg.png")
                }
                className="w-[300px]"
              />
              <p
                className={`absolute mt-20 text-2xl font-bold ${
                  winAmount > 0 ? "text-[#13b70a]" : "text-red-800"
                }`}
              >
                {/* +${winAmount} */}
                {winAmount > 0 ? `+$${winAmount}` : `-$${Math.abs(winAmount)}`}
              </p>
            </div>
          )}
        </div>

        {/* history */}
        <div className="border-2 border-gray-400 mt-2 rounded-lg p-1">
          <ColorGameHistory
            gameType={gameType}
            refreshHistory={refreshHistory}
            isCountDown={isCountDown}
          />
        </div>
        <div className="border-2 border-gray-400 mt-4 rounded-lg p-1">
          <ColorGameMyHistory
            gameType={gameType}
            refreshHistory={refreshHistory}
            isCountDown={isCountDown}
            currentGameData={currentGameData}
            betWon={(totalAmount) => betWon(totalAmount)}
          />
        </div>

        {/* popup */}
        <ColorGamePopup
          isOpen={isPopupOpen}
          onClose={(type) => closePopup(type)}
          popupData={popupData}
          currentGameData={currentGameData && currentGameData}
        />
      </div>
      <div className="hidden w-80 pt-6 px-4 lg:block">
        <img alt="offer1" src={offer1} />
        <img alt="offer2" className="mt-2" src={offer2} />
        <img alt="offer3" className="mt-2" src={offer3} />
      </div>

      {betPlace && (
        <div className="fixed  top-0 left-0 w-full h-full flex justify-center items-center backdrop-blur-sm 	 z-[9999]">
          <img alt="gifff" src={betSuccessGif} className="w-40 h-40" />
        </div>
      )}
    </div>
  );
}

// color game numbers

const ColorCircle = ({
  orders,
  number,
  popupData,
  currentGameData,
  refresh,
  index
}) => {
  const colors = orders.map((order) => order.color_code);
  const colorCount = colors.length;

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = (type) => {
    if (type === "success") {
      setIsPopupOpen(false);
      refresh();
    } else {
      setIsPopupOpen(false);
    }
  };

  const circleNumberStyle = "text-4xl font-bold text-gray-200  ";

  return (
    <div className=" ">
      <div
        onClick={openPopup}
        className="relative cursor-pointer h-14 md:h-24 w-14 md:w-24 rounded-full p-1 border-2 border-dotted border-black dark:border-gray-400 overflow-hidden"
      >
        <img alt="dfdg" src={require(`../../assets/photos/${index}.png`)} />
        {/* {colorCount === 1 ? (
          <div
            className="h-full w-full rounded-full flex justify-center items-center"
            style={{ background: colors[0] }}
          >
            <p className={circleNumberStyle}>{number}</p>
          </div>
        ) : colorCount > 1 ? (
          <div
            className="w-full h-full rounded-full"
            style={{ background: colors[0] }}
          >
            <div
              // className="absolute  rounded-r-full  right-1"
              className="absolute h-[85%] md:h-[90%] rounded-r-full w-[46%] md:w-[48%] right-1"
              style={{ background: colors[1] }}
            />
            <p
              className={`absolute h-full text-center flex justify-center items-center w-full m-auto inset-0 ${circleNumberStyle}`}
            >
              {number}
            </p>
          </div>
        ) : (
          <div className="h-full w-full bg-transparent" />
        )} */}
      </div>
      <ColorGamePopup
        isOpen={isPopupOpen}
        onClose={(type) => closePopup(type)}
        popupData={popupData}
        currentGameData={currentGameData}
      />
    </div>
  );
};
