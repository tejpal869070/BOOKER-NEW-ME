import React, { useEffect, useState } from "react";
import {
  AddWithdrawalRequest,
  GetUserDetails,
  SendRequestForChangeAccount,
} from "../../../../Controllers/User/UserController";
import { Loading1, Loading3 } from "../../../Loading1";
 import { ToastContainer, toast } from "react-toastify";import 'react-toastify/dist/ReactToastify.css';
import successImg from "../../../../assets/photos/success1-1--unscreen.gif";
import swal from "sweetalert";
import gif1 from "../../../../assets/photos/withdrawgif.gif";
import VerifyPin from "../../../VerifyPin";
import { RiBankFill } from "react-icons/ri";
import { BsBank2 } from "react-icons/bs";

const inputClasses =
  "shadow-sm bg-gray-50 font-medium border border-gray-300 dark:bg-gray-200 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5";

export default function BankWithDrawal() {
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [ac_name, setAccName] = useState("");
  const [ac_no, setAccNo] = useState("");
  const [ifsc_code, setIfsc] = useState("");
  const [bank_name, setBankName] = useState("");
  const [ac_type, setAccType] = useState("Saving");
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState(249);
  const [processing, setProcessing] = useState(false);
  const [withdrawaing, setWithdrawaing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userHaveBank, setUserHaveBank] = useState(false);

  const [accountChanging, setAccountChanging] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const onclose2 = () => {
    setIsOpen(false);
  };

  const successFunction = async (pin) => {
    handleWithdrawal(pin);
  };

  const formData = {
    ac_name: ac_name,
    ac_no: ac_no,
    ifsc_code: ifsc_code,
    bank_name: bank_name,
    ac_type: ac_type,
    reason: reason,
  };

  // if user want to update bank account second time
  const changeBankAccount = async () => {
    setAccountChanging(true);
    if (ac_name === null || ac_name === undefined || ac_name.length < 4) {
      toast.error("Invalid Beneficary Name", {
        position: "bottom-right",
      });
      setAccountChanging(false);
      return;
    } else if (ac_no === null || ac_no === undefined || ac_no.length < 10) {
      toast.error("Invalid Account Number", {
        position: "bottom-right",
      });
      setAccountChanging(false);
      return;
    } else if (
      ifsc_code === null ||
      ifsc_code === undefined ||
      ifsc_code.length !== 11
    ) {
      toast.error("Invalid IFSC Code", {
        position: "bottom-right",
      });
      setAccountChanging(false);
      return;
    } else if (
      ac_type === null ||
      ac_type === undefined ||
      ac_type.length < 4
    ) {
      toast.error("Invalid Account Type", {
        position: "bottom-right",
      });
      setAccountChanging(false);
      return;
    } else if (
      bank_name === null ||
      bank_name === undefined ||
      bank_name.length < 3
    ) {
      toast.error("Invalid Bank Name", {
        position: "bottom-right",
      });
      setAccountChanging(false);
      return;
    }
    try {
      const response = await SendRequestForChangeAccount(formData);
      if (response.status) {
        toast.success("Bank Details Sent For Updation.", {
          position: "bottom-right",
        });
        swal("Success", "Bank Details Sent For Updation.", "success");
        setAccName("");
        setAccNo("");
        setIfsc("");
        setBankName("");
        setAccType("Saving");
        setReason("");
        userDataGet();
        setAccountChanging(false);
        setEditing(false);
      } else {
        toast.error("Failed to Update Bank Details", {
          position: "bottom-right",
        });
        setAccountChanging(false);
      }
    } catch (error) {
      toast.error("Server Error Try Again !!!", {
        position: "bottom-right",
      });
      setAccountChanging(false);
    }
  };

  const handleWithdrawal = async (pin) => {
    setWithdrawaing(true);
    if (amount < 249) {
      toast.error("Minimum withdrawal amount is 249", {
        position: "bottom-right",
      });
      setWithdrawaing(false);
      return;
    }
    try {
      const response = await AddWithdrawalRequest(pin, amount);
      if (response.status) {
        setSuccess(true);
        setWithdrawaing(false);
        userDataGet();
        setTimeout(() => {
          setSuccess(false);
        }, 3500);
      } else {
        toast.error("Failed to Withdraw", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      if (error.response.status === 302) {
        swal("Error!", `${error.response.data.message}`, "error");
        setWithdrawaing(false);
      } else {
        toast.error("Server Error !", {
          position: "bottom-right",
        });
        setWithdrawaing(false);
      }
    }
  };

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
      setAccName(response[0].ac_name);
      setAccNo(response[0].ac_no);
      setIfsc(response[0].ifsc_code);
      setAccType(response[0].ac_type || "Saving");
      setBankName(response[0].bank_name);
      setLoading(false);
      if (
        response[0].ac_name !== null ||
        response[0].ac_name !== null ||
        response[0].bank_name !== null ||
        response[0].ifsc_code !== null
      ) {
        setUserHaveBank(true);
      }
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

  if (success) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-[#000000d1] bg-opacity-50 z-[9999]">
        <img alt="success" src={successImg} />
        <p className="text-2xl text-white font-semibold">
          Withdrawal Success !
        </p>
      </div>
    );
  }

  return (
    <div className="z-[9999] relative">
      <div className="   flex items-center justify-center  ">
        <div className="bg-[#e1e6ff] dark:bg-[#868ba3fc] text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden">
          <div className="md:flex flex-row-reverse w-full">
            <div className="w-full   md:w-1/2 bg-indigo-200  p-2">
              <img
                alt="animation"
                className="w-full  rounded-t-xl h-full "
                src={gif1}
              />
            </div>
            <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
              <div className="  mb-2">
                <h1 className="font-bold text-3xl text-gray-900">
                  BANK WITHDRAWAL
                </h1>
              </div>
              <p className="mb-2 text-gray-800 font-medium animate-pulse">
                {user && user.bank_status === "N"
                  ? "You Don't Have Any Linked Bank Account."
                  : user.bank_status === "P"
                  ? "Your bank details are being verified.--------------------"
                  : user.bank_status === "Y"
                  ? "Your Bank Account Successfully Verified."
                  : user.bank_status === "F"
                  ? `Bank Verification Failed. Reason: ${user.reason}`
                  : ""}
              </p>

              <p className="  font-medium text-lg text-[#20e701] mb-6">
                Account Balance: $
                {user && Number(user.wallet_balance).toFixed(2)}
              </p>

              {user?.bank_status === "N" && !editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex justify-center items-center gap-2 flex-col w-full py-2 text-center font-semibold bg-gray-200 rounded"
                >
                  <BsBank2 size={20} />
                  Add Bank Account
                </button>
              ) : (
                <div>
                  <div className="grid grid-cols-6 gap-6">
                    {/* bank aacount */}
                    <div
                      className={`flex items-center gap-4 bg-gray-200 inline px-4 py-2 rounded col-span-12 ${
                        user.bank_status === "Y" ? "block" : "hidden"
                      } ${editing && "hidden"}`}
                    >
                      <div className="flex flex-col items-center justify-center border-r-2 border-black pr-4">
                        <RiBankFill />
                        {bank_name}
                      </div>
                      <div>
                        <p>Account No. {ac_no}</p>
                      </div>
                    </div>
                    <div
                      className={`col-span-6 sm:col-span-3 ${
                        !editing && "hidden"
                      }`}
                    >
                      <label
                        for="product-name"
                        className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-800"
                      >
                        Beneficary Name *
                      </label>
                      <input
                        type="text"
                        name="product-name"
                        id="product-name"
                        className={`${inputClasses} ${
                          !editing ? "cursor-not-allowed" : ""
                        }`}
                        placeholder=""
                        disabled={!editing}
                        value={ac_name}
                        onChange={(e) => setAccName(e.target.value)}
                      />
                    </div>
                    <div
                      className={`col-span-6 sm:col-span-3 ${
                        !editing && "hidden"
                      }`}
                    >
                      <label
                        for="category"
                        className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-800"
                      >
                        Account Number *
                      </label>
                      <input
                        type="tel"
                        name="category"
                        id="category"
                        className={`${inputClasses} ${
                          !editing ? "cursor-not-allowed" : ""
                        }`}
                        placeholder=""
                        disabled={!editing}
                        required
                        value={ac_no}
                        onChange={(e) => setAccNo(e.target.value)}
                      />
                    </div>
                    <div
                      className={`col-span-6 sm:col-span-3 ${
                        !editing && "hidden"
                      }`}
                    >
                      <label
                        for="brand"
                        className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-800"
                      >
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        name="brand"
                        id="brand"
                        className={`${inputClasses} ${
                          !editing ? "cursor-not-allowed" : ""
                        }`}
                        placeholder=""
                        disabled={!editing}
                        required
                        value={bank_name}
                        onChange={(e) => setBankName(e.target.value)}
                      />
                    </div>

                    <div
                      className={`col-span-6 sm:col-span-3 ${
                        !editing && "hidden"
                      }`}
                    >
                      <label
                        for="product-details"
                        className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-800"
                      >
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        name="price"
                        id="price"
                        className={`${inputClasses} ${
                          !editing ? "cursor-not-allowed" : ""
                        }`}
                        placeholder=""
                        disabled={!editing}
                        required
                        value={ifsc_code}
                        onChange={(e) => setIfsc(e.target.value)}
                      />
                    </div>

                    <div
                      className={`col-span-6 sm:col-span-3 ${
                        !editing && "hidden"
                      }`}
                    >
                      <label
                        for="product-details"
                        className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-800"
                      >
                        Account Type *
                      </label>
                      <select
                        name="price"
                        id="price"
                        className={`${inputClasses}`}
                        value={ac_type}
                        disabled={!editing}
                        onChange={(e) => setAccType(e.target.value)}
                      >
                        <option value="Saving">Saving</option>
                        <option value="Current">Current</option>
                      </select>
                    </div>

                    <div
                      className={`col-span-12 sm:col-span-12 ${
                        editing ? "hidden" : ""
                      }`}
                    >
                      <label
                        for="product-details"
                        className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-800"
                      >
                        Withdrawal Amount * (Min $249)
                      </label>
                      <input
                        type="text"
                        name="price"
                        id="price"
                        placeholder=""
                        className={`${inputClasses}`}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-[#00e367] block mb-2 ">
                          Credit Amount: ${(Number(amount) * 90/100).toFixed(2)}
                        </p>
                        <p className="text-sm font-medium text-black block mb-2 ">
                          Charges: 10%
                        </p>
                      </div>
                    </div>

                    <div
                      className={`col-span-6 sm:col-span-3 ${
                        !editing || user.bank_status === "N" ? "hidden" : ""
                      }`}
                    >
                      <label
                        for="product-details"
                        className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-800"
                      >
                        Reason for Updation
                      </label>
                      <input
                        type="text"
                        name="price"
                        id="price"
                        placeholder="I want to change because"
                        className={`${inputClasses}`}
                        value={reason}
                        disabled={!editing}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>
                  </div>
                  {editing ? (
                    <div className="flex flex-wrap justify-between w-full gap-6 mt-6">
                      <button className="relative" onClick={changeBankAccount}>
                        <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black dark:bg-gray-400"></span>
                        <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black dark:border-gray-500 bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                          {accountChanging ? "Changing..." : "Send For Update"}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          userDataGet();
                        }}
                        className="relative"
                      >
                        <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-gray-700 dark:bg-gray-400"></span>
                        <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black dark:border-gray-500 bg-black px-3 py-1 text-base font-bold text-white transition duration-100 hover:bg-gray-900 hover:text-yellow-500">
                          CLOSE
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex  justify-center gap-6 mt-6">
                      <button
                        onClick={() => setIsOpen(true)}
                        className="relative"
                        disabled={
                          (user && user.ac_no === null) ||
                          user.ac_name === null ||
                          user.bank_name === null ||
                          user.ifsc_code === null ||
                          user.ac_no === undefined ||
                          user.ac_name === undefined ||
                          user.bank_name === undefined ||
                          user.ifsc_code === undefined ||
                          amount < 100 ||
                          amount > Number(user.wallet_balance)
                        }
                      >
                        <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black dark:bg-gray-400"></span>
                        <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black dark:border-gray-500 bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                          {withdrawaing ? (
                            <Loading1 width={28} />
                          ) : (
                            "CONFIRM WITHDRAWAL"
                          )}
                        </span>
                      </button>
                      <button
                        className="relative"
                        onClick={() => setEditing(true)}
                      >
                        <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black dark:bg-gray-400"></span>
                        <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black dark:border-gray-500 bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                          EDIT BANK DETAILS
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}
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
