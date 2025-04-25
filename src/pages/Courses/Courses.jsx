import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importă useNavigate
import { fetchCourses } from "../../api/api"; // Importă funcția de obținere a cursurilor
import Navbar from "../../components/Navbar"
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Folosește useNavigate pentru a naviga

  useEffect(() => {
    const token = localStorage.getItem("access_token");
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

  // Funcție pentru a naviga la detalii curs
  const handleViewDetails = (courseId) => {
    navigate(`/courses/${courseId}`);  // Folosește navigate pentru a naviga
  };

  return (
    <div className="home-container">
      <Navbar />
      {/* Tabelul Cursurilor */}
      <table className="courses-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nume</th>
            <th>An studiu</th>
            <th>Specializare</th>
            <th>Examinare</th>
            {/* <th>Actiuni</th> */}
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course) => (
            <tr
              key={course.id}
              onClick={() => handleViewDetails(course.id)} // Clic pentru a naviga la detalii
              className="clickable-row"
            >
              <td>{course.id}</td>
              <td>{course.name}</td>
              <td>{course.study_year}</td>
              <td>{course.specialization}</td>
              <td>{course.examination_method}</td>
              {/* <td>
                <button onClick={() => handleEditClick(course.id, course.examination_method)}>Editează</button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Courses;
