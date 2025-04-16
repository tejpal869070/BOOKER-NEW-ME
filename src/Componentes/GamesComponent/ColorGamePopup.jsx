import React, { useState } from "react";
import { AddNewColorGameBet } from "../../Controllers/User/GamesController";
 import { ToastContainer, toast } from "react-toastify";import 'react-toastify/dist/ReactToastify.css';

const ColorGamePopup = ({ isOpen, onClose, popupData, currentGameData }) => {
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(10);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const formData = {
    select: popupData
      ? popupData.number
        ? popupData.number
        : popupData.color_name
      : "",
    color: popupData ? (popupData.color_code ? popupData.color_code : "") : "",
    period: currentGameData ? currentGameData.period : "",
    method: popupData ? (popupData.number ? "Number" : "Color") : "",
    game_type: popupData ? popupData.game_type : "",
    id: popupData ? popupData.id : "",
    total_amount: quantity * amount,
  };

  const amounts = [
    { id: 1, price: 10, img: require("../../assets/photos/78.png") },
    { id: 2, price: 100, img: require("../../assets/photos/81.png") },
    { id: 3, price: 1000, img: require("../../assets/photos/83.png") },
    { id: 4, price: 2000, img: require("../../assets/photos/84.png") },
  ];

  const handleBet = async () => {
    setLoading(true);
    try {
      const response = await AddNewColorGameBet(formData);
      if (response.status) {
        onClose("success");
      } else {
        toast.error("Somthing Went Wrong !", {
          position: "top-center",
        });
      }
    } catch (error) {
      if (error.response.status === 302) {
        const decodederror = atob(error.response.data);
        toast.error(JSON.parse(decodederror).message, {
          position: "top-center",
        });
      } else {
        toast.error("Server Error !", {
          position: "top-center",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50     ">
      <ToastContainer />
      <div className="bg-white dark:bg-[#bbbbbb] p-6 rounded-lg   shadow-lg relative  ">
        <h2 className="text-xl font-bold mb-2 text-center">Color Game </h2>
        <p className="text-center    py-1  font-bold bg-[#ffe487] px-12 rounded-lg">
          Selected{" "}
          {popupData
            ? popupData.number
              ? popupData.number
              : popupData.color_name
            : ""}
        </p>

        {/* Balance */}
        <div className="flex justify-between gap-2 md:gap-10 color-game-amount mt-6 items-center ">
          <p className="font-semibold">Balance</p>
          <div className="flex gap-2">
            {amounts.map((item, index) => (
              <button
                className={`p-1 ${
                  selectedAmount === index ? "border-black border-2" : ""
                }`}
                onClick={() => {
                  setSelectedAmount(index);
                  setAmount(item.price);
                }}
              >
                <img
                  alt={item.price}
                  src={item.img}
                  className="w-10"
                  loading="lazy"
                  style={{ filter: "drop-shadow(2px 4px 6px black)" }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* quantity */}
        <div className="flex justify-between color-game-quantity gap-10 mt-6 items-center">
          <p className="font-semibold">Quantity</p>
          <div className="flex gap-2 items-center">
            <button
              className="w-8 h-8 rounded-full"
              onClick={() => setQuantity(quantity - 1)}
              disabled={quantity === 1}
            >
              -
            </button>
            <input
              type="tel"
              placeholder="10"
              className="w-32 text-center rounded-2xl h-8"
              value={quantity}
            />

            <button
              className="w-8 h-8 rounded-full"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* total bet money */}
        <p className="mt-4 font-semibold italic">
          Total Bet Money : ${amount * quantity}
        </p>

        {/* buttons */}
        <div className="flex   justify-around mt-10">
          <button className="relative" onClick={() => onClose("close")}>
            <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
            <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
              Close
            </span>
          </button>
          <button className="relative" onClick={handleBet} disabled={loading}>
            <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
            <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
              {loading ? "Processing..." : "Place Bet"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorGamePopup;
