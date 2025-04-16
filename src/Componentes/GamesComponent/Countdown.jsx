import React, { useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";


const Countdown = ({ seconds }) => {
  const [count, setCount] = useState(seconds);
  const [animate, setAnimate] = useState(false); 
 

  useEffect(() => {
    if (count > 0) {
      const timer = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
        setAnimate(true); // Trigger animation on count change
      }, 1000);

      return () => clearInterval(timer); // Cleanup the interval on component unmount
    }
  }, [count]);

  useEffect(() => {
    if (count > 0) {
      const animationTimeout = setTimeout(() => {
        setAnimate(false);  
      }, 500);  

      return () => clearTimeout(animationTimeout); // Cleanup on unmount
    }
  }, [count]);

  return (
    <div className="flex justify-center items-center gap-4">
      <div className="px-4 text-[red] py-2 bg-gray-100 rounded-lg flex items-center justify-center text-9xl font-bold">
        {Math.floor(count / 10)}
      </div>
      <div className="flex flex-col text-white items-center justify-around h-20    font-bold  ">
        <p><FaCircle /></p> 
        <p><FaCircle /></p>
      </div>
      <div className={`px-4 text-[red] py-2 bg-gray-100 rounded-lg flex items-center justify-center text-9xl font-bold `}>
        <p className={`${animate ? 'animate-fade-down animate-duration-500' : ''}`}>{count % 10}</p>
      </div>
    </div>
  );
};

export default Countdown;