import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ activeTab, setActiveTab, onLogout, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Obține locația curentă pentru a ajusta comportamentul navbar-ului

  // Funcția pentru navigarea către tab-ul corect
  const handleTabClick = (tab) => {
    setActiveTab(tab);

    // Navigare pe paginile corespunzătoare
    if (tab === "courses") {
      navigate("/courses");
    } else if (tab === "exams") {
      navigate("/home"); // Se presupune că examenele sunt în Home
    } else if (tab === "settings") {
      navigate("/settings"); // Navigare către setări
    } else if (tab === "descarcare") {
      navigate("/descarcare"); // Navigare către pagina de descarcare
    }
  };

  // Verificăm locația curentă (pentru a ascunde tab-urile pe pagina de Home)
  const isHomePage = location.pathname === "/home";

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home">🎓 USV Exam Planner</Link>
      </div>

      {/* Nu afișăm tab-urile pe pagina de Home */}
      {!isHomePage && (
        <div className="navbar-links">
          <button
            onClick={() => handleTabClick("courses")}
            className={`tab-button ${activeTab === "courses" ? "active" : ""}`}
          >
            📚 Cursuri
          </button>

          <button
            onClick={() => handleTabClick("exams")}
            className={`tab-button ${activeTab === "exams" ? "active" : ""}`}
          >
            📝 Examene
          </button>

          {/* Tab-urile de Setări și Descarcare sunt vizibile doar pentru utilizatori cu rol ADM sau SEC */}
          {(userRole === "ADM" || userRole === "SEC") && (
            <>
              <button
                onClick={() => handleTabClick("settings")}
                className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
              >
                ⚙️ Setări
              </button>

              <button
                onClick={() => handleTabClick("descarcare")}
                className={`tab-button ${activeTab === "descarcare" ? "active" : ""}`}
              >
                📂 Descarcă
              </button>
            </>
          )}

          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
