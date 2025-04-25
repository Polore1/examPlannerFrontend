import { useEffect, useState } from "react";
import { fetchCourses, logout } from "../../api/api"; // 👈 import funcții API
import "./Home.css";
import Descarcare from "../Descarcare/Descarcare";
import Examene from "../Examene/Examene";
import Setari from "../Setari/Setari";
import Courses from "../Courses/Courses"; // Importă noua componentă Courses
import Navbar from "../../components/Navbar"; // Importăm Navbar

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("courses");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");
    setUserRole(role);
    if (!token) {
      setError("⚠️ Autentificare necesară.");
      return;
    }

    fetchCourses(token)
      .then((data) => {
        setCourses(data);
        setFilteredCourses(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleLogout = () => {
    logout()
      .then(() => {
        window.location.href = "/";
      })
      .catch((err) => {
        console.error("Logout error:", err);
        setError("Logout eșuat.");
      });
  };

  if (error) {
    return <div className="home-container">{error}</div>;
  }

  return (
    <div className="home-container">
      {/* Include navbar în Home */}
      <Navbar
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
      />

      {activeTab === "courses" && (
        <Courses courses={courses} setFilteredCourses={setFilteredCourses} />
      )}

      {activeTab === "exams" && userRole === "SEC" && <Examene />}
      {activeTab === "settings" && (userRole === "ADM" || userRole === "SEC") && <Setari />}
      {activeTab === "descarcare" && (userRole === "ADM" || userRole === "SEC") && <Descarcare />}
    </div>
  );
};

export default Home;
