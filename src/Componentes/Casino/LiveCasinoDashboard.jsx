import React, { useEffect, useState } from "react";
import {
  CasinoAuth,
  GetAllCasinoGames,
  GetUserDetails,
} from "../../Controllers/User/UserController";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LiveCasinoDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [gameData, setGameData] = useState([]);
  const [uniqueGameData, setUniqueGameData] = useState([]);
  const [providerName, setProviderName] = useState(""); 

  const formData = {};
  const handleCasinoSelect = async (item) => {
    formData.providerCode = item.providerCode;
    formData.gameCode = item.code;
    const formDataString = JSON.stringify(formData);
    const encodedFormData = btoa(formDataString);

    const encodedParam = encodeURIComponent(encodedFormData);

    navigate(`?game=casino-lobby&data=${encodedParam}`);
  };

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      formData.displayName = response[0].uname;
      formData.mobile = response[0].mobile;
      formData.id = response[0].id;
    }
  };

  useEffect(() => {
    const allCasinoGames = async () => {
      try {
        const response = await GetAllCasinoGames();
        setGameData(response?.data?.games);
      } catch (error) {
        window.alert("Something Went Wrong.")
      }
    };

    allCasinoGames();
  }, []);

  useEffect(() => {
    const uniqueGameData = gameData?.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.providerName === value.providerName)
    );
    setUniqueGameData(uniqueGameData);
  }, [gameData]);

  useEffect(() => {
    userDataGet();
  }, []);

  return (
    <div className="w-full   mx-auto p-4 min-h-screen">
      {/* Tab navigation */}
      <div className="flex gap-4 overflow-x-scroll pb-4 ">
        <button
          onClick={() => {
            setActiveTab(0);
            setProviderName("");
          }}
          className={`min-w-40 px-6 py-1.5 text-nowrap    text-xs font-medium    rounded-full focus:outline-none transition duration-300 ease-in-out ${
            activeTab === 0
              ? "border-b-2 border-gray-100 text-blue-500 bg-[#1FB173] text-white"
              : "  bg-gray-200"
          }`}
        >
          All
        </button>
        {uniqueGameData &&
          uniqueGameData.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveTab(index + 1);
                setProviderName(item.providerName);
              }}
              className={`min-w-40 px-6 py-1.5 text-nowrap text-xs font-medium rounded-full focus:outline-none transition duration-300 ease-in-out ${
                activeTab === index + 1
                  ? "border-b-2 border-gray-100 text-blue-500 bg-[#1FB173] text-white"
                  : "bg-gray-200"
              }`}
            >
              {item.providerName}
            </button>
          ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 border border-gray-300 mt-4 rounded-lg flex flex-wrap gap-4 justify-between ">
        {activeTab === 0
          ? gameData &&
            gameData.map((item, index) => (
              <div
                className="cursor-pointer w-[46%] md:w-[23%] lg:w-[18%] hover:border-2 border-2 border-gray-700"
                onClick={() => handleCasinoSelect(item)}
                key={index}
              >
                <img alt="banner" src={item.thumb} className="w-full" />
              </div>
            ))
          : gameData
              ?.filter((item2) => item2.providerName === providerName)
              ?.map((item3, index3) => (
                <div
                  className="cursor-pointer w-[46%] md:w-[23%] lg:w-[18%] border-gray-700 hover:border-gray-200 border-2 "
                  onClick={() => handleCasinoSelect(item3)}
                  key={index3}
                >
                  <img alt="banner" src={item3.thumb} className="w-full" />
                </div>
              ))}
      </div>
    </div>
  );
}
