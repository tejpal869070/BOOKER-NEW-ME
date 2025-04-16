import React, { useEffect, useRef, useState } from "react";
import bg1 from "../../../assets/photos/space-gif.gif";
import { circOut, motion, useMotionValue } from "framer-motion";
import aviator from "../../../assets/photos/aviator.gif";
import CountUp from "react-countup";
import ProgressBar from "@ramonak/react-progress-bar";
import { MovingDot, MovingDot2 } from "./MovingDot";
import PlainFly from "./PlainFly";

export default function AviatorPlain() {
  const [amount, setAmount] = useState(10);
  const [timeTake, setTimeTake] = useState(10);
  const [isFlying, setFlying] = useState(false);
  const [isGameStarting, setGameStarting] = useState(true);
  const [flewAwayAt, setFlewAwayAt] = useState(1);

  const [count, setCount] = useState(1); // Initial count value
  const [randomNumber, setRandomNumber] = useState(0);
  const randomNumberRef = useRef(randomNumber);

  const [planeX, setPlaneX] = useState(0);
  const [planeY, setPlaneY] = useState(500);

  // Motion values for real-time tracking
  const x = useMotionValue(50);
  const y = useMotionValue(500);

  // Update state when motion values change
  useEffect(() => {
    x.onChange((latest) => setPlaneX(latest));
    y.onChange((latest) => setPlaneY(latest));
  }, [x, y]);

  useEffect(() => {
    let intervalId = setInterval(() => {
      setFlying(true);
      setGameStarting(false);
    }, timeTake * 1000);

    let intervalId2 = setInterval(() => {
      setFlying(false);
      setGameStarting(true);
    }, timeTake * 1100);

    return () => {
      clearInterval(intervalId);
      clearInterval(intervalId2);
    };
  }, [timeTake]);

  // Update randomNumberRef whenever randomNumber changes
  useEffect(() => {
    randomNumberRef.current = randomNumber;
  }, [randomNumber]);

  const generateRandomNumber = () => {
    return (Math.random() * (4 - 1) + 1).toFixed(2);
  };
  useEffect(() => {
    if (isFlying) {
      randomNumberRef.current = generateRandomNumber();
      setFlewAwayAt(randomNumberRef.current);
      setCount(1);

      const interval = setInterval(() => {
        setCount((prev) => {
          const nextValue = (prev + 0.01).toFixed(2);
          return parseFloat(nextValue) <= randomNumberRef.current
            ? parseFloat(nextValue)
            : prev;
        });
      }, 90);

      // Calculate the time required to reach the random number
      const stepsRequired = (randomNumberRef.current - 1) / 0.01;
      const timeRequiredMs = stepsRequired * 90;
      const timeRequiredSec = timeRequiredMs / 1000;

      setTimeTake(timeRequiredSec);

      return () => clearInterval(interval);
    }
  }, [isFlying]);

  return (
    <div className=" ">
      <PlainFly />

      {/* pricing tag */}
      <div className="border-[1px] border-gray-700 rounded-md mt-3 p-4 bg-[#1b1c1d] flex flex-row rounded-md justify-center gap-4">
        <div>
          <div className="flex  justify-between items-center bg-[#080809] inline p-2 rounded-full">
            <button
              onClick={() => setAmount((pre) => pre - 1)}
              disabled={amount === 1}
              className="rounded-full border-2 border-gray-400 text-gray-200 font-semibold text-lg  w-8 h-6 flex items-center justify-center"
            >
              -
            </button>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-[#080809] text-gray-200 focus:outline-none text-center w-full"
            />
            <button
              onClick={() => setAmount((pre) => pre + 1)}
              className="rounded-full border-2 border-gray-400 text-gray-200 font-semibold text-lg  w-8 h-6 flex items-center justify-center"
            >
              +
            </button>
          </div>
          <div className="flex gap-2 p-1">
            {pricing.map((item, index) => (
              <div
                key={index}
                className=""
                onClick={() => setAmount(item.price)}
              >
                <img
                  alt="price"
                  src={item.image}
                  className="w-10 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          className={`w-40 rounded-3xl border-2 text-gray-100 py-2 text-xl font-semibold border-gray-200 ${
            amount < 1 ? "bg-gray-400" : "bg-[#28a909]"
          }`}
          disabled={amount < 1}
        >
          BET<p>${Number(amount).toFixed(2)}</p>
        </button>
      </div>
    </div>
  );
}

const pricing = [
  {
    id: 1,
    price: 10,
    image: require("../../../assets/photos/78.png"),
  },
  {
    id: 2,
    price: 20,
    image: require("../../../assets/photos/79.png"),
  },
  {
    id: 1,
    price: 50,
    image: require("../../../assets/photos/80.png"),
  },
  {
    id: 1,
    price: 100,
    image: require("../../../assets/photos/81.png"),
  },
  {
    id: 1,
    price: 500,
    image: require("../../../assets/photos/82.png"),
  },
  {
    id: 1,
    price: 1000,
    image: require("../../../assets/photos/83.png"),
  },
];
