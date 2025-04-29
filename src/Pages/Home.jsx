import React, { useEffect, useRef, useState } from "react";
import { FcPortraitMode } from "react-icons/fc";
import { IoLogOut } from "react-icons/io5";
import { FaMoneyBillTransfer, FaCoins, FaSackDollar } from "react-icons/fa6";
import { BsBank2 } from "react-icons/bs";
import { PiNetworkFill } from "react-icons/pi";
import { RiAccountCircleFill } from "react-icons/ri";
import { GiTakeMyMoney } from "react-icons/gi";
import { Link } from "react-router-dom";
import InnerSection from "./userPages/InnerSection";
import { GetUserDetails } from "../Controllers/User/UserController";
import ThemeToggle from "../Controllers/ThemeToggle";
import { Loading3 } from "../Componentes/Loading1";
import CreatePin from "../Componentes/Dashboard/CratePin";
import Logo from "../assets/photos/mainlogo.png";

import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { BsSafe2Fill } from "react-icons/bs";
import { IoGameControllerSharp } from "react-icons/io5";

// import Logo from "../assets/photos/mylogo2.png";

import { RiVipDiamondFill } from "react-icons/ri";
import { MdCancel, MdCasino } from "react-icons/md";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import VerifyPin from "../Componentes/VerifyPin";
import { toast } from "react-toastify";
import { MainGameWalletMoneyTransfer } from "../Controllers/User/GamesController";

