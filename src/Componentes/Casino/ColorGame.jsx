import React, { useEffect, useState } from "react";
import {
  GetGameTypes,
  MainGameWalletMoneyTransfer,
} from "../../Controllers/User/GamesController";
import swal from "sweetalert";
import { API } from "../../Controllers/Api";
import { Link } from "react-router-dom";
import { GetUserDetails } from "../../Controllers/User/UserController";
import { Loading1, Loading3 } from "../Loading1";
import { RiColorFilterFill } from "react-icons/ri";
import { BiSolidWallet } from "react-icons/bi";
import { FaHandPointRight } from "react-icons/fa";
import { FaHandPointLeft } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
 import { ToastContainer, toast } from "react-toastify";import 'react-toastify/dist/ReactToastify.css';
import successImg from "../../assets/photos/success1-1--unscreen.gif";
import VerifyPin from "../VerifyPin";
import gameGirl from "../../assets/photos/colorgame.jpg";
import gif1 from "../../assets/photos/sendmoneygif.gif";

export default function ColorGame() {
  const [gameTypes, setGameTypes] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [gameLoading, setGameLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState();
  const [transferToAmount, setTransferToAmount] = useState();
  const [amountHave, setAmountHave] = useState();
  const [success, setSuccess] = useState(false);
  const [isVerifyOpen, setVerifyOpen] = useState(false);

  const fetchGameTypes = async () => {
    try {
      const data = await GetGameTypes();
      setGameTypes(data.data);
      setGameLoading(false);
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
    }
  };

  const userDataGet = async () => {
    setLoading(true);
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
      setLoading(false);
    }
  };

  const handleButtons = (id) => {
    setIsOpen(true);
    setType(id);
    if (id === 1) {
      setAmountHave(user.wallet_balance);
    } else {
      setAmountHave(user.color_wallet_balnace);
    }
  };

  const openVerifyPin = () => {
    if (transferToAmount > Number(amountHave)) {
      toast.error("Amount Exceed", {
        position: "top-center",
      });
    } else if (transferToAmount < 1 || transferToAmount === undefined) {
      toast.error("Minimum Amount is 1", {
        position: "top-center",
      });
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
    fetchGameTypes();
    userDataGet();
  }, []);

  if (loading || gameLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
        <Loading3 />
      </div>
    );
  }

  if (success) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-[#000000d1] bg-opacity-50 z-[9999]">
        <img alt="success" src={successImg} />
        <p className="text-2xl text-white font-semibold">Success.</p>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <div className=" hidden md:flex   gap-6 mb-4 flex-wrap  ">
        <p className="relative " href="#">
          <p className="fold-bold border-2 border-black dark:border-gray-400 relative z-[2] inline-block h-full w-full rounded     bg-indigo-100 dark:bg-indigo-100 text-gray-700 px-3 py-1 text-base font-bold text-black transition duration-100  ">
            <BiSolidWallet size={28} color="black" /> Main Balance : 
            ${Number(user.wallet_balance).toFixed(2)}
          </p>
          <div className="absolute w-full h-full bg-black dark:bg-gray-200 animate-pulse animate-duration-1000 top-1 left-1 z-[1] rounded " />
        </p>
        <div className="flex flex-col justify-between dark:text-gray-200 font-semibold">
          <button
            onClick={() => handleButtons(1)}
            className="flex items-center gap-2 cursor-pointer text-[#1116ff] dark:text-[#ffff54] animate-pulse animate-duration-1000"
          >
            Transfer To Game <FaHandPointRight />
          </button>
          <button
            onClick={() => handleButtons(2)}
            className="flex items-center gap-2 cursor-pointer text-[#1116ff] dark:text-[#ffff54] animate-pulse animate-duration-1000"
          >
            <FaHandPointLeft />
            Transfer To Main
          </button>
        </div>

        <p className="relative " href="#">
          <p className="fold-bold border-2 border-black dark:border-gray-400 relative z-[2] inline-block h-full w-full rounded  bg-indigo-100 dark:bg-indigo-100 text-gray-700 px-3 py-1 text-base font-bold text-black transition duration-100  ">
            <RiColorFilterFill size={28} color="black" />
            Game Balance : ${Number(user.color_wallet_balnace).toFixed(2)}
          </p>
          <div className="absolute w-full h-full bg-black dark:bg-gray-200 animate-pulse animate-duration-1000 top-1 left-1 z-[1] rounded " />
        </p>
      </div>

      <div className="  block md:hidden flex flex-wrap justify-around  mb-4   ">
        <p className="relative w-[45%]" href="#">
          <p className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-indigo-100 dark:bg-indigo-100 text-gray-700 px-3 py-1 text-base font-bold text-black transition duration-100  ">
            <RiColorFilterFill size={28} color="black" />
            Game Balance : <br />{" "}
            <p className="text-xl">
              {Number(user.color_wallet_balnace).toFixed(2)}
            </p>
          </p>
        </p>
        <p className="relative w-[45%]" href="#">
          <p className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-indigo-100 dark:bg-indigo-100 text-gray-700 px-3 py-1 text-base font-bold text-black transition duration-100  ">
            <BiSolidWallet size={28} color="black" /> Main Balance :
            <p className="text-xl">{Number(user.wallet_balance).toFixed(2)}</p>
          </p>
        </p>
        <div className="flex    w-full flex-row justify-between px-4 dark:text-gray-200 font-semibold">
          <button
            onClick={() => handleButtons(2)}
            className="flex items-center gap-2 cursor-pointer text-[#1116ff] dark:text-[#ffff54] animate-pulse animate-duration-1000"
          >
            Transfer To Main <FaHandPointRight />
          </button>
          <button
            onClick={() => handleButtons(1)}
            className="flex items-center gap-2 cursor-pointer text-[#1116ff] dark:text-[#ffff54] animate-pulse animate-duration-1000"
          >
            <FaHandPointLeft />
            Transfer To Game
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2   py-3  ">
        <div className="w-full hidden md:block   bg-black dark:bg-black ">
          <img alt="gamegirl" className="w-full md:w-[90%]" src={gameGirl} />
        </div>
        <div className="w-full flex justify-center items-center   bg-black rounded-sm dark:bg-black">
          <div className="grid grid-cols-2 xl:grid-cols-2    gap-1 md:gap-5 py-3  ">
            {gameTypes &&
              gameTypes.map((item, index) => (
                <Link
                  key={index}
                  to={{
                    pathname: "/home",
                    search: `?colorGameType=${item.id}`,
                  }}
                  className="w-full h-60 m-auto"
                >
                  <img
                    alt={item.name}
                    src={`${API.gametype_hostURL}${item.img}`}
                  />
                </Link>
              ))}
          </div>
        </div>
      </div>

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
                {" "}
                ${type === 1
                  ? Number(user.wallet_balance).toFixed(2)
                  : Number(user.color_wallet_balnace).toFixed(2)}
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

      <ToastContainer />
    </div>
  );
}
