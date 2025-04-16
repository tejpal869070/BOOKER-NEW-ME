import React, { useEffect, useState } from "react";
import { GetUserDetails } from "../../Controllers/User/UserController";
import { Loading1, Loading3 } from "../Loading1";
import ThemeToggle from "../../Controllers/ThemeToggle";
import { FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";
 import { ToastContainer, toast } from "react-toastify";import 'react-toastify/dist/ReactToastify.css';
import { FaWallet } from "react-icons/fa";
import { BsWalletFill } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";

export default function UserProfile() {
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");

  const [isCopied1, setIsCopied1] = useState(false);
  const [isCopied2, setIsCopied2] = useState(false);

  const handleCopy = () => {
    toast("Link copied. Share with your friends", {
      position: "top-center",
    });
    setIsCopied1(true);
    setTimeout(function () {
      setIsCopied1(false);
    }, 2000);
  };

  const handleCopy2 = () => {
    toast("Link copied. Share with your friends", {
      position: "top-center",
    });
    setIsCopied2(true);
    setTimeout(function () {
      setIsCopied2(false);
    }, 2000);
  };

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
      setUrl(
        `${window.location.origin}/register?referrer_code=${response[0].reffer_code}`
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    userDataGet();
  }, []);

  const handleLogout = async () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("mobile");
    sessionStorage.removeItem("userDetails");
    window.location.href = "/";
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center m-auto inset-0">
        <Loading3 />
      </div>
    );
  }

  return (
    <div className="dark:bg-black min:h-screen px-2 pb-40">
      <ToastContainer />
      <div className="   ">
        <div className="rounded-lg      pt-8 pb-10 shadow-lg">
          <div className="flex gap-4">
            <div className="relative     rounded-full">
              <span className="absolute right-0 m-3 h-3 w-3 rounded-full bg-green-500 ring-2 ring-green-300 ring-offset-2"></span>
              <img
                className="mx-auto h-auto w-20 rounded-full"
                src={require("../../assets/photos/avatar.png")}
                alt=""
              />
            </div>
            <div>
              <h1 className="my-1  text-xl font-bold leading-8 text-gray-900 dark:text-gray-200">
                {user && user.uname}
              </h1>
              <h3 className="font-lg text-semibold  leading-6 text-gray-600 dark:text-gray-300">
                {user && user.email}
              </h3>
              <h3 className="font-lg text-semibold  leading-6 text-gray-600 dark:text-gray-300">
                {user && user.mobile}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap   mt-6 rounded bg-gray-100 dark:bg-gray-600 py-2  ">
            {links.map((item, index) => (
              <Link
                key={index}
                to={item.linkTo}
                className="w-1/4  backdrop-blur-sm flex flex-col gap-1  p-2 pt-2 rounded-lg flex   items-center   "
              >
                <p className="p-2 dark:bg-gray-500 rounded-lg shadow-lg">
                  {item.icons}
                </p>
                <p className=" text-sm text-gray-500 dark:text-gray-200 text-center">
                  {item.label}
                </p>
              </Link>
            ))}
          </div>

           

          <ul className="mt-3 divide-y rounded bg-gray-100 dark:bg-gray-600 py-2 px-3 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow">
            <li className="flex items-center py-3 text-sm">
              <span className="text-gray-800 dark:text-gray-300 font-semibold">
                Status
              </span>
              <span className="ml-auto">
                <span className="rounded-full bg-green-200 py-1 px-2 text-xs font-medium text-green-700">
                  Active
                </span>
              </span>
            </li>
            <li className="flex items-center py-3 text-sm">
              <span className="text-gray-800 dark:text-gray-300 font-semibold">
                Refer Code
              </span>
              <span className="ml-auto dark:text-gray-200 font-semibold">
                {user.reffer_code}
              </span>
            </li>
            <li className="flex items-center py-3 text-sm">
              <span className="text-gray-800 dark:text-gray-300 font-semibold">
                Joined On
              </span>
              <span className="ml-auto dark:text-gray-200 font-semibold">
                {user && user.date.split("T")[0]}
              </span>
            </li>
            <li className="flex items-center py-3 text-sm">
              <span className="text-gray-800 dark:text-gray-300 font-semibold">
                Theme
              </span>
              <span className="ml-auto dark:text-gray-200 font-semibold">
                <ThemeToggle />
              </span>
            </li>
          </ul>

          <ul className="mt-3 divide-y rounded bg-gray-100 dark:bg-gray-600 py-2 px-3 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow">
            <Link
              to={"/home?network=downline-member"}
              className="flex items-center py-3 text-lg"
            >
              <span className="text-gray-800 dark:text-gray-300 font-semibold">
                Downline Member
              </span>
              <span className="ml-auto flex items-center justify-center gap-2 dark:text-gray-200 font-semibold">
                {user.my_downline} <FaAngleRight />
              </span>
            </Link>
            <Link
              to={"/home?network=direct-downline"}
              className="flex items-center py-3 text-lg"
            >
              <span className="text-gray-800 dark:text-gray-300 font-semibold">
                Direct Downline
              </span>
              <span className="ml-auto flex items-center justify-center gap-2 dark:text-gray-200 font-semibold">
                {user.direct_downline} <FaAngleRight />
              </span>
            </Link>
            <Link
              to={"/home?income=level-income"}
              className="flex items-center py-3 text-lg"
            >
              <span className="text-gray-800 dark:text-gray-300 font-semibold">
                Level Income
              </span>
              <span className="ml-auto flex items-center justify-center gap-2 dark:text-gray-200 font-semibold">
                <FaAngleRight />
              </span>
            </Link>
            <Link
              to={{
                pathname: "/home",
                search: `?network=member-tree&uid=${user?.uid}`,
              }}
              className="flex items-center py-3 text-lg"
            >
              <span className="text-gray-800 dark:text-gray-300 font-semibold">
                Member Tree
              </span>
              <span className="ml-auto dark:text-gray-200 font-semibold">
                {" "}
                <FaAngleRight />
              </span>
            </Link>
            <Link
              to={"/change-password"}
              className="flex items-center py-3 text-lg"
            >
              <span className="text-gray-800 dark:text-gray-300 font-semibold">
                Change Password
              </span>
              <span className="ml-auto dark:text-gray-200 font-semibold">
                {" "}
                <FaAngleRight />
              </span>
            </Link>
            <Link
              to={{ pathname: "/home", search: "?change=securityPin" }}
              className="flex items-center py-3 text-lg"
            >
              <span className="text-gray-800 dark:text-gray-300 font-semibold">
                Change PIN
              </span>
              <span className="ml-auto dark:text-gray-200 font-semibold">
                {" "}
                <FaAngleRight />
              </span>
            </Link>
          </ul>

          <button
            onClick={handleLogout}
            className="w-full text-center font-semibold bg-red-500 mt-3 rounded-sm  py-2"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}

const links = [
  {
    label: "Wallet",
    icons: <FaWallet size={26} className="dark:text-white" />,
    linkTo: "/home?user=wallet",
  },
  {
    label: "Investment",
    icons: <BsWalletFill size={26} className="dark:text-white" />,
    linkTo: "/home?investment=new-investment",
  },
  {
    label: "My Team",
    icons: <FaUserFriends size={26} className="dark:text-white" />,
    linkTo: "/home?network=direct-downline",
  },
  {
    label: "Add in Team",
    icons: <FaUserPlus size={26} className="dark:text-white" />,
    linkTo: "/home?network=add-new-member",
  },
];
