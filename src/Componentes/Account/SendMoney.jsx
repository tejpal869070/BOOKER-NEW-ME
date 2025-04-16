import React, { useEffect, useState } from "react";
import { GetUserDetails } from "../../Controllers/User/UserController";
import {
  GetUserNameByMobile,
  SendMoneyToUser,
} from "../../Controllers/Auth/AuthController";
import { Loading1 } from "../Loading1";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import gif1 from "../../assets/photos/sendmoneygif.gif";
import VerifyPin from "../VerifyPin";

export default function SendMoney() {
  const [sendTo, setSendTo] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userVerified, setUserVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const [user, setUser] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const onclose2 = () => {
    setIsOpen(false);
  };
  const successFunction = async (pin) => {
    handleForm(pin);
  };

  const formData = {
    userMobile: mobile,
    amount: amount,
    pin: pin,
  };

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
    }
  };

 

  

  const verifyMobile = async (e) => {
    e.preventDefault();
    setChecking(true);
    if (mobile.length < 10) {
      toast.error("Invalid User Mobile.");
      setChecking(false);
      return;
    } else if (mobile === user?.mobile) {
      toast.error("You cannot send money to yourself.");
      setChecking(false);
      return;
    }
    try {
      const response = await GetUserNameByMobile(mobile);
      if (response.status) {
        setSendTo(response.data.username);
        setUserVerified(true);
        setChecking(false);
      } else {
        toast.error("User Not Found");
        setChecking(false);
      }
    } catch (error) {
      if (error.response.status === 302) {
        toast.error("User Not Found");
        setChecking(false);
      } else {
        toast.error("Server Error. Please try again.");
        setChecking(false);
      }
    }
  };

  const handleForm = async (pin) => {
    setLoading(true);
    if (amount < 100) {
      toast.error("Minimum amount is 100");
      setLoading(false);
      return;
    } else if (amount > Number(user.wallet_balance)) {
      toast.error("Insufficient Balance");
      setLoading(false);
      return;
    } else if (pin.length !== 4) {
      toast.error("Invalid PIN");
      setLoading(false);
      return;
    }
    try {
      const response = await SendMoneyToUser(formData, pin);
      if (response.status) {
        setSuccess(true);
        setAmount("");
        setPin("");
        setMobile("");
        setUserVerified(false);
        setSendTo("");
        setLoading(false);
        userDataGet();
        setTimeout(() => {
          setSuccess(false);
        }, 3500);
      } else {
        toast.error("Failed to send money");
        setLoading(false);
      }
    } catch (error) {
      if (error?.response?.status === 302) {
        toast.error(error.response.data.message);
        setLoading(false);
      } else {
        toast.error("Server Error.");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    userDataGet();
  }, []);

  if (success) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-[#000000d1] bg-opacity-50 z-[9999]">
        <div className="p-4 rounded-lg bg-white">
          <img
            alt="success"
            src={require("../../assets/photos/verifiedgif.gif")}
            className="w-20 m-auto"
          />
          <p className="text-2xl text-center text-gray-700 mt-4 font-semibold">
            Transection Success.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ToastContainer />
      <div>
        <p className="lg:pl-10 font-bold text-xl mb-6 dark:text-white">
          Account {">"}Send Money
        </p>
        <div className="bg-[#e1e6ff] dark:bg-[#868ba3fc] text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden">
          <div className="md:flex flex-row-reverse w-full">
            <div className="w-full md:w-1/2 bg-indigo-200  p-2">
              <img
                alt="animation"
                className="w-full rounded-t-2xl md:rounded-2xl h-full "
                src={gif1}
              />
            </div>
            <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
              <div className="  mb-6">
                <h1 className="font-bold text-3xl text-gray-900">
                  WALLET MONEY TRANSFER
                </h1>
                <p className=" mt-2 font-medium text-lg  text-black italic  mb-4">
                  Account Balance: $
                  {user && Number(user.wallet_balance).toFixed(2)}
                </p>
              </div>

              <div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 ">
                    <label
                      for="product-name"
                      className="text-sm font-medium text-gray-900 dark:text-white block mb-2"
                    >
                      User Mobile No.:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        name="product-name"
                        id="product-name"
                        disabled={userVerified}
                        className="shadow-sm font-semibold w-full bg-gray-50 border  border-gray-300 dark:bg-gray-200 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block  p-2.5"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required=""
                      />
                      <button
                        onClick={verifyMobile}
                        disabled={userVerified}
                        className="px-6 py-1  rounded-xl font-semibold bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
                      >
                        {checking ? <Loading1 width={28} /> : "VERIFY"}
                      </button>
                    </div>
                    <p className="italic text-[green] font-semibold text-sm">
                      {sendTo && sendTo}
                    </p>
                  </div>
                  <div
                    className={`col-span-12 ${
                      !userVerified ? "hidden" : "block"
                    }`}
                  >
                    <label
                      for="product-details"
                      className="text-sm font-medium text-gray-900 dark:text-white block mb-2"
                    >
                      Amount To be Transferred :
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={!userVerified}
                      className="shadow-sm font-semibold bg-gray-50 border w-1/2 border-gray-300 dark:bg-gray-200 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block  p-2.5"
                      placeholder="AMOUNT"
                      required=""
                    />
                  </div>
                </div>

                <div className="flex     gap-6 mt-6">
                  <button
                    className="relative"
                    onClick={() => {
                      if (amount > user?.wallet_balance || isNaN(amount)) {
                        toast.warn("Amount Exceed");
                      } else if (amount < 100) {
                        toast.warn("Minimum amount is $100");
                      } else {
                        setIsOpen(true);
                      }
                    }}
                    disabled={!userVerified}
                  >
                    <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded-full bg-black dark:bg-gray-400"></span>
                    <span className="fold-bold relative inline-block h-full w-full rounded-full border-2 border-black dark:border-gray-500 bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                      {loading ? <Loading1 width={28} /> : "SEND"}
                    </span>
                  </button>
                  <button
                    className="relative"
                    onClick={() => {
                      setAmount("");
                      setPin("");
                      setMobile("");
                      setUserVerified(false);
                      setSendTo("");
                    }}
                  >
                    <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded-full bg-black dark:bg-gray-400"></span>
                    <span className="fold-bold relative inline-block h-full w-full rounded-full border-2 border-black dark:border-gray-500 bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                      CLEAR
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <VerifyPin
          onclose2={onclose2}
          successFunction={(pin) => successFunction(pin)}
        />
      )}
      <ToastContainer />
    </div>
  );
}
