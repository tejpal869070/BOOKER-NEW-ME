import axios from "axios";
import { API } from "../Api";
import CryptoJS from "crypto-js";

var EncodedMobile = btoa(JSON.stringify(sessionStorage.getItem("mobile")));
var mobile = sessionStorage.getItem("mobile");
var email = sessionStorage.getItem("email");

var bearerToken = sessionStorage.getItem("token");

export const DecodeString = async (str) => {
  const decodedurl = atob(str);
  return JSON.parse(decodedurl);
};

export const EncodeString = async (str) => {
  const encodedurl = btoa(JSON.stringify(str));
  return encodedurl;
};

export const GetGameTypes = async () => {
  try {
    const postData = {
      data: EncodedMobile,
    };
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };
    const response = await axios.post(
      `${API.colorGameUrl}/get-game-type`,
      postData,
      axiosConfig
    );
    const decodedData = await DecodeString(response?.data);
    return decodedData;
  } catch (error) {
    throw error;
  }
};

export const ColorGameNumbers = async (id) => {
  try {
    const data = await EncodeString({ mobile, id });
    const postData = {
      data: data,
    };
    const response = await axios.post(
      `${API.colorGameUrl}get-game-mapping-number`,
      postData
    );
    const decodedData = await DecodeString(response.data);
    return decodedData;
  } catch (error) {
    throw error;
  }
};

export const ColorGameColors = async (id) => {
  try {
    const data = await EncodeString({ mobile, id });
    const postData = {
      data: data,
    };
    const response = await axios.post(
      `${API.colorGameUrl}get-game-mapping-color`,
      postData
    );
    const decodedData = await DecodeString(response.data);
    return decodedData;
  } catch (error) {
    throw error;
  }
};

export const ColorGameCurrentData = async (id) => {
  try {
    const data = await EncodeString({ mobile, id });
    const postData = {
      data: data,
    };
    const response = await axios.post(
      `${API.colorGameUrl}get-record-not-complete`,
      postData
    );
    const decodedData = await DecodeString(response.data);
    return decodedData;
  } catch (error) {
    throw error;
  }
};

export const ColorGameAllResult = async (id) => {
  try {
    let page = 1;
    const data = await EncodeString({ mobile, id, page });
    const postData = {
      data: data,
    };
    const response = await axios.post(
      `${API.colorGameUrl}get-record-complete`,
      postData
    );
    const decodedData = await DecodeString(response.data);
    return decodedData;
  } catch (error) {
    throw error;
  }
};

export const MyColorGameHistory = async (id, page) => {
  try {
    const data = await EncodeString({ mobile, id, page });
    const postData = {
      data: data,
    };
    const response = await axios.post(
      `${API.colorGameUrl}get-bet-record`,
      postData
    );
    const decodedData = await DecodeString(response.data);
    return decodedData;
  } catch (error) {
    throw error;
  }
};

export const AddNewColorGameBet = async (formData) => {
  const select = formData.select;
  const color = formData.color;
  const period = formData.period;
  const method = formData.method;
  const game_type = formData.game_type;
  const id = formData.id;
  const total_amount = formData.total_amount;
  const bonuscheck = false;
  try {
    const data = await EncodeString({
      select,
      color,
      period,
      method,
      game_type,
      id,
      total_amount,
      mobile,
      bonuscheck,
    });
    const postData = {
      data: data,
    };
    const response = await axios.post(
      `${API.colorGameUrl}add-bet-details`,
      postData
    );
    const decodedData = await DecodeString(response.data);
    return decodedData;
  } catch (error) {
    throw error;
  }
};

export const MainGameWalletMoneyTransfer = async (formData, pin) => {
  const postData = {
    email: email,
    pin: pin,
    amount: formData.amount,
    type: formData.type,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };

  const response = await axios.post(
    `${API.url}inter-wallet-money-transfer`,
    postData,
    axiosConfig
  );

  return response.data;
};

export const MinesGameUpdateWallet = async (formData) => {
  const amount = formData.amount;
  const type = formData.type;
  const game_type = formData.game_type;
  const details = formData.details || {};
  // const timestampResponse = await GetServerCurrentTime();
  // const date = timestampResponse;
  // const timestamp = new Date(date).getTime();

  const data = {
    amount,
    type,
    game_type,
    // timestamp,
    details,
  };

  const secretKey = process.env.REACT_APP_WALLET_UPDATE_KEY;

  const encodedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();

  const postData = {
    email: email,
    data: encodedData,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };

  const response = await axios.post(
    `${API.url}deduct-game-wallet`,
    postData,
    axiosConfig
  );

  return response.data;
};

export const GetServerCurrentTime = async () => {
  try {
    const response = await axios.post(`${API.url}user/get-current-time `);
    if (response.data.status) {
      return response?.data?.current_time;
    }
  } catch (error) {
    throw error;
  }
};

export const GetGameHistoryByType = async (type) => {
  const postData = {
    email: email,
    type: type,
  };
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  const response = await axios.post(
    `${API.url}get-game-statement `,
    postData,
    axiosConfig
  );
  return response;
};

export const getAllGames = async () => {
  const response = await axios.post(`${API.url}user/get-games `);
  return response;
};

export const getAllMatch = async () => {
  const response = await axios.post(`${API.url}admin/get-all-match `);
  return response;
};

export const getSingleMatchData = async (id) => {
  const response = await axios.post(`${API.url}admin/get-single-match-detail `, {
    id,
  });
  return response;
};

export const addMatchBet = async (formData) => {
  const data = {
    email: email,
    match_id: formData.match_id,
    bet_type: formData.type,
    bet_value: formData.type === "L" ? formData.lastDigit : formData.exectRun,
    amount: formData.amount,
    section_id: formData.section_id,
    selectedTeamName : formData.selectedTeamName
  };
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  const response = await axios.post(
    `${API.url}add-match-bet `,
    data,
    axiosConfig
  );
  return response;
};

export const getMyMatchBets = async () => {
  const data = {
    email : email
  };
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  const response = await axios.post(
    `${API.url}my-match-bets `,
    data,
    axiosConfig
  );
  return response;
};
