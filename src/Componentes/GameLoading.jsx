import React from "react";
import bg1 from "../assets/photos/black-bg.jpg";

export default function GameLoading() {
  return (
    <div
      className="fixed flex justify-center items-center z-[99999] bg-center w-screen h-screen bg-black bg-cover top-0 left-0"
      style={{ backgroundImage: `url(${bg1})` }}
    >
      <div>
        <img
          alt="dfdfg"
          src={require("../assets/photos/mainlogo.png")}
          className="w-60  animate-fade-down"
          style={{ filter: "drop-shadow(0px 0px 1px  white)" }}
        />
        <p
          className="text-center font-semibold text-xl text-gray-200 mt-4 animate-flip-up "
          
        >
          Sneakbooker Original
        </p>
      </div>
    </div>
  );
}
