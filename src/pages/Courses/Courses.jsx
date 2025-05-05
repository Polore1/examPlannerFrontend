import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCourses } from "../../api/api";
import navigateWithError from "../../utils/navigateWithError"; 
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // ✅ pentru afișare "Se încarcă..."

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigateWithError(navigate, "⚠️ Autentificare necesară.", "Token lipsă");
      return;
    }

    fetchCourses(token)
      .then((data) => {
        setCourses(data);
        setFilteredCourses(data);
        setIsLoading(false); // ✅ gata încărcarea
      })
      .catch((err) => {
        setIsLoading(false); // ✅ și în caz de eroare
        navigateWithError(navigate, err.message, "Eroare la încărcarea cursurilor");
      });
  }, []);

  const handleViewDetails = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="home-container">
      {isLoading ? (
        <p>Se încarcă cursurile...</p>
      ) : (
        <>
          <div className="courses-header">
            <h2>Cursuri disponibile</h2>
            <span className="course-count">{filteredCourses.length} cursuri</span>
          </div>

          <div className="table-container">
            <table className="courses-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nume</th>
                  <th>An studiu</th>
                  <th>Specializare</th>
                  <th>Examinare</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    onClick={() => handleViewDetails(course.id)}
                    className="clickable-row"
                  >
                    <td>{course.id}</td>
                    <td>{course.name}</td>
                    <td>{course.study_year}</td>
                    <td>{course.specialization}</td>
                    <td>{course.examination_method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Courses;
