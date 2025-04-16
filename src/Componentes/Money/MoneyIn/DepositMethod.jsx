import React from "react";
import { MdCancel } from "react-icons/md";
import Slider from "react-slick";
import { API } from "../../../Controllers/Api";

export default function DepositMethod({ onClose, paymentMethods }) {
  const classes1 = "flex justify-between border-b border-gray-500 mb-2";

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
  };
 
  return (
    <div className="fixed animate-fade-down animate-duration-[500ms] top-0 left-0 w-full h-full flex justify-center pt-10  bg-gray-400 bg-opacity-50 z-[9999]">
      <div className="  bg-gradient-to-r from-gray-700   text-white   rounded h-[60vh] w-[90vw]  lg:w-[30vw] to-slate-900 p-10 pt-6 inline-block">
        <MdCancel
          size={28}
          className="cursor-pointer m-auto"
          onClick={onClose}
        /> 
        <Slider {...settings}>
          {paymentMethods.map((item, index) =>
            item.type === "Bank" ? (
              <div className="flex flex-col mt-8 gap-8">
                <p className="text-center text-xl text-gray-200 font-medium">
                  ---{item.type} Deposit---
                </p>
                <div className={`${classes1} mt-4`}>
                  <p>Bank Name :</p>
                  <p>{item.bank_name}</p>
                </div>

                <div className={`${classes1}`}>
                  <p>Bank Holder : </p>
                  <p>{item.name}</p>
                </div>

                <div className={`${classes1}`}>
                  <p>Account No. : </p>
                  <p>{item.ac_no}</p>
                </div>

                <div className={`${classes1}`}>
                  <p>IFSC Code : </p>
                  <p>{item.ifsc_code}</p>
                </div>

                <div className={`${classes1}`}>
                  <p>Acc. Type : </p>
                  <p>{item.ac_type}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-row justify-center mt-6">
                <p className="text-center text-xl text-gray-200 font-medium">
                  ---{item.type} Deposit---
                </p>
                <p className="mt-6 text-center">UPI ID : {item.upi_id}</p>
                <div>
                  <img
                    alt="qr"
                    className="w-40 h-40 m-auto mt-2"
                    src={`${API.url}assets/img/${item.qr_code}`}
                  />
                </div>
              </div>
            )
          )}
        </Slider>
      </div>
    </div>
  );
}
