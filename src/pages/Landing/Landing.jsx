import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api/config";
import "./Landing.css";
import logoUsv from "../../assets/logo-usv.jpg";// Import logo-ul din assets

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");
    const role = params.get("role");

    if (token && role) {
      localStorage.setItem("access_token", token);
      localStorage.setItem("user_role", role);
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = () => {
    window.location.href = `${BASE_URL}/login`;
  };

  return (
    <div className="landing-container">
      <div className="login-card">
        <img src={logoUsv} alt="USV Logo" className="usv-logo" />
        <h1>Exam Planner</h1>
        <p>Platformă academică pentru gestiunea examenelor</p>
        <button className="login-button" onClick={handleLogin}>
          🔐 Autentificare cu contul Google
        </button>
      </div>
    </div>
  );
};

export default Landing;
