import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onLogout, activeTab, setActiveTab, userRole }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home">🎓 USV Exam Planner - SEC</Link>
      </div>
      <div className="navbar-links">
        <button
          onClick={() => setActiveTab("courses")}
          className={`tab-button ${activeTab === "courses" ? "active" : ""}`}
        >
          📚 Cursuri
        </button>
        
        <button
          onClick={() => setActiveTab("exams")}
          className={`tab-button ${activeTab === "exams" ? "active" : ""}`}
        >
          📝 Examene
        </button>

        {(userRole === "ADM" || userRole === "SEC") && (
          <button
            onClick={() => setActiveTab("settings")}
            className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
          >
            ⚙️ Setări
          </button>
        )}

        {(userRole === "ADM" || userRole === "SEC") && (
          <button
            onClick={() => setActiveTab("descarcare")}
            className={`tab-button ${activeTab === "descarcare" ? "active" : ""}`}
          >
            📂 Descarcă
          </button>
        )}

        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
