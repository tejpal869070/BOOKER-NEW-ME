import axios from "axios";
import { API } from "../Api";

var email = sessionStorage.getItem("email");
var bearerToken = sessionStorage.getItem("token");
var mobile = "8690708302";

export const GetUserDetails = async () => {
  try {
    const postData = {
      email: email,
    };

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    const response = await axios.post(
      `${API.url}get-user-details`,
      postData,
      axiosConfig
    );
    return response;
  } catch (error) {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
    window.location.href = "/home";
    return null;
  }
};

export const ChangePasswordControll = async (formData) => {
  try {
    const postData = {
      mobile: mobile,
      password: formData.password,
      new_password: formData.new_password,
    };

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    const response = await axios.post(
      `${API.url}user/change-password`,
      postData,
      axiosConfig
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DepositRequest = async (formData) => {
  const formDataToSend = new FormData();
  formDataToSend.append("transection_id", formData.utr);
  formDataToSend.append("mobile", mobile);
  formDataToSend.append("image", formData.image);
  formDataToSend.append("amount", formData.amount);
  formDataToSend.append("deposit_id", formData.deposit_id);

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "multipart/form-data",
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/deposit-request`,
      formDataToSend,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetPaymentMethod = async () => {
  const postData = {
    mobile: mobile,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/get-pay-method`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const CreateAccountPin = async (pin) => {
  const postData = {
    email: email,
    pin: pin,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };

  const response = await axios.post(
    `${API.url}create-pin`,
    postData,
    axiosConfig
  );
  return response;
};

export const GetUserPaymentHistory = async (type) => {
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
    `${API.url}get-user-deposit-history`,
    postData,
    axiosConfig
  );
  return response;
};

export const GetInvestmentPlans = async () => {
  try {
    const response = await axios.post(`${API.url}user/get-plans`);
    if (response.data.status) {
      return response.data.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const MakeNewInvestment = async (formData) => {
  const postData = {
    mobile: mobile,
    pin: formData.pin,
    amount: formData.amount,
    plan: formData.investmentPlan,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/make-new-investment`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const MyInvestMentHistory = async (formData) => {
  const postData = {
    mobile: mobile,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/get-investment-plan`,
      postData,
      axiosConfig
    );
    if (response.data.status) {
      return response.data.data.reverse();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const UpdateUserDetails = async (formData) => {
  const postData = {
    mobile: mobile,
    bank_name: formData.bank_name,
    ifsc_code: formData.ifsc_code,
    ac_no: formData.ac_no,
    ac_name: formData.ac_name,
    ac_type: formData.ac_type,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/update-user-details`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const AddWithdrawalRequest = async (pin, amount) => {
  const postData = {
    mobile: mobile,
    amount: amount,
    pin: pin,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/add-withdrawal-request`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const AddCryptoWithdrawalRequest = async (formData, pin) => {
  const postData = {
    email: email,
    amount: formData.amount,
    pin: pin,
    withdrawal_address: formData.address,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  const response = await axios.post(
    `${API.url}add-withdrawal-request`,
    postData,
    axiosConfig
  );
  return response;
};

export const RemoveWithdrawalRequest = async (id) => {
  const postData = {
    email: email,
    id: id,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };

  const response = await axios.post(
    `${API.url}cancel-withdrawal-request`,
    postData,
    axiosConfig
  );
  return response.data;
};

export const AddCryptoDepositRequest = async (formData) => {
  const postData = new FormData();

  postData.append("amount", formData.amount);
  postData.append("transection_hash", formData.transection_id);
  postData.append("image", formData.image);
  postData.append("deposit_to", formData.deposit_to);
  postData.append("email", email);

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}add-deposit-request`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAccountAllStatement = async (formData) => {
  const postData = {
    email: email,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };

  const response = await axios.post(
    `${API.url}get-statement`,
    postData,
    axiosConfig
  );
  return response.data;
};

export const GetGameWalletStatement = async (page) => {
  const postData = {
    email: email,
    page: page,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };

  const response = await axios.post(
    `${API.url}get-all-game-statement`,
    postData,
    axiosConfig
  );
  return response.data;
};

export const SendRequestForChangeAccount = async (formData) => {
  const postData = {
    mobile: mobile,
    bank_name: formData.bank_name,
    ifsc_code: formData.ifsc_code,
    ac_name: formData.ac_name,
    ac_no: formData.ac_no,
    ac_type: formData.ac_type,
    reason: formData.reason,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/update-bankdetails`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const AddNewBelowMember = async (formData) => {
  const postData = {
    name: formData.name,
    mobile: formData.mobile,
    email: formData.email,
    position: formData.position,
    password: formData.password,
    reffer_by: formData.reffer_by,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/add-member`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetTree = async (uid) => {
  const postData = {
    mobile: mobile,
    uid: uid,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/get-tree`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetDirectDownline = async (formData) => {
  const postData = {
    mobile: mobile,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/get-direct-downline`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetMyDownline = async (formData) => {
  const postData = {
    mobile: mobile,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/get-my-downline`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetVipPlans = async () => {
  const postData = {
    mobile: mobile,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/get-wagering`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CasinoAuth = async (formData) => {
  const data = {
    gameCode: formData.gameCode,
    providerCode: formData.providerCode,
    id: formData.id,
    currency: "INR",
    displayName: formData.displayName,
    mobile: formData.mobile,
  };

  try {
    const response = await axios.post(
      `${API.url}user/get-single-casino`,
      data,
      {
        proxy: {
          host: "97.74.84.91",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetAllCasinoGames = async (formData) => {
  try {
    const postData = {
      mobile: mobile,
    };
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };
    const response = await axios.post(
      `${API.url}user/get-casino-games`,
      postData,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetReffer = async () => {
  const postData = {
    mobile: mobile,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/get-reffer`,
      postData,
      axiosConfig
    );
    if (response.data.status) {
      return response.data.data.reverse();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const GetRoi = async () => {
  const postData = {
    mobile: mobile,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/get-roi`,
      postData,
      axiosConfig
    );
    if (response.data.status) {
      return response.data.data.reverse();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const GetLevelIncome = async () => {
  const postData = {
    mobile: mobile,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/get-level-income`,
      postData,
      axiosConfig
    );
    if (response.data.status) {
      return response.data.data.reverse();
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const GetMatchingIncome = async () => {
  const postData = {
    mobile: mobile,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/get-matching-income`,
      postData,
      axiosConfig
    );
    if (response.data.status) {
      return response.data.data.reverse();
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const ClaimReward = async (type) => {
  const postData = {
    mobile: mobile,
    type: type,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await axios.post(
      `${API.url}user/claim-reward`,
      postData,
      axiosConfig
    );
    if (response.status) {
      return response?.data?.amount;
    }
  } catch (error) {
    throw error;
  }
};

export const forgetPassword = async (email, password) => {
  const response = await axios.post(`${API.url}forget-password`, {
    email,
    password,
  });
  return response;
};
