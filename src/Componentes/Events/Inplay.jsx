import React, { useState } from "react";
import Slider from "react-slick";
import banner1 from "../../assets/photos/banner1.png";
import banner2 from "../../assets/photos/banner2.png";
import banner3 from "../../assets/photos/banner3.jpeg";
import InplayCustom from "./CustomTab/InplayCustom";
import groundimg from "../../assets/photos/ground.webp";

const images = [banner1, banner2, banner3];

export default function Inplay() {
  const [selectedButton, setSelectedButton] = useState(1);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
  };

  //   custom button data
  const buttons = [
    { text: "INPLAY", value: 1 },
    { text: "TODAY", value: 2 },
    { text: "TOMORROW", value: 3 },
  ];

  return (
    <div className="w-full ">
      {/* Slider */}
      <Slider {...settings}>
        {images.map((item, index) => (
          <div key={index}>
            <img alt="side" className="w-full h-50" src={item} />
          </div>
        ))}
      </Slider>

      <div className="relative w-full h-80">
        {/* custom Tabs */}
        {/* <div className="  flex gap-4 mt-6 mb-8">
          {buttons.map((item, index) => (
            <button
              className="relative"
              onClick={() => setSelectedButton(index + 1)}
            >
              <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black dark:bg-gray-500"></span>
              <span
                className={`${
                  selectedButton === index + 1 ? "bg-yellow-400" : "bg-white"
                } fold-bold relative inline-block h-full w-full rounded border-2 border-black   px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900`}
              >
                {item.text}
              </span>
            </button>
          ))}
        </div> */}

        {/*Custom tabs display  */}
        {/* {selectedButton === 1 ? (
          <InplayCustom type="inplay" />
        ) : selectedButton === 2 ? (
          <InplayCustom type="today" />
        ) : selectedButton === 3 ? (
          <InplayCustom type="tomorrow" />
        ) : (
          ""
        )} */}

        <div
          className="absolute w-full h-full top-0 bg-black bg-cover bg-center flex inset-0 justify-center align-center items-center bg-no-repeat"
          style={{ backgroundImage: `url(${groundimg})` }}
        >
          <p
            className="text-6xl text-center font-bold  "
            style={{ textShadow: "3px 2px 19px white" }}
          >
            Coming Soon
          </p>
        </div>
      </div>
    </div>
  );
}
