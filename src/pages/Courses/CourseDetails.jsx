import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCourseDetails, updateCourse } from "../../api/api";
import './CourseDetails.css';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [editedCourse, setEditedCourse] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token") || localStorage.getItem("token");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const courseData = await fetchCourseDetails(id, token);
        setCourse(courseData);
        setEditedCourse(courseData);
      } catch (error) {
        setError('Eroare la încărcarea detaliilor cursului');
      }
    };

    fetchDetails();
  }, [id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssistantsChange = (index, value) => {
    const newAssistants = [...editedCourse.assistants];
    newAssistants[index] = value;
    setEditedCourse((prev) => ({
      ...prev,
      assistants: newAssistants,
    }));
  };

  const handleAddAssistant = () => {
    setEditedCourse((prev) => ({
      ...prev,
      assistants: [...prev.assistants, ""],
    }));
  };

  const handleRemoveAssistant = (index) => {
    const newAssistants = editedCourse.assistants.filter((_, i) => i !== index);
    setEditedCourse((prev) => ({
      ...prev,
      assistants: newAssistants,
    }));
  };

  const handleSave = async () => {
    try {
      await updateCourse(course.course_id, editedCourse, token);
      setCourse(editedCourse);

      const confirmReturn = window.confirm("Modificările au fost salvate cu succes! Apasă OK pentru a reveni la lista de cursuri.");
      if (confirmReturn) {
        navigate("/courses");
      }
    } catch (err) {
      alert("Eroare la salvarea modificărilor.");
    }
  };

  const handleBack = () => {
    navigate("/courses");
  };

  if (error) return <p>{error}</p>;
  if (!course) return <p>Se încarcă detaliile cursului...</p>;

  return (
    <div className="course-details-container">
      <h2 className="course-details-title">Editați Informațiile Cursului</h2>

      <div>
        <label className="input-label"><strong>Denumire:</strong></label>
        <input
          type="text"
          name="name"
          value={editedCourse.name}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>

      <div>
        <label className="input-label"><strong>Coordonator:</strong></label>
        <input
          type="text"
          name="coordinator"
          value={editedCourse.coordinator}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>

      <div>
        <label className="input-label"><strong>Specializare:</strong></label>
        <input
          type="text"
          name="specialization"
          value={editedCourse.specialization}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>

      <div>
        <label className="input-label"><strong>An de studiu:</strong></label>
        <select
          name="study_year"
          value={editedCourse.study_year}
          onChange={handleInputChange}
          className="input-field"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </div>

      <div>
        <label className="input-label"><strong>Asistenți:</strong></label>
        {editedCourse.assistants.map((assistant, index) => (
          <div key={index} className="assistant-item">
            <input
              type="text"
              value={assistant}
              onChange={(e) => handleAssistantsChange(index, e.target.value)}
              className="input-field"
            />
            <button onClick={() => handleRemoveAssistant(index)} className="remove-button">Șterge</button>
          </div>
        ))}
        <button onClick={handleAddAssistant} className="add-button">Adaugă asistent</button>
      </div>

      <div className="button-container">
        <button onClick={handleBack} className="back-button">Înapoi</button>
        <button onClick={handleSave} className="save-button">Salvează</button>
      </div>
    </div>
  );
};

export default CourseDetails;
