import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("user");
    navigate("/");
  }, [navigate]);

  return <p className="text-center mt-5">Logging out...</p>;
};

export default Logout;
