import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserTie,
  FaBuilding,
} from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import successImg from "../../assets/photos/success1-1--unscreen.gif";
import {
  AddNewBelowMember,
  GetUserDetails,
} from "../../Controllers/User/UserController";
import { Loading1, Loading3 } from "../Loading1";
import { IoMdCloseCircle } from "react-icons/io";

const AddNewMember = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [position, setPosition] = useState("L");
  const [password, setPassword] = useState("");
  const [reffer_by, setReffer_by] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formData = {
    name: name,
    email: email,
    mobile: mobile,
    position: position,
    password: password,
    reffer_by: reffer_by,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (name.length < 3) {
      setError("Invalid Name");
      setLoading(false);
      return;
    } else if (email.length < 10) {
      setError("Invalid Email");
      setLoading(false);
      return;
    } else if (mobile.length !== 10) {
      setError("Invalid Mobile Number");
      setLoading(false);
      return;
    } else if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    try {
      const response = await AddNewBelowMember(formData);
      if (response.status) {
        setSuccess(true); 
      }  
    } catch (error) { 
      if (error.response.status === 302) {
        setError(`${error.response.data.message}`, {
          position: "top-center",
        });
      } else {
        setError("Server Error ! Try Again...", {
          position: "top-center",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-10 dark:text-gray-200 pr-3 py-2 rounded-lg border dark:bg-gray-800   focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200";

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      setReffer_by(response[0].reffer_code);
      setLoading(false);
    }
  };

  useEffect(() => {
    userDataGet();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
        <Loading3 />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center   bg-white p-2">
      <div className="w-full   bg-indigo-200 dark:bg-gray-800 rounded-lg shadow-lg p-8 m-2">
        <h2 className="text-2xl font-bold dark:text-gray-200 mb-6 text-center">
          Add New Member
        </h2>
        <p className="text-[red] font-medium text-lg">{error}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block mb-1 font-medium dark:text-gray-200"
              >
                Name
              </label>
              <div className="relative">
                <FaUser className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Enter name"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-1 font-medium dark:text-gray-200"
              >
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="Enter email"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block mb-1 font-medium dark:text-gray-200"
              >
                Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute top-3 rotate-90 left-3 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className={inputClass}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="address"
                className="block mb-1 font-medium dark:text-gray-200"
              >
                Password
              </label>
              <div className="relative">
                <MdOutlineSecurity className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="password"
                  id="address"
                  name="address"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Enter Password"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="role"
                className="block mb-1 font-medium dark:text-gray-200"
              >
                Position
              </label>
              <div className="relative">
                <FaUserTie className="absolute top-3 left-3 text-gray-400" />
                <select
                  className={inputClass}
                  onChange={(e) => setPosition(e.target.value)}
                >
                  <option defaultChecked value="L">
                    LEFT
                  </option>
                  <option value="R">RIGHT</option>
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="department"
                className="block mb-1 font-medium dark:text-gray-200"
              >
                Sponsor
              </label>
              <div className="relative">
                <FaBuilding className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  id="department"
                  disabled
                  name="department"
                  required
                  value={reffer_by}
                  onChange={(e) => setReffer_by(e.target.value)}
                  className={inputClass}
                  placeholder="Enter department"
                />
              </div>
            </div>
          </div>
          <div className="mt-10 flex gap-2">
            <button
              type="submit"
              className="w-60 mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {loading ? <Loading1 width={26} /> : "Add Member"}
            </button>
            <button className="w-60 mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Clear
            </button>
          </div>
        </form>
      </div>

      {success && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-[#080808] z-[9999]">
          <img alt="success" className="w-40" src={successImg} />
          <p className="text-2xl text-white text-center font-semibold">
            New Member Added In Your Network
          </p>
          <div className="bg-indigo-100 px-6 w-[95vw] md:w-[50vw] lg:w-[30vw] py-2 mt-2">
            <p className="text-center border-b-2 mb-2 font-bold rounded-lg bg-indigo-200">
              Account Detail
            </p>
            <div className="text-md font-medium flex flex-col gap-1">
              <div className="flex justify-between border-b-[1px] border-gray-200">
                <p>Name: </p> <p>{name && name}</p>
              </div>
              <div className="flex justify-between border-b-[1px] border-gray-200">
                <p>Email: </p> <p>{email && email}</p>
              </div>
              <div className="flex justify-between border-b-[1px] border-gray-200">
                <p>Mobile: </p> <p>{mobile && mobile}</p>
              </div>
              <div className="flex justify-between border-b-[1px] border-gray-200">
                <p>Password: </p> <p>{password && password}</p>
              </div>
              <div className="flex justify-between border-b-[1px] border-gray-200">
                <p>Position In Network: </p> <p>{position && position}</p>
              </div>
            </div>
          </div>
          <IoMdCloseCircle
            className="cursor-pointer mt-4 hover:scale-[1.2] "
            onClick={() => {
              setSuccess(false);
              window.location.href = "/home?network=direct-downline";
            }}
            size={24}
            color="white"
          />
        </div>
      )}
    </div>
  );
};

export default AddNewMember;
