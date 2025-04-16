import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GetAllCasinoGames } from "../../Controllers/User/UserController";

export default function Games() {
  const [games, setGames] = React.useState([]);
  const [selected, setSelected] = useState(1);
  const navigate = useNavigate();

  const formData = {};
  const handleCasinoSelect = async (item) => {
    formData.providerCode = item.providerCode;
    formData.gameCode = item.code;
    const formDataString = JSON.stringify(formData);
    const encodedFormData = btoa(formDataString);

    const encodedParam = encodeURIComponent(encodedFormData);

    navigate(`?game=casino-lobby&data=${encodedParam}`);
  };

  useEffect(() => {
    const allCasinoGames = async () => {
      try {
        const response = await GetAllCasinoGames();
        setGames(response?.data?.games);
      } catch (error) {
        window.alert("Something Went Wrong.");
      }
    };

    allCasinoGames();
  }, []);
  return (
    <div>
      <div className="flex justify-between md:hidden  mt-4 ">
        <div
          className={`w-[49%] rounded-t-md py-2 text-[#283B90] bg-[#dcad5e] text-center  font-bold text-xl ${
            selected === 1 && "  border-b-4 border-[#f6d368]"
          }`}
          onClick={() => setSelected(1)}
        >
          <p className=" ">GAMES </p>
        </div>
        <div
          className={`w-[49%] rounded-t-md py-2 text-[#283B90] bg-[#dcad5e] text-center  font-bold text-xl   ${
            selected === 2 && "border-b-4 border-[#f6d368]"
          }`}
          onClick={() => setSelected(2)}
        >
          <p className=" ">CASINO </p>
        </div>
      </div>

      <div className="border-4  md:border-0 border-[#f6d368]">
        {selected === 1 ? (
          <div className="flex flex-wrap justify-around md:justify-start md:gap-[1.3%]   px-1 py-3   ">
            {gameData.map((item, index) => (
              <Link
                to={item.to}
                key={index}
                className="w-[32%] md:w-[19%] lg:w-[15%] mb-4   bg-gray-300 rounded-md md:rounded-xl"
              >
                <img alt="poster" src={item.image} className="rounded-xl" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-around pt-3 gap-[1.3%]  ">
            {games &&
              games
                .filter((item) => item.providerName === "Supernowa")
                .map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleCasinoSelect(item)}
                    className="w-[48%] md:w-[23%] border lg:w-[15%] mb-2 bg-black/30 cursor-pointer"
                  >
                    <img alt="banner" src={item.thumb} className="w-full" />
                  </div>
                ))}
          </div>
        )}
      </div>

      {/* <Link
        className="cursor-pointer"
        to={{ pathname: "/home", search: `?game=casino` }}
      >
        <img
          alt="casino poater"
          src={require("../../assets/photos/casino-1.jpg")}
          className="w-full mb-4"
        />
      </Link> */}

      {/* casions--------- */}
      {/* <div className="flex flex-wrap  pt-3 gap-[1.3%]  hidden md:flex">
        {games &&
          games
            .filter((item) => item.providerName === "Supernowa")
            .map((item, index) => (
              <div
                key={index}
                onClick={() => handleCasinoSelect(item)}
                className="w-[48%] md:w-[23%] border lg:w-[15%] mb-2 bg-black/30 cursor-pointer"
              >
                <img alt="banner" src={item.thumb} className="w-full" />
              </div>
            ))}
      </div> */}
    </div>
  );
}

const gameData = [
  {
    id: 1,
    image: require("../../assets/photos/colorgame1.png"),
    to: { pathname: "/home", search: "?game=color-game" },
  },
  {
    id: 2,
    image: require("../../assets/photos/minesgme.png"),
    to: { pathname: "/home", search: "?game=mines" },
  },
  {
    id: 3,
    image: require("../../assets/photos/wheel.png"),
    to: { pathname: "/home", search: "?game=wheel" },
  },
  {
    id: 3,
    image: require("../../assets/photos/limbo.png"),
    to: { pathname: "/home", search: "?game=limbo" },
  },
  {
    id: 3,
    image: require("../../assets/photos/dragon-tower.png"),
    to: { pathname: "/home", search: "?game=dragon-tower" },
  },
  {
    id: 3,
    image: require("../../assets/photos/coin-flip.png"),
    to: { pathname: "/home", search: "?game=coin-flip" },
  },
  // {
  //   id: 4,
  //   image: require("../../assets/photos/aviator.png"),
  //   to: {
  //     pathname: "/home",
  //     search:
  //       "?game=casino-lobby&data=eyJwcm92aWRlckNvZGUiOiJQRyIsImdhbWVDb2RlIjoiQVRSIn0%3D",
  //   },
  // },
  // {
  //   id: 4,
  //   image: require("../../assets/photos/dragon.png"),
  //   to: {
  //     pathname: "/home",
  //     search:
  //       "?game=casino-lobby&data=eyJwcm92aWRlckNvZGUiOiJTTiIsImdhbWVDb2RlIjoiRFQ3TSJ9",
  //   },
  // },

  // {
  //   id: 4,
  //   image: require("../../assets/photos/ander.png"),
  //   to: {
  //     pathname: "/home",
  //     search:
  //       "?game=casino-lobby&data=eyJwcm92aWRlckNvZGUiOiJTTiIsImdhbWVDb2RlIjoiQUJDIn0%3D",
  //   },
  // },
  // {
  //   id: 4,
  //   image: require("../../assets/photos/LUCKY.png"),
  //   to: {
  //     pathname: "/home",
  //     search:
  //       "?game=casino-lobby&data=eyJwcm92aWRlckNvZGUiOiJTTiIsImdhbWVDb2RlIjoiVUQ3In0%3D",
  //   },
  // },
  // {
  //   id: 4,
  //   image: require("../../assets/photos/3PATTI.png"),
  //   to: {
  //     pathname: "/home",
  //     search:
  //       "?game=casino-lobby&data=eyJwcm92aWRlckNvZGUiOiJTTiIsImdhbWVDb2RlIjoiVFAyMCJ9",
  //   },
  // },
  // {
  //   id: 4,
  //   image: require("../../assets/photos/VIEWALL.png"),
  //   to: { pathname: "/home", search: "?game=casino" },
  // },
];