export default function Home() {
  const [user, setuser] = React.useState({});
  const [loading, setLoading] = useState(true);
  const [isWalletsOpen, setIsWalletsOpen] = useState(false);
  const [type, setType] = useState();
  const [transferToAmount, setTransferToAmount] = useState();
  const [amountHave, setAmountHave] = useState();
  const [error, setError] = useState("");
  const [isVerifyOpen, setVerifyOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const dropdownClassList =
    "flex w-full p-2 pl-0 text-gray-900 rounded-lg group dark:text-black dark:hover:text-black  hover:bg-[#919ffdfc]  hover:animate-fade-right hover:animate-once hover:justify-center hover:animate-duration-[400ms]";

  const handleHideSideBar = () => {
    const sidebar = document.getElementById("sidebar-multi-level-sidebar");
    sidebar.classList.toggle("translate-x-0");
    sidebar.classList.toggle("-translate-x-full");
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("userDetails");
    window.location.href = "/";
  };

  const userGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setuser(response?.data?.user);
      // sessionStorage.setItem("userDetails", JSON.stringify(response[0]));
      setLoading(false);
    }
  };

  useEffect(() => {
    userGet();
  }, []);

  const handleButtons = (id) => {
    setIsOpen2(true);
    setType(id);
    if (id === 1) {
      setAmountHave(user.wallet_balance);
    } else {
      setAmountHave(user.game_wallet);
    }
  };

  const dropdownRef = useRef(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen((prevState) => !prevState);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isWalletsOpen]);

  const formData = {
    amount: transferToAmount,
    type: type,
  };

  const successFunction = async (pin) => {
    try {
      await MainGameWalletMoneyTransfer(formData, pin);

      userGet();
      setTransferToAmount(0);
      setIsOpen2(false);
      window.location.reload();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error !");
    }
  };

  const openVerifyPin = () => {
    if (transferToAmount > Number(amountHave)) {
      setError("Amount Exceed");
    } else if (transferToAmount < 1 || transferToAmount === undefined) {
      setError("Minimum Amount is $1");
    } else {
      setVerifyOpen(true);
    }
  };

  const onclose2 = () => {
    setVerifyOpen(false);
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center m-auto inset-0">
        <Loading3 />
      </div>
    );
  }

  return (
    <div className="relative dark:bg-black w-full h-full overflow-x-hidden">
      <nav className="hidden md:block bg-gradient-to-r from-blue-800 to-indigo-900 z-10 border-b-2 border-gray-200 dark:bg-gray-900 fixed w-full">
        <div className="  flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="sm:pl-64" />
          <div className="flex gap-4 items-center justify-end">
            <Link
              to={"/home?money=usdt-deposit"}
              className="cursor-pointer flex justify-center items-center gap-2 px-2 py-0.5 text-sm font-semibold rounded-full top-blinking-btn"
            >
              <GiPayMoney /> Deposit
            </Link>
            <Link
              to={"/home?money=withdrawal"}
              className="cursor-pointer flex justify-center items-center gap-2 px-2 py-0.5 text-sm font-semibold rounded-full top-blinking-btn"
            >
              <GiReceiveMoney /> Withdrawal
            </Link>
            {/* <Link
              to={"/home?investment=new-investment"}
              className="cursor-pointer flex justify-center items-center gap-2 px-2 py-0.5 text-sm font-semibold rounded-full bg-gray-200"
            >
              <BsSafe2Fill /> Investment
            </Link> */}
            <button
              onClick={async () => {
                await userGet();
                setIsWalletsOpen(true);
              }}
              id="recharge-button"
              className="cursor-pointer flex justify-center items-center gap-2 px-2 py-0.5 text-sm font-semibold rounded-full bg-gray-200"
            >
              <IoGameControllerSharp /> Recharge Game Wallet
            </button>

            <div className="hidden md:block">
              <ThemeToggle onNav={true} />
            </div>
            <div className="flex  lg:flex-col items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <button
                type="button"
                className="flex  text-sm bg-gray-800 rounded-full md:me-0 ring-4 ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                onClick={toggleDropdown}
              >
                <FcPortraitMode size={30} />
              </button>
              <div
                className={`z-50 my-4 mt-10 border-[0.01px] border-gray right-2 top-6 md:top-4 shadow-xl text-base list-none bg-white absolute divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 ${
                  isOpen ? "" : "hidden"
                }`}
                ref={dropdownRef}
                id="user-dropdown"
              >
                <div className="px-4 py-3 border-b-2 border-gray">
                  <span className="block  text-gray-900 dark:text-white">
                    {user.uname}
                  </span>
                  <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                    {user.email}
                  </span>
                  <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                    M.No. {user.mobile}
                  </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <a
                      href="/home"
                      className="block px-4 py-2 text-sm text-gray-700  dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <Link
                      to={{ pathname: "/home", search: "?change=securityPin" }}
                      className="block px-4 py-2 text-sm text-gray-700  dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Change Security Pin
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/change-password"}
                      className="block px-4 py-2 text-sm text-gray-700  dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Change Password
                    </Link>
                  </li>
                  <li>
                    <div className="block px-4 py-2 text-sm text-gray-700  dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                      <ThemeToggle />
                    </div>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700  dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
              <button
                data-drawer-target="sidebar-multi-level-sidebar"
                data-drawer-toggle="sidebar-multi-level-sidebar"
                aria-controls="sidebar-multi-level-sidebar"
                type="button"
                onClick={() => {
                  const sidebar = document.getElementById(
                    "sidebar-multi-level-sidebar"
                  );
                  sidebar.classList.toggle("translate-x-0");
                  sidebar.classList.toggle("-translate-x-full");
                }}
                className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden  focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-400 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 flex left-0 z-40 w-full sm:w-64 h-screen    transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 w-64 transition-transform border-r-2   sm:translate-x-0   py-4 overflow-y-auto no-scrollbar bg-gradient-to-r from-blue-800 to-indigo-900  dark:bg-gray-800">
          <div className="">
            <Link
              to={{ pathname: "/home", search: `?dashboard` }}
              className="  "
            >
              <img
                src={Logo}
                className="w-[60%] m-auto mb-4"
                alt="bLogo"
                style={{ filter: "drop-shadow(0px 0px 34px white)" }}
              />
            </Link>
          </div>
          <ul className="space-y-2 font-medium">
            <li className="side-bar-list">
              <Link
                to={{ pathname: "/home", search: `?dashboard` }}
                onClick={handleHideSideBar}
                className="flex items-center p-2 text-gray-900 dark:hover:text-white rounded-lg dark:text-white  dark:hover:bg-gray-100 "
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3 dark:text-black">Dashboard</span>
              </Link>
            </li>
            {/* <li className="side-bar-list">
              <Link
                to={"/home?game=casino"}
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  dark:text-black dark:hover:bg-gray-200 hover:text-center"
              >
                <MdCasino size={24} className="dark:text-black" />
                <span className="flex-1 ms-3 text-left rtl:text-right dark:text-black whitespace-nowrap ">
                  Live Casino
                </span>
              </Link>
            </li> */}
            <li className="side-bar-list">
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                onClick={() => {
                  const moneyDropdown =
                    document.getElementById("casino-dropdown");
                  moneyDropdown.classList.toggle("hidden");
                }}
              >
                <FaCoins size={20} className="dark:text-black" />

                <span className="flex-1 ms-3 text-left rtl:text-right dark:text-black whitespace-nowrap ">
                  Our Games
                </span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="casino-dropdown"
                className="hidden side-bar-drop-list animate-fade-down animate-duration-500  list-disc py-2 pl-4 space-y-2"
              >
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?game=color-game` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Color Play
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?game=mines` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Mines Game
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?game=wheel` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Wheel Game
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?game=casino` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Casino
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?game=limbo` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Limbo
                  </Link>
                </li>
              </ul>
            </li>
            <li className="side-bar-list">
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  dark:text-black dark:hover:bg-gray-200 hover:text-center"
                onClick={() => {
                  const moneyDropdown =
                    document.getElementById("events-dropdown");
                  moneyDropdown.classList.toggle("hidden");
                }}
              >
                <PiNetworkFill size={24} className="dark:text-black" />
                <span className="flex-1 ms-3 text-left rtl:text-right dark:text-black whitespace-nowrap ">
                  Events
                </span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="events-dropdown"
                className="hidden side-bar-drop-list animate-fade-down animate-duration-500  list-disc py-2 pl-4 space-y-2  "
              >
                <li className="ml-11  ">
                  <Link
                    to={{ pathname: "/home", search: `?event=inplay` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Inplay
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?event=cricket` }}
                    className={`${dropdownClassList} disabled`}
                    onClick={handleHideSideBar}
                  >
                    Cricket
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?event=football` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Football
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?event=tennis` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Tennis
                  </Link>
                </li>
              </ul>
            </li>

            {/* <li className="side-bar-list">
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                onClick={() => {
                  const moneyDropdown = document.getElementById(
                    "investment-dropdown"
                  );
                  moneyDropdown.classList.toggle("hidden");
                }}
              >
                <FaMoneyBillTransfer size={24} className="dark:text-black" />
                <span className="flex-1 ms-3 text-left rtl:text-right dark:text-black whitespace-nowrap ">
                  Investment
                </span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="investment-dropdown"
                className="hidden side-bar-drop-list animate-fade-down animate-duration-500  list-disc py-2 pl-2 space-y-2"
              >
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?investment=new-investment`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    New Investment
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?investment=investment-history`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Investment History
                  </Link>
                </li>
              </ul>
            </li> */}
            {/* <li className="side-bar-list">
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                onClick={() => {
                  const moneyDropdown =
                    document.getElementById("network-dropdown");
                  moneyDropdown.classList.toggle("hidden");
                }}
              >
                <PiNetworkFill size={24} className="dark:text-black" />
                <span className="flex-1 ms-3 text-left rtl:text-right dark:text-black whitespace-nowrap ">
                  Network
                </span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="network-dropdown"
                className="hidden side-bar-drop-list animate-fade-down animate-duration-500  list-disc py-2 pl-4 space-y-2"
              >
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?network=downline-member`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    My Downline Member
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?network=direct-downline`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Direct Downline
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?network=add-new-member`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Add New Member
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?network=member-tree&uid=${user?.uid}`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    My Member Tree
                  </Link>
                </li>
              </ul>
            </li> */}

            <li className="side-bar-list">
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                onClick={() => {
                  const moneyDropdown =
                    document.getElementById("money-dropdown");
                  moneyDropdown.classList.toggle("hidden");

                  const moneyInDropdown =
                    document.getElementById("money-in-dropdown");
                  moneyInDropdown.classList.add("hidden");

                  const moneyOutDropdown =
                    document.getElementById("money-out-dropdown");
                  moneyOutDropdown.classList.add("hidden");
                }}
              >
                <BsBank2 size={24} className="dark:text-black" />
                <span className="flex-1 ms-3 text-left rtl:text-right dark:text-black whitespace-nowrap ">
                  Money
                </span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="money-dropdown"
                className="hidden side-bar-drop-list animate-fade-down animate-duration-500  list-disc py-2 pl-2 space-y-2"
              >
                <li className="ml-11">
                  <button
                    onClick={() => {
                      const moneyDropdown =
                        document.getElementById("money-in-dropdown");
                      moneyDropdown.classList.toggle("hidden");
                    }}
                    className={`${dropdownClassList}`}
                  >
                    Money In
                  </button>
                </li>
                <ul
                  id="money-in-dropdown"
                  className="hidden side-bar-drop-list animate-fade-down animate-duration-500  list-square	 py-2 space-y-2 pl-4"
                >
                  <li>
                    <Link
                      to={{ pathname: "/home", search: `?money=usdt-deposit` }}
                      onClick={handleHideSideBar}
                      className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-6 group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                    >
                      - Money Deposit
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={{
                        pathname: "/home",
                        search: `?money=deposit-history`,
                      }}
                      onClick={handleHideSideBar}
                      className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-6 group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                    >
                      - Deposit History
                    </Link>
                  </li>
                </ul>
                <li className="ml-11">
                  <button
                    onClick={() => {
                      const moneyDropdown =
                        document.getElementById("money-out-dropdown");
                      moneyDropdown.classList.toggle("hidden");
                    }}
                    className={`${dropdownClassList}`}
                  >
                    Money Out
                  </button>
                </li>
                <ul
                  id="money-out-dropdown"
                  className="hidden side-bar-drop-list animate-fade-down animate-duration-500  list-square	 py-2 space-y-2 pl-4"
                >
                  <li>
                    <Link
                      to={{ pathname: "/home", search: `?money=withdrawal` }}
                      onClick={handleHideSideBar}
                      className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-6 group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                    >
                      - Withdrawal
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={{
                        pathname: "/home",
                        search: `?money=withdrawal-history`,
                      }}
                      onClick={handleHideSideBar}
                      className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-6 group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                    >
                      - Withdrawal History
                    </Link>
                  </li>
                </ul>
              </ul>
            </li>

            <li className="side-bar-list">
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                onClick={() => {
                  const moneyDropdown =
                    document.getElementById("account-dropdown");
                  moneyDropdown.classList.toggle("hidden");
                }}
              >
                <RiAccountCircleFill size={24} className="dark:text-black" />
                <span className="flex-1 ms-3 text-left rtl:text-right dark:text-black whitespace-nowrap ">
                  My Account
                </span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="account-dropdown"
                className=" hidden py-2 pl-2 list-disc	animate-fade-down animate-duration-500   space-y-2"
              >
                {/* <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?account=send-money` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Send Money
                  </Link>
                </li> */}
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?account=today-history` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Today History
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?account=account-history`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Account Statement
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?account=game-wallet-history`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Game Wallet
                  </Link>
                </li>
                {/* <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?account=bet-history`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Bet History
                  </Link>
                </li> */}
              </ul>
            </li>

            {/* <li className="side-bar-list">
              <button
                type="button"
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  dark:text-black dark:hover:bg-gray-300 hover:text-center"
                onClick={() => {
                  const moneyDropdown =
                    document.getElementById("income-dropdown");
                  moneyDropdown.classList.toggle("hidden");
                }}
              >
                <GiTakeMyMoney size={24} className="dark:text-black" />
                <span className="flex-1 ms-3 text-left rtl:text-right dark:text-black whitespace-nowrap ">
                  My Income
                </span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="income-dropdown"
                className=" hidden py-2 pl-2 list-disc	animate-fade-down animate-duration-500   space-y-2"
              >
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?income=matching-income`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Matching Income
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?income=refferer-income`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Referral income
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{
                      pathname: "/home",
                      search: `?income=level-income`,
                    }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    Level income
                  </Link>
                </li>
                <li className="ml-11">
                  <Link
                    to={{ pathname: "/home", search: `?income=roi-income` }}
                    className={`${dropdownClassList}`}
                    onClick={handleHideSideBar}
                  >
                    ROI Income
                  </Link>
                </li>
              </ul>
            </li> */}

            <li className="bg-[#ffb2b2] rounded-lg">
              <div
                onClick={handleLogout}
                className="flex items-center cursor-pointer p-2 text-gray-900 rounded-lg dark:text-white hover:bg-[#abbaff] dark:hover:bg-gray-700 group"
              >
                <IoLogOut size={26} className="dark:text-black" />
                <span className="flex-1 ms-3 dark:text-black whitespace-nowrap ">
                  Logout
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div
          onClick={() => {
            const sidebar = document.getElementById(
              "sidebar-multi-level-sidebar"
            );
            sidebar.classList.toggle("translate-x-0");
            sidebar.classList.toggle("-translate-x-full");
          }}
          className="flex-1  sm:hidden border-none"
        ></div>
      </aside>

      {/* bottom navigation in mobile */}
      <div className="md:hidden  fixed w-screen z-[99999]   bottom-0">
        <div className="fixed bottom-0 left-0 z-50 w-full h-16   border-t border-gray-200  bg-gradient-to-r from-blue-800 to-indigo-900 dark:border-gray-600">
          <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
            <Link
              to={{ pathname: "/home", search: `?dashboard` }}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <svg
                className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              <span className="text-sm text-gray-500 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-500">
                Home
              </span>
            </Link>
            <Link
              to={{ pathname: "/home", search: `?user=wallet` }}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <svg
                className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M11.074 4 8.442.408A.95.95 0 0 0 7.014.254L2.926 4h8.148ZM9 13v-1a4 4 0 0 1 4-4h6V6a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-2h-6a4 4 0 0 1-4-4Z" />
                <path d="M19 10h-6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Zm-4.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM12.62 4h2.78L12.539.41a1.086 1.086 0 1 0-1.7 1.352L12.62 4Z" />
              </svg>
              <span className="text-sm text-gray-500 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-500">
                Wallet
              </span>
            </Link>
            <Link
              to={{ pathname: "/home", search: "?user=VIP" }}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <RiVipDiamondFill
                className="text-[#6B7280] mb-2 dark:text-gray-100  dark:group-hover:text-blue-500"
                size={26}
              />
              <span className="text-sm text-gray-500 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-500">
                VIP
              </span>
            </Link>
            <Link
              to={{ pathname: "/home", search: "?user=refer" }}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <FaSackDollar
                className="text-[#6B7280] mb-2 dark:text-gray-100  dark:group-hover:text-blue-500"
                size={23}
              />
              <span className="text-sm text-gray-500 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-500">
                Refer
              </span>
            </Link>
            <Link
              to={{ pathname: "/home", search: `?user=investment` }}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <img
                alt="dfg"
                src={require("../assets/photos/earning (1).png")}
                className="w-8 mb-2"
              />
              <span className="text-sm text-gray-500 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-500">
                Invest
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-no-repeat bg-cover bg-fixed dark:bg-gray-900 m-auto">
        <div className="p-2 md:p-8 sm:ml-64  pb-24 md:pt-24   ">
          <InnerSection />
        </div>
      </div>

      {/* Create pin */}
      {user && user?.user_pin === "N" && <CreatePin />}

      {isWalletsOpen && (
        <div className="animate-fade-down animate-duration-500 fixed top-0 left-0 w-full h-full flex justify-center items-center pt-10  backdrop-blur-[4px]   z-[9999]">
          <div className=" text-white bg-gradient-to-r from-gray-700 rounded   to-slate-900 p-10 inline-block">
            <div className="flex gap-6 items-center">
              <section className="px-6 py-2 rounded border-2 border-white">
                <p className="text-white font-semibold text-center text-2xl">
                  Main Wallet
                </p>
                <p className="font-semibold text-xl text-center mt-2 pt-2 border-gray-400  text-white border-t-2">
                  ${Number(user.main_wallet).toFixed(2)}
                </p>
              </section>
              <section className="px-6 py-2 rounded border-2 border-white">
                <p className="text-white font-semibold text-center text-2xl">
                  Game Wallet
                </p>
                <p className="font-semibold text-xl text-center mt-2 pt-2 border-gray-400  text-white border-t-2">
                  ${Number(user.game_wallet).toFixed(2)}
                </p>
              </section>
            </div>
            <div className="flex gap-6 items-center justify-around mt-2">
              <button
                onClick={() => handleButtons(1)}
                className="px-6 py-2 rounded-full cursor-pointer bg-green-400"
              >
                <p className="text-white font-semibold flex justify-center items-center gap-2 text-center text-sm">
                  Transfer To Game
                  <FaArrowCircleRight size={20} />
                </p>
              </button>
              <button
                onClick={() => handleButtons(2)}
                className="px-6 py-2 rounded-full cursor-pointer bg-green-400"
              >
                <p className="text-white font-semibold flex justify-center items-center gap-2 text-center text-sm">
                  <FaArrowCircleLeft size={20} />
                  Transfer To Main
                </p>
              </button>
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
      {isOpen2 && (
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
                $
                {type === 1
                  ? Number(user.main_wallet).toFixed(2)
                  : Number(user.game_wallet).toFixed(2)}
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
              onClick={() => setIsOpen2(false)}
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
