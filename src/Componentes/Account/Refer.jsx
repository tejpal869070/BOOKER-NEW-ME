import React, { useEffect, useState } from "react";
import img1 from "../../assets/photos/refer-bg-1.png";
import banner1 from "../../assets/photos/refer-banner-1.png";
import refertcimg from "../../assets/photos/refer-tc.png";
import { GetUserDetails } from "../../Controllers/User/UserController";
import { Loading3 } from "../Loading1";
import { Link } from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast, ToastContainer } from "react-toastify";
import { FaCopy } from "react-icons/fa6";

export default function Refer() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [isCopied1, setIsCopied1] = useState(false);
  const [isCopied2, setIsCopied2] = useState(false);
  const [url, setUrl] = useState("");
  const [totalEarnings, setTotalEarnings] = useState(0);

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
      setUrl(
        `${window.location.origin}/register?referrer_code=${response[0].reffer_code}`
      );
      const referIncome = Number(response[0].reffer_to_amount); // usdt
      const matching_income =  Number(response[0].matching_income); // usdt
      const level_income =  Number(response[0].level_income)  // usdt
      setTotalEarnings(referIncome + matching_income + level_income);
      setLoading(false);
    }
  };

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

  const handleCopy3 = () => {
    toast("Code copied. Share with your friends", {
      position: "top-center",
    });
  };

  useEffect(() => {
    userDataGet();
  }, []);

  const links = [
    {
      label: "Direct Downline",
      url: "/home?network=direct-downline",
      icon: require("../../assets/photos/user.png"),
    },
    {
      label: "Downline Members",
      url: "/home?network=downline-member",
      icon: require("../../assets/photos/group-users.png"),
    },
    {
      label: "Add New Member",
      url: "/home?network=add-new-member",
      icon: require("../../assets/photos/add-friend.png"),
    },
    {
      label: "Member Tree",
      url: `/home?network=member-tree&uid=${user?.uid}`,
      icon: require("../../assets/photos/tree.png"),
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className=" top-0 flex justify-center items-center w-screen h-screen">
        <Loading3 />
      </div>
    );
  }

  return (
    <div className="md:max-w-sm m-auto">
      <ToastContainer />
      <div className="relative">
        <img src={img1} alt="poster" className="w-full" />
        <p className="absolute w-full bottom-0 backdrop-blur-sm bg-white/30 text-xs font-semibold italic   rounded my-1 text-center py-0.5 flex items-center gap-1 justify-center">
          Referral Code: {user && user.reffer_code}{" "}
          <CopyToClipboard text={user?.reffer_code} onCopy={handleCopy3}>
            <FaCopy className="cursor-pointer  " />
          </CopyToClipboard>
        </p>
      </div>
      <section className="relative flex p-2 rounded bg-gradient-to-r from-red-400 to-pink-500">
        <div className="w-1/2 rounded-l-md border border-r-0 rounded-r-0 border-indigo-500 flex flex-col items-center bg-gradient-to-r from-purple-500 to-purple-900">
          <h1 className="text-gray-800 font-semibold text-xs italic text-center px-4 py-1 bg-indigo-100 rounded-b-lg inline-block m-auto rounded-t-0 ">
            TOTAL REFERRALS
          </h1>
          <p className="font-semibold text-gray-100 text-center text-2xl mt-1">
            {user && user.direct_downline}
          </p>
        </div>
        <div className="w-1/2 rounded-r-md border border-l-0 rounded-l-0 border-indigo-500 flex flex-col items-center bg-gradient-to-r from-purple-500 to-purple-900">
          <h1 className="text-gray-800 font-semibold text-xs italic text-center px-4 py-1 bg-indigo-100 rounded-b-lg inline-block m-auto rounded-t-0 ">
            TOTAL EARNINGS
          </h1>
          <p className="font-semibold text-gray-100 text-center text-2xl mt-1">
            ${Number(totalEarnings).toFixed(2) || 0}
          </p>
        </div>
      </section>

      {/* <p className="text-xs font-semibold italic bg-[#b4e4fd] rounded my-1 text-center pt-0.5 flex items-center gap-1 justify-center">
        Referral Code: {user && user.reffer_code}{" "}
        <CopyToClipboard text={user?.reffer_code} onCopy={handleCopy3}>
          <FaCopy className="cursor-pointer  " />
        </CopyToClipboard>
      </p> */}

      <div className="flex justift-around gap-[3%] items-center  py-2 ">
        <CopyToClipboard
          text={`${url}&position=L`}
          onCopy={handleCopy}
          className={`w-[97%] rounded py-2 text-center font-semibold text-gray-100     ${
            isCopied1
              ? "bg-[green]"
              : "bg-gradient-to-r from-indigo-400 to-cyan-400"
          }`}
        >
          <button> {isCopied1 ? "Copied" : "Copy Left Position"} </button>
        </CopyToClipboard>
        <CopyToClipboard
          text={`${url}&position=R`}
          onCopy={handleCopy2}
          className={`w-[97%] rounded py-2 text-center font-semibold text-gray-100     ${
            isCopied2
              ? "bg-[green]"
              : "bg-gradient-to-r from-indigo-400 to-cyan-400"
          }`}
        >
          <button> {isCopied2 ? "Copied" : "Copy Right Position"} </button>
        </CopyToClipboard>
      </div>

      <section className="p-2 bg-gradient-to-b from-sky-400 to-sky-200 rounded mt-1">
        <div className="w-full m-auto   flex gap-[2%] justify-arround items-center">
          {links.map((item, index) => (
            <Link
              to={item.url}
              className="flex flex-col w-[23%] min-h-[90px] justify-center items-center p-1 block text-center backdrop-blur-md bg-white/30 rounded-md "
              key={index}
            >
              <img className="w-8" alt="icon" src={item.icon} />
              <p className="text-center text-gray-700 leading-[17px] text-sm mt-1 font-semibold break-normal">
                {item.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="">
        {/* <h1 className="text-center px-2 py-1 text-gray-100 font-semibold text-xl">Income Details</h1> */}
        <img alt="banner" className="" src={banner1} />
        <section className="p-2 bg-gradient-to-r from-green-200 to-blue-500 pt-12 -mt-10 rounded-lg">
          <div className="flex bg-gradient-to-tl from-amber-500 to-yellow-400">
            <p className="text-sm font-semibold  py-1 text-gray-900 italic w-1/2 text-center border-r-2 border-indigo-500">
              Level
            </p>
            <p className="text-sm font-semibold  py-1 text-gray-900 italic w-1/2 text-center">
              Income
            </p>
          </div>
          {incomeDetail.map((item, index) => (
            <div className="flex border-b-[1px] border-gray-500">
              <p className="text-sm font-semibold bg-gray-100 py-1 text-gray-900 w-1/2 text-center border-r-2 border-indigo-500">
                {item.level}
              </p>
              <p className="text-sm font-semibold bg-gray-100 py-1 text-gray-900 w-1/2 text-center">
                {item.income}
              </p>
            </div>
          ))}
        </section>
      </div>

      <div className="mt-6">
        <img alt="sdf" src={refertcimg} className="" />
        <p className="text-sm font-semibold text-justify text-gray-200 p-2">
          When you refer a friend and they make their first deposit, you will
          receive a referral bonus. Additionally, level-based income will be
          determined by the investments of your downline members, as outlined in
          the provided chart.
        </p>
        <h1 className="font-semibold text-xl text-green-500 p-2">
          Direct Downline :-
        </h1>
        <p className="text-sm font-semibold text-justify text-gray-200 p-2 pt-0">
          When you refer a friend and they make their first deposit, you will
          receive a referral bonus.
        </p>
        <h1 className="font-semibold text-xl text-green-500 p-2">
          My Downline Members :-
        </h1>
        <p className="text-sm font-semibold text-justify text-gray-200 p-2 pt-0">
          When your referred member invites someone new, you will earn a
          commission based on the investment made by the newly referred member.
        </p>

        <h1 className="font-semibold text-xl text-green-500 p-2">
          Matching Income :-
        </h1>
        <p className="text-sm font-semibold text-justify text-gray-200 p-2 pt-0">
          When you refer members to both the left and right positions, and they
          purchase the same investment plan with id, you will receive a
          commission based on that investment plan.
        </p>
      </div>
    </div>
  );
}

const incomeDetail = [
  { level: "Level 1", income: "5%" },
  { level: "Level 2", income: "3%" },
  { level: "Level 3", income: "2%" },
  { level: "Level 4", income: "2%" },
  { level: "Level 5", income: "1%" },
];
