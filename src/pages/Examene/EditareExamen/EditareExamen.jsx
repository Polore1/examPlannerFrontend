// In ExameneInAsteptare.jsx
import { useEffect, useState } from "react";
import { getPendingExams, reviewExamProposal, fetchProfessors, fetchRooms, editExam } from "../../../api/api";
import navigateWithError from "../../../utils/navigateWithError";
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./ExameneInAsteptare.css";

const EditareExamene = () => {
  const [pendingExams, setPendingExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formStates, setFormStates] = useState({});
  const [selectedExam, setSelectedExam] = useState(null);
  const [dateSelected, setDateSelected] = useState(new Date());
  const [successMessage, setSuccessMessage] = useState("");
  const [professors, setProfessors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      const role = localStorage.getItem("user_role");

      if (!token) return navigateWithError(navigate, "Autentificare necesară.", "Token lipsă");
      if (role !== "CD") return navigateWithError(navigate, "Acces interzis", "Doar coordonatorii pot accesa.");

      try {
        const [examsPending, profs, roomList] = await Promise.all([
          getPendingExams(token),
          fetchProfessors(token),
          fetchRooms(token)
        ]);
        setPendingExams(examsPending);
        setProfessors(profs);
        setRooms(roomList);
      } catch (err) {
        navigateWithError(navigate, err.message, "Eroare la încărcarea datelor");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleInputChange = (examId, field, value) => {
    setFormStates(prev => ({
      ...prev,
      [examId]: {
        ...prev[examId],
        [field]: value
      }
    }));
  };

  const handleEditExam = async (examId) => {
    const token = localStorage.getItem("access_token");
    const form = formStates[examId];

    const requiredFields = ["room_id", "assistant_id", "start_time", "duration", "exam_date", "professor_id"];
    if (!requiredFields.every(f => form?.[f])) {
      alert("Completează toate câmpurile pentru editare.");
      return;
    }

    const payload = {
      assistant_id: parseInt(form.assistant_id),
      details: form.details || "",
      duration: parseInt(form.duration),
      exam_date: form.exam_date,
      professor_id: parseInt(form.professor_id),
      room_id: parseInt(form.room_id),
      start_time: form.start_time,
      status: "ACCEPTAT"
    };

    try {
      await editExam(examId, payload, token);
      setSuccessMessage("Examenul a fost modificat cu succes!");
      setPendingExams(prev => prev.filter(e => e.exam_id !== examId));
      setSelectedExam(null);
    } catch (err) {
      alert("Eroare la editare: " + err.message);
    }
  };

  return (
    <div className="pending-exams-container">
      <h2>Propuneri de examene în așteptare</h2>

      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
          <button onClick={() => setSuccessMessage("")}>Închide</button>
        </div>
      )}

      <div className="calendar-container">
        <Calendar
          onChange={setDateSelected}
          value={dateSelected}
          tileClassName={({ date }) => {
            const isExamDate = pendingExams.some(e => new Date(e.exam_date).toDateString() === date.toDateString());
            return isExamDate ? 'highlight' : '';
          }}
        />
      </div>

      {selectedExam && pendingExams.map((exam) => {
        if (exam.exam_id !== selectedExam) return null;
        const form = formStates[exam.exam_id] || {};

        return (
          <div key={exam.exam_id} className="decision-container">
            <h3>Modifică examenul: <strong>{exam.course_name}</strong></h3>

            <div className="input-row">
              <input type="date" value={form.exam_date || ""} onChange={(e) => handleInputChange(exam.exam_id, "exam_date", e.target.value)} />
              <input type="time" value={form.start_time || ""} onChange={(e) => handleInputChange(exam.exam_id, "start_time", e.target.value)} />
            </div>

            <div className="input-row">
              <select value={form.professor_id || ""} onChange={(e) => handleInputChange(exam.exam_id, "professor_id", e.target.value)}>
                <option value="">Selectează profesor</option>
                {professors.map(p => <option key={p.user_id} value={p.user_id}>{p.name}</option>)}
              </select>

              <select value={form.assistant_id || ""} onChange={(e) => handleInputChange(exam.exam_id, "assistant_id", e.target.value)}>
                <option value="">Selectează asistent</option>
                {professors.map(a => <option key={a.user_id} value={a.user_id}>{a.name}</option>)}
              </select>
            </div>

            <div className="input-row">
              <select value={form.room_id || ""} onChange={(e) => handleInputChange(exam.exam_id, "room_id", e.target.value)}>
                <option value="">Selectează sală</option>
                {rooms.map(r => <option key={r.room_id} value={r.room_id}>{r.name}</option>)}
              </select>
              <input type="number" placeholder="Durata (minute)" value={form.duration || ""} onChange={(e) => handleInputChange(exam.exam_id, "duration", e.target.value)} />
            </div>

            <textarea placeholder="Detalii" value={form.details || ""} onChange={(e) => handleInputChange(exam.exam_id, "details", e.target.value)} />

            <div className="button-container">
              <button onClick={() => handleEditExam(exam.exam_id)}>Salvează modificările</button>
            </div>
          </div>
        );
      })}

      <div className="exam-list">
        {pendingExams.length === 0 ? (
          <p>Nu există propuneri în așteptare.</p>
        ) : (
          pendingExams.map(exam => (
            <div key={exam.exam_id} onClick={() => setSelectedExam(exam.exam_id)} className="exam-item">
              <strong>{exam.course_name}</strong> — propus pentru data: <em>{exam.exam_date}</em>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EditareExamene;
