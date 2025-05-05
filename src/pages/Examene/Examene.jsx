import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Examene.css';

const Examene = () => {
  const [exams, setExams] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);

  useEffect(() => {
    axios
      .get('/api/exam/for/group')
      .then((response) => {
        const data = response.data;
        setExams(Array.isArray(data) ? data : []);
        setIsDataLoaded(true);
      })
      .catch((error) => {
        console.error('Eroare la încărcarea examenelor:', error);
        setExams([]);
        setIsDataLoaded(true);
      });
  }, []);

  const handleProposeDate = (examId) => {
    if (!selectedDate) {
      alert('Selectează o dată înainte de a propune!');
      return;
    }

    const proposedDate = selectedDate.toISOString().split('T')[0];

    axios
      .post('/api/exam/propose', { examId, date: proposedDate })
      .then(() => {
        alert('Data a fost propusă cu succes!');
      })
      .catch((error) => {
        console.error('Eroare la propunerea datei:', error);
      });
  };

  return (
    <div className="examene-container">
      <h2 className="examene-title">Examene Programate</h2>

      {!isDataLoaded ? (
        <p>Se încarcă examenele...</p>
      ) : exams.length === 0 ? (
        <p>Nu sunt examene disponibile.</p>
      ) : (
        <div className="examene-list">
          {exams.map((exam) => (
            <div className="exam-card" key={exam.id}>
              <h3>{exam.name}</h3>
              <p>ID: {exam.id}</p>
              {selectedExamId === exam.id && (
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  minDate={new Date()}
                />
              )}
              <div className="examene-buttons">
                <button onClick={() => setSelectedExamId(exam.id)}>
                  Selectează dată
                </button>
                {selectedExamId === exam.id && selectedDate && (
                  <button onClick={() => handleProposeDate(exam.id)}>
                    Propune data
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Examene;
