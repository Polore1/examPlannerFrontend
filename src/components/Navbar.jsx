import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onLogout, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="navbar-logo">
          <span className="logo-text">🎓 USV Planificare Examene</span>
        </div>  
      </div>

      <div className="navbar-links">
        <button
          className={`tab-button ${isActive("/home") ? "active" : ""}`}
          onClick={() => navigate("/home")}
        >
          Acasă
        </button>

        
        {(userRole === "SEC") && (
          <>
            
            <button
              className={`tab-button ${isActive("/rooms") ? "active" : ""}`}
              onClick={() => navigate("/rooms")}
            >
              Clase
            </button>

            <button
              className={`tab-button ${isActive("/users/professors") ? "active" : ""}`}
              onClick={() => navigate("/users/professors")}
            >
              Profesori
            </button>

            <button
              className={`tab-button ${isActive("/descarcare") ? "active" : ""}`}
              onClick={() => navigate("/descarcare")}
            >
              Gestionare fișiere
            </button>

            <button
              className={`tab-button ${isActive("/settings") ? "active" : ""}`}
              onClick={() => navigate("/settings")}
            >
              Setări
            </button>
          </>
        )}

        {(userRole === "ADM" ) && (
          <>
            
            <button
              className={`tab-button ${isActive("/descarcare") ? "active" : ""}`}
              onClick={() => navigate("/descarcare")}
            >
              Gestionare fișiere
            </button>

            <button
              className={`tab-button ${isActive("/settings") ? "active" : ""}`}
              onClick={() => navigate("/settings")}
            >
              Setări
            </button>
          </>
        )}

        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
