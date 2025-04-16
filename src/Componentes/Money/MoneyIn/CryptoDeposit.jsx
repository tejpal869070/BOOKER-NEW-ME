import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
 import { ToastContainer, toast } from "react-toastify";import 'react-toastify/dist/ReactToastify.css';
import { FaCopy } from "react-icons/fa";
import { API } from "../../../Controllers/Api";
import { BsQrCodeScan } from "react-icons/bs";
import gif1 from "../../../assets/photos/cryptodepositgif.gif";
import { MdCancel } from "react-icons/md";
import successImg from "../../../assets/photos/success1-1--unscreen.gif";
import { Loading1 } from "../../Loading1";
import { AddCryptoDepositRequest } from "../../../Controllers/User/UserController";

export default function CryptoDeposit({ data }) {
  const inputClasses =
    "shadow-sm bg-gray-50 font-medium border border-gray-300 dark:bg-gray-400 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5";

  const [isQrShow, setQrShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transection_id, setTransectionId] = useState("");
  const [amount, setAmount] = useState(10);
  const [image, setImage] = useState(null);

  const formData = {
    amount: amount,
    transection_id: transection_id,
    image: image,
    deposit_id: data.address,
    price_at_that_time: data.price,
    currency: data.currency,
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (transection_id < 10) {
      toast.error("Invalid Transaction ID", {
        position: "top-center",
      });
      setLoading(false);
      return;
    } else if (amount < 10) {
      toast.error("Minimum Amount is $10", {
        position: "top-center",
      });
      setLoading(false);
      return;
    } else if (image === null) {
      toast.error("Please upload Payment file/image.", {
        position: "top-center",
      });
      setLoading(false);
      return;
    }
    try {
      const response = await AddCryptoDepositRequest(formData);
      if (response.status) {
        setLoading(false);
        toast.success("Deposit Success. Verifying...", {
          position: "top-center",
        });
        setImage(null);
        setTransectionId("");
        setAmount(10);
      } else {
        toast.error("Something Went Wrong !", {
          position: "top-center",
        });
        setLoading(false);
      }
    } catch (error) {
      if (error?.response.status === 302) {
        toast.error(`${error.response.data.message}`);
        setLoading(false);
      } else {
        toast.error("Server Error !", {
          position: "top-center",
        });
        setLoading(false);
      }
    }
  };

  const handleCopy = () => {
    toast.success("Address Copied !", {
      position: "top-center",
    });
  };

  if (isQrShow) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-[#000000d1] bg-opacity-50 z-[9999]">
        <img
          alt="success"
          className="w-60 h-60"
          src={`${API.url}assets/img/${data.qr_code}`}
        />
        <p className="text-2xl text-white font-semibold">
          {data?.currency} QR CODE
        </p>
        <MdCancel
          className="cursor-pointer mt-6"
          color="white"
          onClick={() => setQrShow(false)}
          size={28}
        />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <div className="     mt-6    border-b-4 rounded-lg shadow-lg   flex flex-col">
        <div className="bg-[#e1e6ff] dark:bg-[#868ba3fc]   text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden">
          <div className="md:flex flex-row-reverse  ">
            <div className="w-full md:w-1/2   bg-indigo-200  p-2">
              <img alt="animation" className="w-full h-full " src={gif1} />
            </div>
            <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
              <div className="  mb-6">
                <h1 className="font-bold text-3xl dark:text-gray-200">
                  CRYPTO DEPOSIT
                </h1>
              </div>
              <div className="   ">
                <h1 className=" font-semibold text-lg text-black dark:text-gray-200">
                  {data?.currency} ADDRESS
                </h1>
                <div className="flex gap-2 items-center">
                  <p className="w-[90%] overflow-hidden shadow-xl flex justify-between items-center focus:animate-none   inline-flex text-md font-medium bg-indigo-900 mt-1 px-4   py-2 rounded-lg tracking-wide text-white">
                    <p className="w-[90%] overflow-hidden line-clamp-1">
                      {data && data.address}{" "}
                    </p>
                    <div className="">
                      <CopyToClipboard text={data.address} onCopy={handleCopy}>
                        <FaCopy className="cursor-pointer  " />
                      </CopyToClipboard>
                    </div>
                  </p>
                  <BsQrCodeScan
                    size={28}
                    color="black"
                    onClick={() => setQrShow(true)}
                    className="cursor-pointer hover:animate-jump  animate-infinite"
                  />
                </div>
              </div>

              <form className="mt-6" onSubmit={handleForm}>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 sm:col-span-12">
                    <label
                      for="product-name"
                      className="text-sm font-medium text-gray-900 block mb-1 dark:text-gray-200"
                    >
                      Transection Hash*
                    </label>
                    <input
                      type="text"
                      name="product-name"
                      id="product-name"
                      className={`${inputClasses}`}
                      placeholder=""
                      required=""
                      value={transection_id}
                      onChange={(e) => setTransectionId(e.target.value)}
                    />
                  </div>
                  <div className="col-span-5 sm:col-span-5 relative">
                    <label
                      for="product-name"
                      className="text-sm font-medium text-gray-900 block mb-1 dark:text-gray-200"
                    >
                      Amount*
                    </label>
                    <input
                      type="text"
                      name="product-name"
                      id="product-name"
                      className={`${inputClasses}`}
                      placeholder=""
                      required=""
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <p className="absolute text-xs font-medium text-gray-900">
                      1 {data.currency} ~ $ {data?.price}
                    </p>
                  </div>
                  <div className="flex align-center items-center mt-4 col-span-7 sm:col-span-7">
                    {image !== null ? (
                      <p className="w-full overflow-hidden shadow-sm bg-gray-200 border-2 pr-[22px] border-gray-700 dark:bg-gray-400 text-gray-900 font-medium  rounded-xl focus:ring-cyan-600 focus:border-cyan-600 block  px-2.5 py-2.5">
                        {image.name}
                      </p>
                    ) : (
                      <input
                        className="shadow-sm w-full bg-gray-50 border pr-[22px] border-gray-300 dark:bg-gray-400 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block  px-2.5"
                        name="product-name"
                        id="product-name"
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        onChange={(e) => setImage(e.target.files[0]) || null}
                      />
                    )}
                    {image !== null ? (
                      <MdCancel
                        size={20}
                        className="cursor-pointer ml-[-32px]"
                        onClick={(e) => setImage(null)}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap justify-start mt-10 gap-6 w-full">
                  <button
                    className="relative  w-full"
                    type="submit"
                    disabled={loading}
                  >
                    <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded-full bg-black dark:bg-gray-500"></span>
                    <span
                      className={`fold-bold text-center relative inline-block h-full w-full rounded-full border-2 border-black   bg-white px-3 py-1 text-base font-bold text-black transition hover:bg-yellow-400 duration-100  hover:text-gray-900 `}
                    >
                      {loading ? <Loading1 width={24} /> : "SUBMIT"}
                    </span>
                  </button>
                </div>
              </form>
              {/* <div className="bg-[#3defff54] flex gap-1 pb-6 shadow-lg p-4 mt-6 rounded-lg">
                <div className=" w-full relative">
                  <input
                    className=" text-black rounded-lg text-sm font-medium p-2 py-1 border-2 border-gray-4000 "
                    placeholder="INR"
                    value={usdtPrice}
                    type="tel"
                    onChange={(e) => handleUsdtChange(e.target.value)}
                  />
                  <p className="absolute font-semibold text-xs text-gray-900">
                    INR
                  </p>
                </div>
                <GrSync size={28} color="black" className="font-bold" />

                <div className=" w-full relative">
                  <input
                    className=" text-black rounded-lg text-sm font-medium p-2 py-1 border-2 border-gray-4000 "
                    placeholder={data.currency}
                    type="tel"
                    value={inrPrice}
                    min={1}
                    onChange={(e) => handleInrChange(e.target.value)}
                  />
                  <p className="absolute font-semibold text-xs text-gray-900">
                    {data.currency}
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <div className="font-medium dark:text-white border-t-2 mt-6 border-black dark:border-white">
          <p className="text-[red] dark:text-white mt-2 font-semibold">Note:</p>
          <p>1. Minimum Deposit $10.00</p>
          <p>
            2. After complete the transaction amount will be credited in your
            account.
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
