import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import ProgressBar from "@ramonak/react-progress-bar";
import { FaCrown } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import {
  ClaimReward,
  GetAccountAllStatement,
  GetUserDetails,
  GetVipPlans,
} from "../../Controllers/User/UserController";
import { API } from "../../Controllers/Api";
import { Loading1, Loading3 } from "../Loading1";
import bg1 from "../../assets/photos/viptopbg.jpg";
import { toast } from "react-toastify";

export default function VIP() {
  const [tab, setTab] = useState(1);
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [claimming, setClaimming] = useState(false);
  const [rewardedAmount, setRewarededAmount] = useState(0);
  const [isSuccess, setSuccess] = useState(false);
  const [history, setHistory] = useState([]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 1000,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },

      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const getVipPlans = async () => {
    try {
      const response = await GetVipPlans();
      if (response && response.status) {
        setPlans(response.data);
      }
    } catch (error) {
      window.alert("Server Error. Try Again !");
    }
  };

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
      setLoading(false);
    }
  };

  const RewardClaimFunction = async (type) => {
    setClaimming(true);
    try {
      const response = await ClaimReward(type);
      setRewarededAmount(Number(response));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        getAllStatement();
      }, 1500);
      userDataGet();
    } catch (error) {
      toast.info(error?.response?.data?.message || "server error");
    } finally {
      setClaimming(false);
    }
  };

  const formData = {
    type: "VIP",
  };
  const getAllStatement = async () => {
    try {
      const response = await GetAccountAllStatement(formData);
      if (response.status) {
        setHistory(response?.data?.reverse());
        setLoading(false);
      } else {
        window.alert("Something Went Wrong.");
        setHistory([]);
        setLoading(false);
      }
    } catch (error) {
      window.alert("Something Went Wrong.");
      setHistory([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    getVipPlans();
    userDataGet();
    getAllStatement();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
        <Loading3 />
      </div>
    );
  }

  return (
    <div className="mb-10   pb-10">
      {user?.vip_id !== 0 && (
        <div
          className="rounded py-3 mb-4 border border-gray-700 text-center font-bold text-2xl text-green-500"
          style={{
            backgroundImage: `url(${bg1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <p className="">
            You are a{" "}
            <span class="relative whitespace-nowrap text-orange-400">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                class="absolute top-2/3 left-0 h-[0.58em] w-full fill-orange-300/70"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path>
              </svg>
              <span class="relative">
                {plans && plans?.find((i) => i.id === user.vip_id)?.title}
              </span>
            </span>{" "}
            level user
          </p>
        </div>
      )}
      <Slider {...settings}>
        {plans.map((item, index) => (
          <div
            className="relative px-2 bg-gray-500 rounded-md border-gray-100 border-x-2 border-y-0 pt-2 pb-2"
            key={index}
          >
            <img
              className="w-[95%] h-[12rem] lg:h-40 rounded-lg  absolute top-2"
              src={API.url + "assets/img/" + item.bgimage}
              alt="baner"
            />
            <div className="relative px-6 py-4 text-white z-[1000] ">
              <h1 className="text-3xl lg:text-xl font-bold flex items-center gap-2">
                <FaCrown />
                {item.title}
              </h1>
              <p className="font-normal text-sm lg:text-xs">
                Upgrading to {item.title} requires{" "}
              </p>
              <p className="font-semibold text-xl lg:text-lg">
                ${item.minimumrebetamount} Amount
              </p>
              <p className="text-right text-xs mr-2  mt-4 lg:mt-0">
                {item.title}
              </p>
              <ProgressBar
                completed={Math.max(
                  0,
                  Math.min(
                    (Number(user?.wagering).toFixed(2) /
                      Number(item.minimumrebetamount)) *
                      100,
                    100
                  ).toFixed(2)
                )}
                maxCompleted={100}
                height="15px"
                labelSize="11px"
                className="border-2 rounded-full shadow-md"
              />

              {/* <ProgressBar
                completed={500 /1000 * 100}
                maxCompleted={100}
                height="15px"
                labelSize="11px"
                className=""
              /> */}
              <div className="flex justify-between mt-1.5">
                <p className="text-sm lg:text-[10px] rounded-xl flex items-center justify-center font-medium px-3  bg-gradient-to-r from-blue-200 to-cyan-200 text-gray-700">
                  {/* {user?.wagering}/{item.minimumrebetamount} */}
                  {Number(user?.wagering) >= Number(item.minimumrebetamount) ? (
                    <MdVerified size={20} color="green" />
                  ) : (
                    `${Number(user?.wagering).toFixed(2)}/${
                      item.minimumrebetamount
                    }`
                  )}
                </p>
                <p className="text-sm lg:text-[12px]">
                  {Number(item.minimumrebetamount) - Number(user?.wagering) > 0
                    ? `Require $ ${(
                        Number(item.minimumrebetamount) - Number(user?.wagering)
                      ).toFixed(2)} `
                    : "Upgraded"}
                </p>
              </div>
            </div>
            <div className="relative   bg-gray-900 rounded w-[98%]  m-auto">
              <div className="mt-6">
                <ul>
                  <li className="flex gap-2 py-2 px-2">
                    <div className="flex justify-center items-center p-2 rounded-xl border shadow-lg">
                      <img
                        alt="icons"
                        src={require("../../assets/photos/giftbox.png")}
                        className="w-12"
                      />
                    </div>
                    <div className="flex flex-col  justify-center font-medium  text-gray-300 text-md lg:text-sm">
                      <p>
                        Level Up Reward{" "}
                        <span className="text-[green] bg-gray-200 px-2 rounded-lg">
                          ${item.levelreward}
                        </span>
                      </p>
                      <p>Will receive only 1 time</p>
                    </div>
                  </li>
                  <li className="flex gap-2 py-2 px-2">
                    <div className="flex justify-center items-center p-2 rounded-xl border shadow-lg">
                      <img
                        alt="icons"
                        src={require("../../assets/photos/premium-quality.png")}
                        className="w-12"
                      />
                    </div>
                    <div className="flex flex-col  justify-center font-medium  text-gray-300 text-md lg:text-sm">
                      <p>
                        Monthly Reward{" "}
                        <span className="text-[green] bg-gray-200 px-2 rounded-lg">
                          {item.monthyreward}%
                        </span>
                      </p>
                      <p>Will receive on 1st of every month</p>
                    </div>
                  </li>
                  <li className="flex gap-2 py-2 px-2">
                    <div className="flex justify-center items-center p-2 rounded-xl border shadow-lg">
                      <img
                        alt="icons"
                        src={require("../../assets/photos/telegram.png")}
                        className="w-12"
                      />
                    </div>
                    <div className="flex flex-col  justify-center font-medium  text-gray-300 text-md lg:text-sm">
                      <p>Premium Telegram</p>
                      <p>Membership</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {user?.vip_id !== 0 && (
        <div className="max-w-xl flex justify-center mt-6 m-auto">
          <div className="rounded   w-[48%] bg-gray-200 p-1">
            <img
              alt="phihs"
              className="w-full rounded"
              src={require("../../assets/photos/reward.jpg")}
            />
            <p className="text-md font-medium text-red-500">Level Up Reward</p>
            <p className="text-xs font-medium text-gray-600">
              Each account can only receive 1 time.
            </p>
            {user?.is_levelup_claimed === "Y" ? (
              <button
                onClick={() => RewardClaimFunction("levelup")}
                disabled={claimming}
                className="w-full rounded-full bg-green-500 mt-2 text-gray-100 font-semibold py-1"
              >
                Claim
              </button>
            ) : (
              <p className="w-full text-center rounded-full bg-green-500 mt-2 text-gray-100 font-semibold py-1">
                Received
              </p>
            )}
          </div>
          {/* <div className="rounded   w-[48%] bg-gray-200 p-1">
            <img
              alt="phihs"
              className="w-full rounded"
              src={require("../../assets/photos/reward2.jpg")}
            />
            <p className="text-md font-medium text-red-500">Monthly Reward</p>
            <p className="text-xs font-medium text-gray-600">
              Each account can only receive 1 time per month.
            </p>
            {user?.is_monthly_rewarded === "Y" ? (
              <button
                onClick={() => RewardClaimFunction("monthly")}
                disabled={claimming}
                className="w-full rounded-full bg-green-500 mt-2 text-gray-100 font-semibold py-1"
              >
                Claim
              </button>
            ) : (
              <div className="w-full text-center rounded-full bg-green-500 mt-2 text-gray-100 font-semibold py-1">
                Received
              </div>
            )}
          </div> */}
        </div>
      )}

      <div className="relative mt-4  w-full flex bg-indigo-400 rounded px-2 lg:px-4 py-6">
        <button
          onClick={() => setTab(1)}
          className={`w-1/2 text-center dark:text-gray-200 py-3 ${
            tab === 1
              ? "border border-b-0 rounded-t-lg"
              : "border-b-4 border-skyblue-800"
          }`}
        >
          History
        </button>
        <button
          onClick={() => setTab(2)}
          className={`w-1/2 text-center dark:text-gray-200 py-3 ${
            tab === 2
              ? "border border-b-0 rounded-t-lg"
              : "border-b-4 border-skyblue-800"
          }`}
        >
          Rules
        </button>
      </div>

      {tab === 1 ? (
        data.length === 0 ? (
          <div>
            <img
              aria-label="empty"
              src={require("../../assets/photos/empty-box.png")}
              className="m-auto w-40"
            />
            <p className="text-center dark:text-gray-200">No Record Found</p>
          </div>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-2 py-3">
                    S.No
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {history &&
                  history?.map((item, index) => (
                    <tr
                      key={index}
                      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-2 py-3 font-medium text-gray-900 whitespace-nowrap  dark:text-white"
                      >
                        {index + 1}.
                      </th>
                      <td className="whitespace-nowrap px-4 py-3 ">
                        ${item.amount}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">
                        {item.type}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">
                        {item.date.split("T")[0]}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        rules.map((item, index) => (
          <div key={index} className="px-4 rounded bg-indigo-400 mt-2 py-3">
            <p className="text-center px-4 bg-red-400 rounded-t-md py-1 text-gray-200 font-medium">
              {item.name}
            </p>
            <p className="text-justify dark:text-gray-700 mt-1">
              {item.description}
            </p>
          </div>
        ))
      )}

      {isSuccess && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-md z-[99] flex  justify-center items-center">
          <div className="p-6 rounded bg-white/50 flex flex-col  justify-center items-center animate-jump-in">
            <img
              alt="fig"
              src={require("../../assets/photos/verifiedgif.gif")}
              className="w-20 m-auto"
            />
            <p className="text-xl font-bold text-gray-700">Congratulation </p>
            <p className="text-3xl mt-2 font-bold text-[#20e701]">
              ${rewardedAmount}{" "}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const data = [
  {
    id: 1,
    amount: 100,
    type: "Monthly Reward",
    date: "2024-12-01",
  },
  {
    id: 2,
    amount: 200,
    type: "Level Up Reward",
    date: "2024-12-04",
  },
];

const rules = [
  {
    id: 1,
    name: "Upgrade Bonus",
    description:
      "The upgrade benefits can be claimed on the VIP page after the member reaches the VIP membership level, and each VIP member can only get the upgrade reward of each level once.",
  },
  {
    id: 2,
    name: "Monthly Reward",
    description:
      "VIP members can earn the highest level of VIP rewards once a month.Can only be received once a month. Prizes cannot be accumulated. And any unclaimed rewards will be refreshed on the next settlement day. When receiving the highest level of monthly rewards this month Monthly Rewards earned in this month will be deducted e.g.",
  },
];
