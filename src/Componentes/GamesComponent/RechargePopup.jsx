import { useEffect, useState } from "react";
import gif1 from "../../assets/photos/sendmoneygif.gif";
import { MdCancel } from "react-icons/md";
import { Loading1, Loading3 } from "../Loading1";
import { GetUserDetails } from "../../Controllers/User/UserController";
import VerifyPin from "../VerifyPin";
import { MainGameWalletMoneyTransfer } from "../../Controllers/User/GamesController";
import { toast } from "react-toastify";

export const FlashPopup = ({ handleClose }) => {
  const [isPopup2Open, setPopup2Open] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isVerifyOpen, setVerifyOpen] = useState(false);
  const [transferToAmount, setTransferToAmount] = useState(0);

  const userDataGet = async () => {
    setLoading(true);
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
      setLoading(false);
    }
  };
  const type = 1;

  useEffect(() => {
    userDataGet();
  }, []);

  const formData = {
    amount: transferToAmount,
    type: type,
  };

  const successFunction = async (pin) => {
    try {
      const response = await MainGameWalletMoneyTransfer(formData, pin);
      if (response.status) {
        toast.success("Wallet Recharged", {
          position: "top-center",
        });
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

  const openVerifyPin = () => {
    if (transferToAmount < 0.01) {
      toast.error("Minimum amount is 0.01", {
        position: "top-center",
      });
      return;
    }
    setVerifyOpen(true);
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
        <Loading3 />
      </div>
    );
  }

  return (
    <div className="fixed  top-0 left-0 w-full h-full flex flex-col bg-opacity-25 justify-center items-center  backdrop-blur	bg-black z-[9999]">
      <div className="  rounded-lg bg-white p-4">
        <img alt="imgggg" className="w-80" src={gif1} />
        <p className="text-center mt-4  text-xl md:text-2xl font-bold">
          Game Balance :{" "}
          <span className="text-[#169b16] text-2xl">
            ${user?.color_wallet_balnace}
          </span>
        </p>
        <div
          className="flex gap-4 mt-6 justify-center"
          onClick={() => setPopup2Open(true)}
        >
          <button className="relative inline-block text-lg group">
            <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
              <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
              <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
              <span className="relative">Recharge</span>
            </span>
            <span
              className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
              data-rounded="rounded-lg"
            ></span>
          </button>
          <button
            className="relative inline-block text-lg group"
            onClick={() => handleClose()}
          >
            <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
              <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
              <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
              <span className="relative">Close</span>
            </span>
            <span
              className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
              data-rounded="rounded-lg"
            ></span>
          </button>
        </div>
      </div>

      {/* second popup-------------------------------------------- */}
      {isPopup2Open && (
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
                $  {type === 1 ? Number(user.wallet_balance).toFixed(2) : Number(user.color_wallet_balnace).toFixed(2)}
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
                onClick={() => openVerifyPin()}
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
              onClick={() => handleClose()}
              className="cursor-pointer text-center m-auto mt-6"
            />
          </div>
        </div>
      )}

      {isVerifyOpen && (
        <VerifyPin
          onclose2={() => handleClose()}
          successFunction={(pin) => successFunction(pin)}
        />
      )}
    </div>
  );
};

export const FlashPopup2 = () => {
  const type = 1;
  return (
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
            $ {type === 1 ? 1000 : 2000}
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
            // value={transferToAmount}
            // onChange={(e) => setTransferToAmount(e.target.value)}
          />
          <button
            // onClick={openVerifyPin}
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
          //   onClick={() => setIsOpen(false)}
          className="cursor-pointer text-center m-auto mt-6"
        />
      </div>
    </div>
  );
};
