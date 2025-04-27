import { useState, useEffect } from "react";
import { CheckToken } from "./AuthController";
import { Loading3 } from "../../Componentes/Loading1";

export const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const email = sessionStorage.getItem("email");
      const token = sessionStorage.getItem("token");

      if (!token || !email) {
        return (window.location.href = "/login");
      }

      try {
        await CheckToken();
        setIsAuthenticated(true);
      } catch (error) {
        return (window.location.href = "/login");
      }
    };

    checkToken();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="w-screen h-screen flex justify-center items-center m-auto ">
        <Loading3 />
      </div>
    );
  }

  return children;
};
