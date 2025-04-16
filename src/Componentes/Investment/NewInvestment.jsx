import React, { useEffect, useState } from "react";
import ViewPlans from "./ViewPlans";
import {
  GetInvestmentPlans,
  GetUserDetails,
  MakeNewInvestment,
} from "../../Controllers/User/UserController";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loading1 } from "../Loading1";
import gif1 from "../../assets/photos/growwealthgif.gif";
import VerifyPin from "../VerifyPin";
import { BiSolidDollarCircle } from "react-icons/bi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function NewInvestment() {
  const [isOpen, setIsOpen] = useState(false);
  const [PlansData, setPlansData] = useState([]);
  const [user, setUser] = useState({});
  const [amount, setAmount] = useState(50);
  const [investmentPlan, setInvestmentPlan] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verifyPinPopup, setVerifyPinPop] = useState(false);
  const [retrunPercentage, setReturnPercentage] = useState(0);
  const [payoutDays, setPayoutDays] = useState(0);

  const [instructionOpen, setInstructionOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const onclose2 = () => {
    setVerifyPinPop(false);
  };

  const successFunction = async (pin) => {
    formData.pin = pin;
    handleForm();
  };

  const formData = {
    amount: amount,
  };

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
    }
  };

  const GetAllPlans = async () => {
    const response = await GetInvestmentPlans();
    if (response !== null) {
      setPlansData(response);
      setInvestmentPlan(response[0].id);
    } else {
      setPlansData([]);
    }
  };

  const handleForm = async () => {
    setLoading(true);
    if (investmentPlan < 0) {
      toast.error("Invalid investment plan");
      setLoading(false);
      return;
    } else if (amount > user && user.wallet_balance) {
      toast.error("Insufficient balance", {
        autoClose: 2000,
      });
      setLoading(false);
      return;
    } else if (amount < 1) {
      toast.error("Minimum Amount is Rs.100", {
        autoClose: 2000,
      });
      setLoading(false);
      return;
    }
    try {
      const response = await MakeNewInvestment(formData);
      if (response.status) {
        setSuccess(true);
        setLoading(false);
        setInvestmentPlan(PlansData[0].id);
        userDataGet();
        setAmount(10);
      } else {
        toast.error(response.response.data.message);
        setLoading(false);
      }
    } catch (error) {
      if (error.response.status === 302) {
        toast.error(error.response.data.message, {
          autoClose: 2000,
        });
        setLoading(false);
      } else {
        toast.error("Something Went Wrong. Server Error !", {
          autoClose: 2000,
        });
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    GetAllPlans();
  }, []);

  useEffect(() => {
    userDataGet();
  }, []);

  useEffect(() => {
    let planDevisionByAmount = [];
    PlansData.forEach((i) => planDevisionByAmount.push(i.amount_end));
    if (amount) {
      const selectedPlan = planDevisionByAmount.findIndex(
        (i) => Number(amount) <= Number(i)
      );
      if (selectedPlan !== -1) {
        setInvestmentPlan(PlansData[selectedPlan].id);
        setReturnPercentage(PlansData[selectedPlan].retrun_percentage);
        setPayoutDays(
          (Number(amount) * 2) /
            ((Number(amount) *
              Number(PlansData[selectedPlan].retrun_percentage)) /
              100)
        );
      } else {
        setReturnPercentage(0);
        setPayoutDays(0);
      }
    }
  }, [amount, PlansData]);

  useEffect(() => {
    if (amount) {
      return;
    }
    setAmount(Number(PlansData[investmentPlan - 1]?.amount_start) || 10);
  }, [investmentPlan, PlansData]);

  return (
    <div>
      <ToastContainer />

      <div className=" max-w-7xl    justify-center  min-h-screen">
        <div className="bg-[#e1e6ff] text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden">
          <div className="md:flex flex-row-reverse w-full">
            <div className=" w-full md:w-1/2 bg-indigo-500 py-10 px-10">
              <img alt="animation" className="w-full h-full " src={gif1} />
            </div>
            <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
              <div className="text-center mb-6">
                <h1 className="font-bold text-3xl text-gray-900">
                  NEW INVESTMENT
                </h1>
                <p className="font-semibold italic text-xs">
                  Let Your Money Work for You.
                </p>
              </div>
              <p className=" flex gap-2 font-medium text-lg text-[green] mb-4">
                Account Balance:{" "}
                <p className="px-3 bg-green-500 rounded-full text-[#ffca00] text-sm py-1  flex justify-center items-center">
                  <BiSolidDollarCircle size={16} />
                  {user && Number(user.wallet_balance).toFixed(2)}
                </p>
              </p>
              <div className="  mb-4"></div>
              <div>
                <div className="flex -mx-3">
                  <div className="w-full px-3 mb-5">
                    <label
                      for=""
                      className="text-xs font-semibold px-1 text-black"
                    >
                      Choose Plans
                    </label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <i className="mdi mdi-email-outline text-gray-400 text-lg"></i>
                      </div>
                      <select
                        onChange={(e) => {
                          const selectedOption =
                            e.target.options[e.target.selectedIndex];
                          const value2 =
                            selectedOption.getAttribute("data-value2");
                          setInvestmentPlan(e.target.value);
                          setAmount(Number(value2));
                        }}
                        defaultChecked={investmentPlan}
                        value={investmentPlan}
                        className="w-full -ml-10  pr-3 py-2 text-green-500 font-medium rounded-lg border-2 border-gray-200 outline-none focus:border-none"
                      >
                        {PlansData &&
                          PlansData?.map((item, index) => (
                            <option
                              key={index}
                              value={item.id}
                              data-value2={item.amount_start}
                              className="font-semibold cursor-pointer text-green-500"
                            >
                              ${item.amount_start} - {item.amount_end}{" "}
                              {item.plan_name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex -mx-3">
                  <div className="w-full px-3 mb-8">
                    <label
                      for=""
                      className="text-xs font-semibold px-1 text-black"
                    >
                      Amount
                    </label>
                    <div className="flex relative ">
                      <div className="absolute h-full flex justify-center items-center z-10 pl-2 text-center pointer-events-none flex items-center justify-center">
                        <p className="font-semibold text-green-500">$</p>
                      </div>
                      <input
                        type="tel"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full  pl-4  pr-3 py-2 rounded-lg text-green-500 font-medium border-2 border-gray-200 outline-none focus:border-indigo-500"
                      />
                    </div>
                    <p className="text-gray-700 text-xs italic">
                      Minimum Investment is $50
                    </p>
                  </div>
                </div>

                <div className="flex justify-between border-[0.5px] bg-white border-gray-500 rounded-lg mb-2">
                  <div className="w-1/2 p-4 text-center  ">
                    <p className="text-md font-semibold text-gray-600">
                      Interest Rate
                    </p>
                    <p className="text-2xl  text-green-500 font-bold">
                      {retrunPercentage || 0}%
                    </p>
                  </div>
                  <div className="w-1/2 p-4 border-l-2 text-center  ">
                    <p className="text-md font-semibold text-gray-600">
                      Validity
                    </p>
                    <p className="text-2xl  text-green-500 font-bold">
                      {Number(payoutDays).toFixed(0)} Days
                    </p>
                  </div>
                </div>

                <div className="flex justify-between  mt-4  gap-6  ">
                  <button
                    className="relative"
                    onClick={() => {
                      if (Number(amount) < Number(user.wallet_balance)) {
                        setVerifyPinPop(true);
                      } else {
                        toast.warn("Insufficient balance.", {
                          position: "top-center",
                        });
                      }
                    }}
                    disabled={amount < 1}
                  >
                    <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black dark:bg-gray-500"></span>
                    <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                      {loading ? <Loading1 width={30} /> : "SUBMIT"}
                    </span>
                  </button>

                  <p
                    onClick={() => setInstructionOpen(true)}
                    className="px-4 py-1 text-semibold blinking-btn rounded-full flex justify-center items-center gap-1 cursor-pointer"
                  >
                    <IoDocumentTextOutline />
                    Instruction
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && <ViewPlans onClose={onClose} />}
      {verifyPinPopup && (
        <VerifyPin
          onclose2={onclose2}
          successFunction={(pin) => successFunction(pin)}
        />
      )}

      {success && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black/30 backdrop-blur-[2px] z-[9999]">
          <div className="p-4 animate-jump-in rounded-lg bg-white flex flex-col justify-center items-center">
            {" "}
            <img
              alt="success"
              src={require("../../assets/photos/verifiedgif.gif")}
              className="w-20"
            />
            <p className="text-2xl mt-2 text-gray-700 font-semibold">
              Investment Success.
            </p>
            <div className="flex  gap-2 flex mt-4 items-center">
              <button className="rounded bg-green-500 font-semibold text-white text-sm px-4 py-1">
                <Link to={"/home?investment=investment-history"}>
                  My Investment
                </Link>
              </button>
              <button
                onClick={() => setSuccess(false)}
                className="rounded bg-green-500 font-semibold text-white text-sm px-4 py-1"
              >
                Make New
              </button>
            </div>
          </div>
        </div>
      )}

      {instructionOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm z-[9999] flex justify-center items-center ">
          <div className="p-4 rounded bg-white max-w-lg text-center mx-4 animate-jump">
            <p className="mb-3 font-semibold text-black text-xl">INSTRUCTION</p>
            <p className="mt-1 text-md text-gray-600 text-justify">
              Receive daily earnings according to your selected investment plan,
              until{" "}
              <span className="font-semibold text-black text-indigo-800  ">
                your total returns reach 2X the amount of your initial
                investment.
              </span>
            </p>
            <button
              onClick={() => setInstructionOpen(false)}
              className="w-40 rounded bg-indigo-600 px-4 py-2 text-white font-semibold mt-4"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
