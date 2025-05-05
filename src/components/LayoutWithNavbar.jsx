import React, { useState, useEffect } from "react";  // Adaugă această linie pentru a importa hook-urile
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const LayoutWithNavbar = ({ userRole }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("home");

  // Determinăm tab-ul activ pe baza locației curente
  useEffect(() => {
    if (location.pathname === "/courses") {
      setActiveTab("courses");
    } else if (location.pathname === "/home") {
      setActiveTab("home");
    } else if (location.pathname === "/settings") {
      setActiveTab("settings");
    } else if (location.pathname === "/descarcare") {
      setActiveTab("descarcare");
    }
  }, [location.pathname]);

  return (
    <div>
      {/* Transmite activeTab și setActiveTab către Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />

      {/* Restul conținutului paginii */}
      <Outlet />
    </div>
  );
};

export default LayoutWithNavbar;
