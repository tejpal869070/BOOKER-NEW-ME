import React, { useState, useEffect } from "react";
import { Loading1, Loading3 } from "../Loading1";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CasinoAuth,
  GetUserDetails,
} from "../../Controllers/User/UserController";

export default function CasinoLobby() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [launchUrl, setLaunchUrl] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const encodedData = urlParams.get("data");

  const formData = {};

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      formData.displayName = response[0].uname;
      formData.mobile = response[0].mobile;
      formData.id = response[0].id;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (encodedData) {
        try {
          const decodedData = atob(decodeURIComponent(encodedData));
          const gameData = JSON.parse(decodedData);
          formData.gameCode = gameData.gameCode;
          formData.providerCode = gameData.providerCode;

          await userDataGet();

          const response = await CasinoAuth(formData);
          const launchUrl = response?.response?.launchURL;
          setLaunchUrl(launchUrl);
        } catch (err) {
          window.alert("Something Went Wrong");
        } finally {
          setLoading(false);
        }
      } else {
        navigate("?game=casino");
      }
    };

    fetchData();
  }, [encodedData, navigate]);

  if (loading) {
    return (
      <div className="fixed min-h-screen backdrop-blur-[1px] top-0 left-0 w-full h-full flex justify-center items-center   z-[9999]">
        <Loading3 />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {launchUrl && (
        <iframe
          src={launchUrl}
          frameBorder="0"
          className="w-full min-h-screen"
          allowFullScreen
          title="noneee"
        />
      )}
    </div>
  );
}
