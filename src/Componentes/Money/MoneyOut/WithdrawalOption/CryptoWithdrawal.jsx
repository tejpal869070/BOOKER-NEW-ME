import React, { useEffect, useState } from "react";
import gif1 from "../../../../assets/photos/bitcoingif.gif";
import {
  AddCryptoWithdrawalRequest,
  GetUserDetails,
} from "../../../../Controllers/User/UserController";
import { Loading1, Loading3 } from "../../../Loading1";
import VerifyPin from "../../../VerifyPin";
 import { ToastContainer, toast } from "react-toastify";import 'react-toastify/dist/ReactToastify.css'; 
import swal from "sweetalert";

export default function CryptoWithdrawal() {
  const inputClasses =
    "shadow-sm bg-gray-50 font-medium border border-gray-300 dark:bg-gray-200 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5";

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(25);
  const [processing, setProcessing] = useState(false); 

  const onclose2 = () => {
    setIsOpen(false);
  };

  const formData = {
    amount: amount,
    address: address,
    price_at_time: user.currency_rate,
    currency: user.currency,
  };

  const successFunction = async (pin) => {
    try {
      const response = await AddCryptoWithdrawalRequest(formData, pin);
      if (response.status) {
        setProcessing(false);
        userDataGet();
        toast.success("Withdrawal Verifying...", {
          position: "top-center",
        });
        setAddress("");
        setAmount(10);
      } else {
        toast.warn("Something Went Wrong !", {
          position: "bottom-right",
        });
        setProcessing(false);
      }
    } catch (error) {
      if (error?.response?.status === 302) {
        swal("Error!", `${error.response.data.message}`, "error");
        setProcessing(false);
      } else {
        toast.warn("Server Error !", {
          position: "bottom-right",
        });
        setProcessing(false);
      }
    }
  };

  const handle1 = async () => {
    if (amount < 25) {
      toast.warn("Minimum Withdrawal is 25", {
        position: "top-center",
      });
      return;
    } else if (address.length < 10) {
      toast.warn("Invalid Address", {
        position: "bottom-right",
      });
      return;
    } else if (
      Number(amount) > 
      Number(user.wallet_balance) / Number(user.currency_rate)
    ) {
      toast.warn("Insufficient Balance", {
        position: "bottom-right",
      });
    }
    setIsOpen(true);
  };

  const userDataGet = async () => {
    const response = await GetUserDetails();      
    if (response !== null) {
      setUser(response[0]);
      setLoading(false);
    } else {
      setLoading(false);
      window.alert("Something Went Wrong !");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    userDataGet();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
        <Loading3 />
      </div>
    );
  }

  return (
    <div className=" min-h-screen max-w-7xl">
      <ToastContainer />
      <div className="bg-[#e1e6ff] dark:bg-[#868ba3fc] text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden">
        <div className="md:flex flex-row-reverse w-full">
          <div className="w-full md:w-1/2 bg-indigo-200  p-2">
            <img alt="animation" className="w-full h-full rounded-t-2xl md:rounded-2xl " src={gif1} />
          </div>
          <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
            <div className="  mb-6">
              <h1 className="font-bold text-3xl text-gray-900">
                CRYPTO WITHDRAWAL
              </h1>
            </div>
            <p className="  font-medium text-lg dark:text-[#d4e11d] text-[green] mb-4">
              Crypto Balance ({user.currency}) : ${" "}
              {user && Number(user.wallet_balance).toFixed(2)}
            </p>

            <div className="grid grid-cols-12 gap-6 mt-10">
              <div className="col-span-12  ">
                <label
                  for="product-name"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                >
                  {user.currency} Address*
                </label>
                <input
                  type="text"
                  name="product-name"
                  id="product-name"
                  className={`${inputClasses}`}
                  placeholder=""
                  // disabled={!editing}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="col-span-12  ">
                <label
                  for="product-name"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                >
                  Quantity* (Min $25)
                </label>
                <input
                  type="text"
                  name="product-name"
                  id="product-name"
                  className={`${inputClasses}`}
                  placeholder=""
                  // disabled={!editing}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <p className="text-[#00e367] font-medium text-sm">
                    Credit: ${((Number(amount) * 90) / 100).toFixed(2)}
                  </p>
                  <p className="text-gray-800 font-medium text-sm">
                    Charges: 10%
                  </p>
                </div>
                {/* <p className="text-gray-800 font-medium text-sm">
                  Rs. {(amount * Number(user.currency_rate)).toFixed(2)} Will Be
                  deduct{" "}
                </p> */}
              </div>
            </div>
            <div className="flex flex-wrap   gap-6 mt-6">
              <button onClick={handle1} className="relative">
                <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black dark:bg-gray-400"></span>
                <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black dark:border-gray-500 bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                  {processing ? <Loading1 /> : "SUBMIT"}
                </span>
              </button>
              <button
                className="relative"
                onClick={() => {
                  setAddress("");
                  setAmount("");
                }}
              >
                <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black dark:bg-gray-400"></span>
                <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black dark:border-gray-500 bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                  CLEAR
                </span>
              </button>
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
