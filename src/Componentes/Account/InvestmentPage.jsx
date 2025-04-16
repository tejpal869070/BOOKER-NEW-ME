import React, { useEffect, useState } from "react";
import cardBg from "../../assets/photos/vip4bg.jpg";
import {
  GetUserDetails,
  MyInvestMentHistory,
} from "../../Controllers/User/UserController";
import { Loading3 } from "../Loading1";
import { Link } from "react-router-dom";
import bg2 from "../../assets/photos/offerbg.jpg";

export default function InvestmentPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  const GetHistory = async () => {
    const response = await MyInvestMentHistory();
    return response !== null ? response : [];
  };

  const userGet = async () => {
    const response = await GetUserDetails();
    return response !== null ? response[0] : {};
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [historyData, userData] = await Promise.all([
          GetHistory(),
          userGet(),
        ]);
        setData(historyData);
        setUser(userData);
      } catch (error) { 
        setData([]);
        setUser({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className=" fixed flex top-0 left-0 justify-center items-center  h-screen w-screen bg-opacity-50 z-[9999]">
        <Loading3 />
      </div>
    );
  }
  return (
    <div className="min-h-screen relative">
      <div className="absolute top-0 w-full h-[25vh]   rounded-b-[90px] backdrop-blur-[2px] bg-indigo-200/30 z-[1]" />
      <div className="relative z-[99]">
        <h1 className="text-2xl text-gray-200 font-semibold text-center">
          Investment
        </h1>
        <div className="w-full   px-2 py-2 ">
          <div className="flex    gap-4 mt-6 bg-gradient-to-r from-blue-200 to-cyan-200 py-4 px-2 rounded">
            <img
              alt="use"
              className="w-12 h-12 p-1 backdrop-blur-md shadow bg-white/30 rounded-full"
              src={require("../../assets/photos/boy.png")}
            />

            <div>
              <p className="border-dotted border-b-2 border-gray-700 text-gray-800 text-xs italic">
                Total Investment
              </p>
              <p className="text-3xl font-bold text-[#06b713] mt-1">
                ${user?.my_investment || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center px-2  py-2">
          <section className="rounded-md bg-white/30 backdrop-blur-md w-[45%] text-center py-4 px-2">
            <p className="text-gray-300 font-medium text-sm">Total Income</p>
            <p className=" text-2xl mt-1 font-semibold text-gray-200">
              ${user?.roi_income}
            </p>
          </section>
          <section className="rounded-md bg-white/30 backdrop-blur-md w-[45%] text-center py-4 px-2">
            <p className="text-gray-300 font-medium text-sm">
              Yesterday Income
            </p>
            <p className=" text-2xl mt-1 font-semibold text-gray-200">${user?.yesterday_return}</p>
          </section>
        </div>
      </div>

      <div className="px-2 mt-4 pb-20">
        <h1 className=" text-gray-200 text-lg ">My Investments -</h1>
        {data &&
          data.map((item, index) => (
            <div
              key={index}
              className="rounded-md px-2 py-3  mb-2 bg-cover backdrop-blur-[2px] bg-black/30"
              style={{ backgroundImage: `url(${cardBg})` }}
            >
              <p className="text-sm font-bold ">{item.plan_name}</p>
              <p className="text-3xl font-bold text-[#0a9715]">
                ${item.amount}
              </p>
              <div className="flex justify-between text-gray-700 font-medium mt-2 ">
                <p>Till Payout</p>
                <p>${Number(item.total_return_amount).toFixed(3)}</p>
              </div>
              <div className="flex justify-between  text-gray-700 font-medium">
                <p>Start</p>
                <p>{item.date.split("T")[0]}</p>
              </div>
              <div className="flex justify-between text-gray-700 font-medium">
                <p>Payout Date</p>
                <p>
                  {(() => {
                    const parsedDate = new Date(item.date);
                    const daysToAdd =
                      (Number(item.amount) * 2) /
                      ((Number(item.amount) * Number(item.retrun_percentage)) /
                        100);
                    parsedDate.setDate(
                      parsedDate.getDate() + Math.floor(daysToAdd)
                    );
                    return parsedDate.toISOString().split("T")[0];
                  })()}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* button */} 
      <Link
        to={"/home?investment=new-investment"}
        className={`w-full rounded-t-3xl text-center bg-center inline-block  bg-gray-200  fixed bottom-16 left-0 text-2xl  font-bold italic ${
          data?.length === 0 ? "py-16" : "py-2"
        }`}
        style={{ backgroundImage: `url(${bg2})` }}
      >
        <p className="animate-jump-in bg-gradient-to-r text-center from-indigo-800 to-indigo-700 bg-clip-text text-transparent">
          Make New Investment
        </p>
      </Link>
    </div>
  );
}
