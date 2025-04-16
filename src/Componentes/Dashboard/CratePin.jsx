import React, { useState } from "react";
import OTPInput from "react-otp-input";
 import { ToastContainer, toast } from "react-toastify";import 'react-toastify/dist/ReactToastify.css';
import { CreateAccountPin } from "../../Controllers/User/UserController";
import { Loading1 } from "../Loading1";
import gif1 from "../../assets/photos/lock.png";

const CreatePin = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePinCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (pin.length < 4) {
      setError("Invalid PIN");
      setLoading(false);
      return;
    }
    setError("");
    try {
      const response = await CreateAccountPin(pin);
      if (response.status) {
        setSuccess(true);
        setLoading(false);
      } else {
        setError("Something Went Wrong");
        setLoading(false);
      }
    } catch (error) {
      setError("Server Error"); 
      setLoading(false);
    }
  };

  const refresh = () => {
    window.location.reload(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50  ">
      <div className="  flex items-center justify-center">
        {!success ? (
          <form
            onSubmit={handlePinCreate}
            className="bg-gradient-to-r from-blue-200 to-cyan-200 flex flex-col  items-center w-full mx-4 p-4 rounded-xl animate-fade-down animate-once animate-duration-500"
          >
            <div className="flex justify-between items center border-b border-gray-200 py-3">
              <div className="flex items-center justify-center">
                <p className="text-xl font-bold text-gray-800">
                  CREATE SECRET PIN CODE
                </p>
              </div>
            </div>
            <OTPInput
              value={pin}
              onChange={setPin}
              numInputs={4}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                border: "3px solid #ffb4b4",
                borderRadius: "10px",
                width: "50px",
                height: "50px",
                fontSize: "20px",
              }}
            />
            <p className="text-left text-[red] font-medium text-sm mt-2">
              {error}
            </p>
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="relative bg-[#919ffc] inline-flex items-center justify-start inline-block px-5 py-3 overflow-hidden font-bold rounded-full group"
              >
                <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
                <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-white opacity-100 group-hover:-translate-x-8"></span>
                <span className="relative w-full text-left text-gray-100 transition-colors duration-200 ease-in-out group-hover:text-gray-900">
                  {loading ? <Loading1 width={30} /> : "SUBMIT"}
                </span>
                <span className="absolute inset-0 border-2 border-white rounded-full"></span>
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-black flex flex-col  items-center w-full mx-4 p-4 rounded-xl animate-fade-down animate-once animate-duration-500 p-10">
            <img className="w-40 h-auto m-auto" alt="success" src={gif1} />
            <p
              className="mt-4 text-white font-semibold cursor-pointer p-1 bg-yellow-400 rounded-full px-4 text-sm"
              onClick={refresh}
            >
              CLOSE
            </p>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreatePin;
