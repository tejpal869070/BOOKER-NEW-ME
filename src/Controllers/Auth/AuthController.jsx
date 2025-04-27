import axios from "axios";
import { API } from "../Api";

var email = sessionStorage.getItem("email");
var bearerToken = sessionStorage.getItem("token");
var mobile = "8690708302";

export const CheckUserExistance = async (formData) => {
  const postData = {
    mobile: formData.mobile,
    email: formData.email,
  };

  const response = await axios.post(`${API.url}check-user-existance`, postData);

  return response;
};

export const userRegistration = async (formData) => {
  const postData = {
    user_name: formData.name,
    mobile: formData.mobile,
    password: formData.password,
    email: formData.email,
  };

  const response = await axios.post(`${API.url}register`, postData);

  return response;
};

export const userLogin = async (userData) => {
  const postData = {
    email: userData.email,
    password: userData.password,
  };

  const response = await axios.post(`${API.url}login`, postData);
  return response;
};

export const SendOtp = async (formData) => {
  const dataToSend = {
    email: formData.email,
  };
  const response = await axios.post(`${API.url}send-otp`, dataToSend);
  return response.data;
};

export const CheckToken = async () => {
  const postData = {
    email: email,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };

  const response = await axios.post(
    `${API.url}check-token`,
    postData,
    axiosConfig
  );
  return response;
};

export const VerifyOtp = async (formData) => {
  try {
    const postData = {
      email: formData.email,
      otp: formData.otp,
    };

    const response = await axios.post(`${API.url}verify-otp`, postData);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ForgetPasswordApi = async (formData) => {
  try {
    const dataToSent = {
      email: formData.email,
      password: formData.password,
      token: formData.token,
    };

    const response = await axios.post(
      `${API.url}user/forget-password`,
      dataToSent
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetUserNameByMobile = async (mobile) => {
  try {
    const dataToSent = {
      user_mobile: mobile,
    };

    const response = await axios.post(`${API.url}user/check-user`, dataToSent);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const SendMoneyToUser = async (formData, pin) => {
  try {
    const dataToSent = {
      pin: pin,
      mobile: mobile,
      amount: formData.amount,
      user_mobile: formData.userMobile,
    };

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    const response = await axios.post(
      `${API.url}user/money-transfer`,
      dataToSent,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const PinVerification = async (pin) => {
  const dataToSent = {
    pin: pin,
    email: email,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };

  const response = await axios.post(
    `${API.url}verify-pin`,
    dataToSent,
    axiosConfig
  );
  return response;
};

export const ChangeSecurityPin = async (formData) => {
  try {
    const dataToSent = {
      pin: formData.pin,
      email: formData.email,
      token: formData.token,
    };

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    const response = await axios.post(
      `${API.url}user/change-pin`,
      dataToSent,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
