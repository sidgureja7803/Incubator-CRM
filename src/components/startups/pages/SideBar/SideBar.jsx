import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./SideBar.css";
import VLogo from '../../../../assets/VLogo.png';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="mainContainer">
      <div className="startup-sidebar">
        <div className="sidebar-logo">
          <img src={VLogo} alt="Venture Lab" />
        </div>

        <div className="sidebar-links">
          <NavLink to="/startup/dashboard" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
            <span className="icon">🏠</span>
            Dashboard
          </NavLink>

          <NavLink to="/startup/profile" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
            <span className="icon">👤</span>
            Startup Profile
          </NavLink>

          <NavLink to="/startup/incubators" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
            <span className="icon">🏢</span>
            Incubators
          </NavLink>

          <NavLink to="/startup/accelerators" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
            <span className="icon">🚀</span>
            Accelerators
          </NavLink>
        </div>

        <div className="logout-section">
          <button className="logout-button" onClick={handleLogout}>
            <span className="icon">🚪</span>
            Log Out
          </button>
        </div>
      </div>
      <div className="content-container">
        <Outlet />
      </div>
    </div>
  );
}
