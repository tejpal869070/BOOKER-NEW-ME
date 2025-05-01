import React, { useState } from "react";
import { toast } from "react-toastify";
import { addMatchBet } from "../../Controllers/User/GamesController";

export default function MatchGamePopup({ onclose, formData,successFunction }) {
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(10);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleBet = async () => {
    setLoading(true);
    formData.amount = amount;
    try {
       await addMatchBet(formData);
       successFunction()
       onclose()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/30 z-[999] backdrop-blur-md flex justify-center items-center ">
      <div className="  rounded-md bg-gradient-to-r from-gray-100 to-gray-300 p-8">
        <div className="flex justify-between gap-2 md:gap-10 color-game-amount mt-6 items-center ">
          <p className="font-semibold">Amount</p>
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
        <p className="mt-6 font-semibold italic">
          Total Bet Amount : ${amount * quantity}
        </p>

        <div className="flex justify-around mt-6 font-semibold text-xl">
          <button
            onClick={handleBet}
            disabled={loading}
            className="px-8 py-0.5  border-2 border-black  uppercase bg-white text-black transition duration-200 shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)]  "
          >
            {loading ? "Processing..." : "CONFIRM"}
          </button>
          <button
            onClick={() => onclose()}
            disabled={loading}
            className="px-8 py-0.5  border-2 border-black  uppercase bg-white text-black transition duration-200 shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)]  "
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

const amounts = [
  { id: 1, price: 10, img: require("../../assets/photos/78.png") },
  { id: 2, price: 100, img: require("../../assets/photos/81.png") },
  { id: 3, price: 1000, img: require("../../assets/photos/83.png") },
  { id: 4, price: 2000, img: require("../../assets/photos/84.png") },
];
