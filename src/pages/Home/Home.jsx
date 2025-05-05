import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCourses, logout, fetchExamsForGroup, proposeExam } from "../../api/api";
import { fetchExamDetails } from "../../api/api"; 
import Descarcare from "../Descarcare/Descarcare";
import Examene from "../Examene/Examene";
import Setari from "../Setari/Setari";
import Courses from "../Courses/Courses";
import ExamDetails from '../Examene/ExamDetails'; 
import navigateWithError from "../../utils/navigateWithError"; 
import ExamPropose from "../Examene/PropuneExamen"
import './Home.css';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [examsForGroup, setExamsForGroup] = useState([]);
  const [examId, setExamId] = useState(5); 
  const [examDetails, setExamDetails] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");
    setUserRole(role);

    if (!token) {
      navigateWithError(navigate, "⚠️ Autentificare necesară.", "Token lipsă");
      return;
    }

    if (role !== "SG") {
      fetchCourses(token)
        .then((data) => {
          setCourses(data);
          setFilteredCourses(data);
        })
        .catch((err) => {
          navigateWithError(navigate, err.message, "Eroare la încărcarea cursurilor");
        });
    }
  }, [navigate]);

  const getExamsForGroup = () => {
    const token = localStorage.getItem("access_token");
    fetchExamsForGroup(token)
      .then((data) => {
        setExamsForGroup(data); 
      })
      .catch((err) => {
        navigateWithError(navigate, err.message, "Eroare la încărcarea examenelor");
      });
  };

  const getExamDetails = (examId) => {
    const token = localStorage.getItem("access_token");
    setLoading(true); 
    fetchExamDetails(examId, token)
      .then((data) => {
        setExamDetails(data); 
        setLoading(false); 
      })
      .catch((err) => {
        setLoading(false);
        navigateWithError(navigate, err.message, "Eroare la încărcarea examenului");
      });
  };

  const proposeNewExam = (examDetails) => {
    const token = localStorage.getItem("access_token");
    proposeExam(token, examDetails)
      .then((response) => {
        alert("Examen propus cu succes!");
      })
      .catch((err) => {
        navigateWithError(navigate, err.message, "Eroare la propunerea examenului");
      });
  };

  const handleLogout = () => {
    logout()
      .then(() => {
        window.location.href = "/";
      })
      .catch(() => {
        navigateWithError(navigate, "Logout eșuat.", "Eroare logout");
      });
  };

  return (
    <div className="home-container">
      {!activeTab && (
        <>
          <h1>Bine ai venit!</h1>
          <div className="tab-menu">
            {userRole !== "SG" && (
              <>
                <button className="tab-button" onClick={() => navigate("/exams")}>Adaugă Examene</button>
                <button className="tab-button" onClick={() => setActiveTab("descarcare")}>Descarcare fisiere</button>
                <button className="tab-button" onClick={() => navigate("/rooms")}>Vizualizare sali de clasa</button>
                <button className="tab-button" onClick={() => navigate("/courses")}>Vizualizare cursuri</button>
              </>
            )}

            {userRole === "SG" && (
              <>
                <button className="tab-button" onClick={getExamsForGroup}>Examenele Grupei</button>
                <button className="tab-button" onClick={() => navigate("/exam/propose")}> Propune Examen</button>
              </>
            )}

            <button className="tab-button" onClick={() =>  navigate("/settings")}>Setări</button>

            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </>
      )}

      <div className="tab-content">
        {loading && <div>Se încarcă detaliile examenului...</div>}
        
        {examDetails && !loading && (
          <ExamDetails details={examDetails} /> 
        )}

        {activeTab === "courses" && (
          <Courses courses={courses} setFilteredCourses={setFilteredCourses} />
        )}

        {activeTab === "exams" && userRole === "SEC" && <Examene />}
        {activeTab === "settings" && (userRole === "ADM" || userRole === "SEC") && <Setari />}
        {activeTab === "descarcare" && (userRole === "ADM" || userRole === "SEC") && <Descarcare />}
      </div>
    </div>
  );
};

export default Home;
