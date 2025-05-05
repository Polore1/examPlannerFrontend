import React, { useState } from 'react';
import { proposeExam } from '../../api/api'; // Asigură-te că funcția există și e corectă
import CalendarDisponibilitate from '../Calendar/CalendarDisponibilitate'; // Import corect către calendar
import './PropuneExamen.css';

const PropuneExamen = () => {
  const [courseId, setCourseId] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Trebuie să fii autentificat pentru a propune un examen.');
      return;
    }

    if (!courseId || !date) {
      setError('Toate câmpurile sunt obligatorii.');
      return;
    }

    try {
      await proposeExam(
        {
          course_id: parseInt(courseId),
          exam_date: date,
        },
        token
      );
      setSuccess('Propunerea a fost trimisă cu succes!');
      setCourseId('');
      setDate('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'A apărut o eroare neașteptată.');
    }
  };

  return (
    <div className="propune-examen-container">
      <h2 className="section-title">Propune o dată pentru un Examen/Colocviu</h2>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label className="input-label" htmlFor="cursId">ID Curs</label>
          <input
            className="input-field"
            type="text"
            id="cursId"
            name="cursId"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="input-label" htmlFor="dataExamen">Data Examen</label>
          <input
            className="input-field"
            type="date"
            id="dataExamen"
            name="dataExamen"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button type="submit" className="submit-btn">Trimite Propunerea</button>
        </div>
      </form>

      {error && <p className="submit-error">{error}</p>}
      {success && <div className="info-card success">{success}</div>}

      <CalendarDisponibilitate />
    </div>
  );
};

export default PropuneExamen;
