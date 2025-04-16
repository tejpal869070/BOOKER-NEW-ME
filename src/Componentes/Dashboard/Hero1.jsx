import React, { useEffect, useState } from "react";
import { HiMiniWallet } from "react-icons/hi2";
import { MdGeneratingTokens } from "react-icons/md";
import SocialShare from "../Account/SocialShare";
import { Link } from "react-router-dom";
import { GetUserDetails } from "../../Controllers/User/UserController";
import { Loading1, Loading3 } from "../Loading1";
import { GiReceiveMoney } from "react-icons/gi";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { FcConferenceCall } from "react-icons/fc";
import { FcAreaChart } from "react-icons/fc";
import { FcMoneyTransfer } from "react-icons/fc";
import { PiFootballFill } from "react-icons/pi";
import bg1 from "../../assets/photos/bg-main.jpg";
import Games from "./Games";
import { FaArrowCircleRight } from "react-icons/fa";
import { FaArrowCircleLeft } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { MainGameWalletMoneyTransfer } from "../../Controllers/User/GamesController";
import { toast, ToastContainer } from "react-toastify";
import VerifyPin from "../VerifyPin";

export default function Hero1() {
  const [showShare, setShowShare] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isWalletsOpen, setIsWalletsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState();
  const [transferToAmount, setTransferToAmount] = useState();
  const [amountHave, setAmountHave] = useState();
  const [success, setSuccess] = useState(false);
  const [isVerifyOpen, setVerifyOpen] = useState(false);
  const [error, setError] = useState("");

  const openSocialShare = () => {
    setShowShare(true);
  };

  const closeSocialShare = () => {
    setShowShare(false);
  };

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUserData(response[0]);
      sessionStorage.setItem("userDetails", JSON.stringify(response[0]));
      setLoading(false);
    }
  };

  const handleButtons = (id) => {
    setIsOpen(true);
    setType(id);
    if (id === 1) {
      setAmountHave(userData.wallet_balance);
    } else {
      setAmountHave(userData.color_wallet_balnace);
    }
  };

  const openVerifyPin = () => {
    if (transferToAmount > Number(amountHave)) {
      setError("Amount Exceed");
    } else if (transferToAmount < 100 || transferToAmount === undefined) {
      setError("Minimum Amount is 100");
    } else {
      setVerifyOpen(true);
    }
  };

  const onclose2 = () => {
    setVerifyOpen(false);
  };

  const formData = {
    amount: transferToAmount,
    type: type,
  };

  const successFunction = async (pin) => {
    try {
      const response = await MainGameWalletMoneyTransfer(formData, pin);
      if (response.status) {
        setSuccess(true);
        userDataGet();
        setTransferToAmount(0);
        setIsOpen(false);
        setTimeout(() => {
          setSuccess(false);
        }, 3500);
      } else {
        toast.error(`Please Try Again !`, {
          position: "top-center",
        });
      }
    } catch (error) {
      if (error.response.status === 302) {
        toast.error(`${error.response.data.message}`, {
          position: "top-center",
        });
      } else {
        toast.error(`Something Went Wrong !`, {
          position: "top-center",
        });
      }
    }
  };

  useEffect(() => {
    userDataGet();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0   z-[99999]  w-screen h-screen flex items-center justify-center m-auto inset-0">
        <Loading3 />
      </div>
    );
  }

  return (
    <div className="pb-6">
      <ToastContainer />

      <div className="grid grid-cols-12 gap-4 w-full">
        <div
          className="relative   col-span-12 lg:col-span-6 xl:col-span-8 bg-opacity-10 bg-top bg-cover bg-left-bottom border-2 border-[#92a0fd] dark:border-gray-200 rounded-lg flex justify-between p-4"
          style={{ backgroundImage: `url(${bg1})` }}
        >
          <div className="z-[9]">
            <h1 className="text-xl font-bold  text-white ">
              Congratulations {userData && userData?.uname}! 🎉
            </h1>
            <p className="text-sm mt-2 text-gray-100">
              Joining: {userData && userData?.date?.split("T")[0]}
            </p>
            <div className="flex flex-wrap   gap-4 mt-4 hidden md:flex">
              <Link
                className="relative"
                to={{
                  pathname: "/home",
                  search: "?user=refer",
                }}
              >
                <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black "></span>
                <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                  Referral
                </span>
              </Link>
              <Link
                className="relative"
                to={{
                  pathname: "/home",
                  search: "?money=usdt-deposit",
                }}
              >
                <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
                <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                  Deposit
                </span>
              </Link>
              <Link
                className="relative"
                to={{
                  pathname: "/home",
                  search: "?user=VIP",
                }}
              >
                <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
                <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-6 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                  VIP
                </span>
              </Link>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b rounded-lg from-black to-transparent opacity-100 z-1" />
        </div>

        <div className="col-span-12 lg:col-span-6 xl:col-span-4 w-full rounded-lg hidden md:block">
          <div className="grid grid-cols-12 gap-4 w-full">
            <div
              className=" col-span-12 rounded-lg  p-4 border-2 border-black"
              style={{ boxShadow: "0px 0px 4px white" }}
            >
              <div
                onClick={() => setIsWalletsOpen(true)}
                className="flex justify-between recharge-button"
              >
                <HiMiniWallet className="" size={26} color="#92a0fd" />
                <p className="blinking-btn hidden md:flex cursor-pointer px-2 bg-green-500 rounded-full text-sm md:text-xs text-white font-medium   justify-center items-center">
                  EXCHANGE
                </p>
              </div>
              <p className="font-bold dark:text-gray-300">
                Total Balance{" "}
                <span className="text-[9px] font-medium dark:text-gray-200">
                  ( Main + Game Wallet)
                </span>
              </p>

              <p className="text-2xl font-bold text-black dark:text-gray-300">
                $
                {(
                  Number(userData.wallet_balance) +
                  Number(userData.color_wallet_balnace)
                ).toFixed(2)}
              </p>
            </div>

            <div className="col-span-12    bg-gradient-to-r from-indigo-400 to-cyan-400 py-2 rounded-lg px-4">
              <p className="font-bold text-white">
                {userData.currency} Rate : $1/COIN
              </p>
            </div>
          </div>
        </div>

        
      </div>
      <div className="flex justify-around items-center md:hidden">
        <div className="">
          <img
            alt="sdf"
            src={require("../../assets/photos/notification.png")}
            className="w-10"
          />
        </div>
        <div className="w-[70%] py-1 rounded-b-lg bg-white m-auto   bg-gradient-to-r from-indigo-400 to-cyan-400">
          <p className="text-center font-bold text-xl  text-white flex items-center gap-2 justify-center">
            <img
              alt="sodf"
              src={require("../../assets/photos/money-bag.png")}
              className="w-5"
            />{" "}
            $
            {(
              Number(userData.wallet_balance) +
              Number(userData.color_wallet_balnace)
            ).toFixed(2)}
          </p>
          <p className="text-[9px] font-medium text-center dark:text-gray-200">
            ( Main + Game Wallet)
          </p>
        </div>
        <Link to={{ pathname: "/home", search: `?user=profile` }}>
          <img
            alt="sdf"
            src={require("../../assets/photos/profile.png")}
            className="w-10"
          />
        </Link>
      </div>

      <Link
        to={{ pathname: "/home", search: "?user=refer" }}
        className="md:hidden cursor-pointer"
      >
        <img
          alt="banner"
          src={require("../../assets/photos/referbanner.jpg")}
          className="rounded-md mt-2 "
        />
      </Link>

      <Link
        to={{ pathname: "/home", search: "?user=investment" }}
        className="md:hidden cursor-pointer"
      >
        <img
          alt="banner"
          src={require("../../assets/photos/investment-img.png")}
          className="rounded-md w-full -mt-8 -mb-2 "
        />
      </Link>

      {/* Games */}
      <Games />
      {/* <Link
        className=" hidden md:block cursor-pointer"
        to={{ pathname: "/home", search: "?user=refer" }}
      >
        <img
          alt="banner"
          src={require("../../assets/photos/referbanner.jpg")}
          className="rounded-md mt-2 "
        />
      </Link> */}

      {/* quick options */}
      {/* <p className="text-2xl   pb-4 dark:text-gray-200 font-bold ">
        Quick Action
      </p>
      <div className="flex flex-wrap justify-between gap-4 pb-4 ">
        {linkData.map(({ to, icon, label }, index) => (
          <Link
            key={index}
            className=" flex-1 min-w-28 relative cursor-pointer"
            to={to}
          >
            <div className="overflow-hidden    text-white bg-black dark:bg-gray-700 rounded group">
              <p className="px-3.5 py-2 text-white bg-[#919ffdfc] group-hover:[#7b9eff] flex items-center justify-center transition-transform duration-300 group-hover:translate-y-[-5px]">
                {icon}
              </p>
              <p className="  py-1 text-gray-200 text-center">{label}</p>
            </div>
          </Link>
        ))}
      </div> */}

      {showShare && (
        <SocialShare
          url={`${window.location.origin}/register?referrer_code=${userData.reffer_code}`}
          onClose={closeSocialShare}
        />
      )}

      {isWalletsOpen && (
        <div className="animate-fade-down animate-duration-500 fixed top-0 left-0 w-full h-full flex justify-center items-center pt-10  backdrop-blur-[4px]   z-[9999]">
          <div className=" text-white bg-gradient-to-r from-gray-700 rounded   to-slate-900 p-10 inline-block">
            <div className="flex gap-6 items-center">
              <section className="px-6 py-2 rounded border-2 border-white">
                <p className="text-white font-semibold text-center text-2xl">
                  Main Wallet
                </p>
                <p className="font-semibold text-xl text-center mt-2 pt-2 border-gray-400  text-white border-t-2">
                  ${Number(userData.wallet_balance).toFixed(2)}
                </p>
              </section>
              <section className="px-6 py-2 rounded border-2 border-white">
                <p className="text-white font-semibold text-center text-2xl">
                  Game Wallet
                </p>
                <p className="font-semibold text-xl text-center mt-2 pt-2 border-gray-400  text-white border-t-2">
                  ${Number(userData.color_wallet_balnace).toFixed(2)}
                </p>
              </section>
            </div>
            <div className="flex gap-6 items-center justify-around mt-2">
              <section
                onClick={() => handleButtons(1)}
                className="px-6 py-2 rounded-full cursor-pointer bg-green-400"
              >
                <p className="text-white font-semibold flex justify-center items-center gap-2 text-center text-sm">
                  Transfer To Game
                  <FaArrowCircleRight size={20} />
                </p>
              </section>
              <section
                onClick={() => handleButtons(2)}
                className="px-6 py-2 rounded-full cursor-pointer bg-green-400"
              >
                <p className="text-white font-semibold flex justify-center items-center gap-2 text-center text-sm">
                  <FaArrowCircleLeft size={20} />
                  Transfer To Main
                </p>
              </section>
            </div>
            <MdCancel
              onClick={() => setIsWalletsOpen(false)}
              size={22}
              className="m-auto mt-6 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* popup */}
      {isOpen && (
        <div className="animate-fade-down animate-duration-500 fixed top-0 left-0 w-full h-full flex justify-center pt-10  backdrop-blur-md   z-[9999]">
          <div className=" text-white bg-gradient-to-r from-gray-700 rounded h-[60vh] to-slate-900 p-10 inline-block">
            <p className="text-xl font-medium text-center text-gray-200 border-b pb-2">
              Transfer From <br />{" "}
              {type === 1
                ? "Main Wallet To Game Wallet"
                : "Game Wallet To Main Wallet"}
            </p>
            <p className="mt-6">
              Your {type === 1 ? "Main Wallet Balance" : "Game Wallet Balance"}
              {"  "}
              {"  "}
              <span className="text-lg font-bold">
                ${" "}
                {type === 1
                  ? Number(userData.wallet_balance).toFixed(2)
                  : Number(userData.color_wallet_balnace).toFixed(2)}
              </span>
            </p>{" "}
            <div className="max-w-sm mt-4">
              <label
                for="input-label"
                className="block text-sm text-gray-300 font-medium mb-2 dark:text-white"
              >
                Transfer To {type === 1 ? "Game Wallet" : "Main Wallet"}
              </label>
              <input
                type="tel"
                id="input-label"
                className="py-2 px-4 block text-gray-200 bg-gray-700 w-full border-x-0 border-t-0 border-b-2   text-md       dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder=" "
                value={transferToAmount}
                onChange={(e) => setTransferToAmount(e.target.value)}
              />
              {error && <p className="text-red-500 italic text-sm">{error}</p>}
              <button
                onClick={openVerifyPin}
                className="m-auto w-full mt-4 relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md group"
              >
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple-500 group-hover:translate-x-0 ease">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </span>
                <span className="absolute flex items-center justify-center w-full h-full text-purple-500 transition-all duration-300 transform group-hover:translate-x-full ease">
                  Transfer
                </span>
                <span className="relative invisible">Button Text</span>
              </button>
            </div>
            {/* close button */}
            <MdCancel
              size={30}
              onClick={() => setIsOpen(false)}
              className="cursor-pointer text-center m-auto mt-6"
            />
          </div>
        </div>
      )}

      {isVerifyOpen && (
        <VerifyPin
          onclose2={onclose2}
          successFunction={(pin) => successFunction(pin)}
        />
      )}
    </div>
  );
}

const linkData = [
  // {
  //   to: { pathname: "/home", search: "?game=color-game" },
  //   icon: <BiSolidColor size={30} color="#fcff21" />,
  //   label: "Color Game",
  // },
  // {
  //   to: { pathname: "/home", search: "?game=mines" },
  //   icon: <FaBomb size={30} color="#fcff21" />,
  //   label: "Mines Game",
  // },
  // {
  //   to: { pathname: "/home", search: "?game=plinko" },
  //   icon: <PiBowlingBallBold size={30}   />,
  //   label: "Plinko Game",
  // },
  {
    to: { pathname: "/home", search: "?event=inplay" },
    icon: <PiFootballFill size={30} />,
    label: "Inplay",
  },
  {
    to: { pathname: "/home", search: "?money=usdt-deposit" },
    icon: <GiReceiveMoney size={30} />,
    label: "Deposit",
  },
  {
    to: { pathname: "/home", search: "?money=withdrawal" },
    icon: <FcMoneyTransfer size={30} />,
    label: "Withdraw",
  },
  {
    to: { pathname: "/home", search: "?account=account-history" },
    icon: <HiClipboardDocumentList size={30} />,
    label: "History",
  },
  {
    to: { pathname: "/home", search: "?network=downline-member" },
    icon: <FcConferenceCall size={30} />,
    label: "My Team",
  },
  {
    to: { pathname: "/home", search: "?investment=new-investment" },
    icon: <FcAreaChart size={30} />,
    label: "Investment",
  },
];
