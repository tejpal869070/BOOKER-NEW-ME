import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
 import { ToastContainer, toast } from "react-toastify";import 'react-toastify/dist/ReactToastify.css';
import { MdCancel } from "react-icons/md"; 

const SocialShare = ({ url, onClose }) => {
  const [isCopied1, setIsCopied1] = useState(false);
  const [isCopied2, setIsCopied2] = useState(false);

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

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center  backdrop-blur-[2px] z-[9999]">
      <div className="  flex items-center justify-center">
        <div className="bg-gray-100 dark:bg-gray-300 w-full mx-4 p-4 rounded-xl animate-fade-down animate-once animate-duration-500">
          <div className="flex justify-between items center border-b border-gray-200 py-3">
            <div className="flex items-center justify-center">
              <p className="text-xl font-bold text-gray-800">
                YOUR REFERRAL LINK
              </p>
            </div>

            <div
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-500 cursor-pointer hover:text-gray-300 font-sans text-gray-500 w-8 h-8 flex items-center justify-center rounded-full"
            >
              <MdCancel size={20} />
            </div>
          </div>

          <div className="my-4  ">
            <div className="flex flex-wrap w-full gap-4">
              <input
                className="w-full md:w-[48%]  rounded-lg  bg-transparent"
                type="text"
                placeholder="link"
                value={url}
              />{" "}
              <input
                className="w-full md:w-[48%]  rounded-lg  bg-transparent"
                type="text"
                placeholder="link"
                value={url}
              />
            </div>
            <div className="w-full flex flex-wrap justify-between gap-4 mt-4">
              <CopyToClipboard
                text={`${url}&position=L`}
                onCopy={handleCopy}
                className={`w-full md:w-[48%]  text-white rounded text-sm py-2 px-5    ${
                  isCopied1 ? "bg-[green]" : "bg-indigo-500"
                }`}
              >
                <button> {isCopied1 ? "Copied" : "Copy Left Position"} </button>
              </CopyToClipboard>
              <CopyToClipboard
                text={`${url}&position=R`}
                onCopy={handleCopy2}
                className={`w-full md:w-[48%]  text-white rounded text-sm py-2 px-5    ${
                  isCopied2 ? "bg-[green]" : "bg-indigo-500"
                }`}
              >
                <button>
                  {" "}
                  {isCopied2 ? "Copied" : "Copy Right Position"}{" "}
                </button>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SocialShare;
