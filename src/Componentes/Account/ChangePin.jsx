import React, { useEffect, useState } from "react";
import gif1 from "../../assets/photos/giff1.gif";
import { GetUserDetails } from "../../Controllers/User/UserController";
import {
  ChangeSecurityPin,
  SendOtp,
  VerifyOtp,
} from "../../Controllers/Auth/AuthController";
 import { ToastContainer, toast } from "react-toastify";import 'react-toastify/dist/ReactToastify.css';
import { Loading1 } from "../Loading1";
import OTPInput from "react-otp-input";
import successImg from "../../assets/photos/success1-1--unscreen.gif";

export default function ChangePin() {
  const [animation, setAnimation] = useState(true);
  const [user, setUser] = useState({});
  const [pin, setPin] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [token, setToken] = useState();
  const [isPinChanged, setIsPinChanged] = useState(false);
  const [pinChanging, setPinChanging] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showOtp, setShowOtp] = useState("");

  const handleSendOtp = async () => {
    setOtpSending(true);
    try {
      const formData = {
        email: user && user.email,
      };
      const response = await SendOtp(formData);
      if (response.status) {
        setIsOtpSent(true);
        setTimeout(() => {
          setIsOtpSent(false);
        }, 4500);
        setShowOtp(response.data[0].otp);
      }
    } catch (error) {
      toast.error("Error in Sending OTP !!!", {
        position: "top-center",
      });
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpVerifying(true);
    if (otp.length !== 4) {
      toast.error("Invalid OTP !!!", {
        position: "top-center",
      });
      setOtpVerifying(false);
      return;
    }
    try {
      const formData = {
        otp: otp,
        email: user && user.email,
      };
      const response = await VerifyOtp(formData);
      if (response.status) {
        setToken(response.token);
        setOtpVerified(true);
        toast.success("OTP Verified !", {
          position: "top-center",
        });
      } else {
        toast.error("Invalid OTP !!!", {
          position: "top-center",
        });
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        toast.error(`${error.response.data.msg}`, {
          position: "top-center",
        });
      } else {
        toast.error("Server Error !!!", {
          position: "top-center",
        });
      }
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleChangePin = async () => {
    setPinChanging(true);
    if (otp.length !== 4) {
      toast.error("Invalid OTP", {
        position: "top-center",
      });
      setPinChanging(false);
      return;
    } else if (pin.length !== 4) {
      toast.error("Invalid Pin !!!", {
        position: "top-center",
      });
      setPinChanging(false);
      return;
    } else if (!otpVerified) {
      toast.error("OTP Not Verified", {
        position: "top-center",
      });
      setPinChanging(false);
      return;
    }
    try {
      const formData = {
        pin: pin,
        email: user.email,
        token: token,
      };
      const response = await ChangeSecurityPin(formData);
      if (response.status) {
        setIsPinChanged(true);
        setTimeout(() => {
          setIsPinChanged(false);
        }, 3500);
        setOtp("");
        setPin("");
      } else {
        toast.error("Something Went Wrong !", {
          position: "top-center",
        });
      }
    } catch (error) {
      if (error.response.status === "302") {
        toast.error(`${error.response.data.message}`, {
          position: "top-center",
        });
      } else {
        toast.error("Something Went Wrong !!!", {
          position: "top-center",
        });
      }
    } finally {
      setPinChanging(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setAnimation(false);
    }, 2000);
  }, []);

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setUser(response[0]);
      setAnimation(false);
    }
  };

  useEffect(() => {
    userDataGet();
  }, []);

  if (animation) {
    return (
      <div className="absolute w-full h-full flex items-center justify-center align-center inset-0 bg-white z-[999999]">
        <img alt="animation" src={gif1} className="w-60" />
      </div>
    );
  }

  if (isPinChanged) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-[#000000d1] bg-opacity-50 z-[9999]">
        <img alt="success" src={successImg} />
        <p className="text-2xl text-white font-semibold">ACCOUNT SECURED.</p>
      </div>
    );
  }

  return (
    <div className="pb-10 h-screen">
      <p className="text-2xl font-bold dark:text-gray-200 border-b-2 pb-4 border-gray-800 dark:border-gray-400 ">
        Change Security PIN
      </p>
      <div className="relative mt-6">
        <p className="dark:text-gray-200 text-sm font-semibold">Email</p>
        <div
          className={`inline-flex w-110 overflow-hidden text-white rounded group ${
            isOtpSent ? "bg-[#44a744]" : " bg-gray-900"
          }`}
        >
          <p className="px-3.5 w-110  py-2 text-white text-xl font-semibold bg-purple-500 group-hover:bg-purple-600 flex items-center justify-center">
            {user && user.email}
          </p>
          {otpSending ? (
            <span
              className="cursor-pointer pl-4 pr-5 py-2.5"
              onClick={handleSendOtp}
            >
              <Loading1 width={22} />
            </span>
          ) : (
            <span
              className="cursor-pointer pl-4 pr-5 py-2.5"
              onClick={handleSendOtp}
            >
              {isOtpSent ? "OTP SENT" : "Send OTP"}
            </span>
          )}
        </div>

        <div className="mt-6">
          <p className="dark:text-gray-200 text-sm font-semibold">OTP {showOtp &&  `( Your OTP is ${showOtp}  )`}</p>
          <div
            className={`inline-flex   overflow-hidden text-white rounded group bg-gray-900  `}
          >
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="px-3.5 py-2 w-60 text-gray-800 text-xl font-semibold bg-purple-200   flex items-center justify-center"
            />

            <span
              className="cursor-pointer pl-4 pr-5 py-2.5"
              onClick={handleVerifyOtp}
            >
              {otpVerifying ? <Loading1 width={24} /> : "VERIFY"}
            </span>
          </div>
        </div>

        <div className="mt-6  ">
          <p className="dark:text-gray-200 text-sm font-semibold">
            Create New Pin
          </p>
          <OTPInput
            value={pin}
            inputType="tel"
            onChange={setPin}
            numInputs={4}
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
            inputStyle={{
              border: "3px solid #918e91",
              borderRadius: "4px",
              width: "50px",
              height: "50px",
              fontSize: "20px",
            }}
          />
        </div>

        <div
          onClick={handleChangePin}
          className="relative cursor-pointer inline-block px-4 py-2 w-80 text-center mt-6 font-medium group"
        >
          <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black dark:bg-purple-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
          <span className="absolute inset-0 w-full h-full bg-white border-2 border-black dark:border-purple-500 group-hover:bg-purple-500"></span>
          <span className="relative text-black font-bold group-hover:text-white">
            {pinChanging ? "PROCESSING..." : "SUBMIT"}
          </span>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
