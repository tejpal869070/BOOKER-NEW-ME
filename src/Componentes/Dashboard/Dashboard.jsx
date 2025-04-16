import React, { useEffect, useState } from "react";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaWallet, FaGoogleWallet } from "react-icons/fa";
import { PiHandWithdrawFill } from "react-icons/pi";
import { FaMoneyBills } from "react-icons/fa6";
import { GiWallet, GiMoneyStack } from "react-icons/gi";
import Hero1 from "./Hero1";
import { GetUserDetails } from "../../Controllers/User/UserController";
import { Loading3 } from "../Loading1";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
      setLoading(false);
    }
  };

  const data = [
    {
      id: 1,
      title: "Direct Members Count",
      value: user && user.direct_downline,
      link: "/home?network=direct-downline",
      icons: <BsFillPeopleFill size={20} />,
    },
    {
      id: 2,
      title: "My Investment",
      value: user && `$${user.my_investment || 0}`,
      link: "/home?investment=investment-history",
      icons: <FaWallet size={20} />,
    },
    {
      id: 3,
      title: "Total Withdrawal",
      value: user && `$${user.withdrawal || 0}`,
      link: "/home?money=withdrawal-history",
      icons: <PiHandWithdrawFill size={24} />,
    },
    {
      id: 3,
      title: "Total Deposit",
      value: user && `$${user.deposit || 0}`,
      link: "/home?money=deposit-history",
      icons: <PiHandWithdrawFill size={24} />,
    },
    {
      id: 4,
      title: "Total Members Downline",
      value: user && user.my_downline,
      link: "/home?network=downline-member",
      icons: <FaGoogleWallet size={22} />,
    },
    {
      id: 5,
      title: "Direct Income",
      value: user && `$${user?.reffer_to_amount || 0}`,
      link: "",
      icons: <FaMoneyBills size={24} />,
    },
    {
      id: 6,
      title: "ROI",
      value: user && `$${user?.roi_income || 0}`,
      link: "",
      icons: <GiWallet size={24} />,
    },
    {
      id: 7,
      title: "Matching Income",
      value: user && `$${user?.matching_income || 0}`,
      link: "",
      icons: <GiMoneyStack size={24} />,
    },
    {
      id: 3,
      title: "Total Business",
      value: "$0",
      link: "",
      icons: <PiHandWithdrawFill size={24} />,
    },
  ];

  useEffect(() => {
    userDataGet();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0   z-[9999] w-screen h-screen flex items-center justify-center m-auto inset-0">
        <Loading3 />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero1 />
      {/* <div className="w-full pb-10 overflow-hidden grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {data.map((item, index) => (
          <div
            key={index}
            className="mt-6 group w-[95%] h-[150px] rounded-[8px] bg-white dark:bg-gray-800 relative p-4 border-2 border-[#c3c6ce] transition duration-500 ease-out overflow-visible hover:border-[#008bf8] hover:shadow-lg"
          >
            <div className="text-black h-full gap-2 grid  ">
              <p className="text-2xl font-bold dark:text-gray-200">
                {item.icons}
              </p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {item.title}
              </p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {item.value}
              </p>
            </div>
            <Link
              to={item.link}
              className="text-center transform translate-x-[-50%] translate-y-[125%] w-[60%] rounded-[1rem] border-none bg-[#008bf8] text-white text-base py-2 px-4 absolute left-1/2 bottom-0 opacity-0 transition duration-300 ease-out group-hover:translate-y-[50%] group-hover:opacity-100"
            >
              View
            </Link>
          </div>
        ))}
      </div> */}
    </div>
  );
}
