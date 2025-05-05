import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ExameneGrupa.css';

const ExameneGrupa = () => {
  const [examene, setExamene] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/exam/group-leader')
      .then((res) => {
        setExamene(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Eroare:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Se încarcă examenele...</p>;

  return (
    <div className="examene-grupa-container">
      <h2>Examenele Grupei Mele</h2>
      {examene.length === 0 ? (
        <p>Nu există examene programate.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Curs</th>
              <th>Profesor</th>
              <th>Sala</th>
              <th>Clădire</th>
              <th>Tip</th>
              <th>Durată</th>
              <th>Dată</th>
              <th>Oră</th>
              <th>Asistent</th>
            </tr>
          </thead>
          <tbody>
            {examene.map((ex) => (
              <tr key={ex.exam_id}>
                <td>{ex.course_name}</td>
                <td>{ex.professor}</td>
                <td>{ex.room}</td>
                <td>{ex.building}</td>
                <td>{ex.exam_type}</td>
                <td>{ex.duration} min</td>
                <td>{ex.exam_date}</td>
                <td>{ex.start_time}</td>
                <td>{ex.assistant}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExameneGrupa;
