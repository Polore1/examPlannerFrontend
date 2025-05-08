import React, { useEffect, useState } from 'react';
import { getExamsForGroup } from '../../../api/api';
import './ExameneGrupa.css';

const ExameneGrupa = () => {
  const [examene, setExamene] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    getExamsForGroup(token)
      .then((res) => {
        console.log('Statusuri examene:', res.map((ex) => ex.status)); // 👈 Consola
        setExamene(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Eroare:', err);
        setLoading(false);
      });
  }, []);

  const translateStatus = (status) => {
    const normalized = status?.trim().toUpperCase().replace(/\s+/g, '_'); // Normalizează statusul
    switch (normalized) {
      case 'IN_ASTEPTARE':
        return { text: 'În așteptare', className: 'in_asteptare' }; // Traducere și clasă pentru 'IN_ASTEPTARE'
      case 'ACCEPTAT':
        return { text: 'Acceptat', className: 'acceptat' }; // Traducere și clasă pentru 'ACCEPTAT'
      case 'RESPINS':
        return { text: 'Respins', className: 'respins' }; // Traducere și clasă pentru 'RESPINS'
      default:
        return { text: 'Necunoscut', className: 'necunoscut' }; // Default
    }
  };

  if (loading) return <p>Se încarcă examenele...</p>;

  return (
    <div className="examene-grupa-wrapper">
      <div className="examene-header">
        <h2>Examenele Grupei Mele</h2>
        <span className="exam-count">{examene.length} examene</span>
      </div>

      {examene.length === 0 ? (
        <p>Nu există examene programate.</p>
      ) : (
        <div className="examene-table-container">
          <table className="examene-table">
            <thead>
              <tr>
                <th>Curs</th>
                <th>Profesor</th>
                <th>Tip</th>
                <th>Sala</th>
                <th>Clădire</th>
                <th>Durată</th>
                <th>Dată</th>
                <th>Oră</th>
                <th>Asistent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {examene.map((ex) => {
                const { text, className } = translateStatus(ex.status); // Extragem textul și clasa
                return (
                  <tr key={ex.exam_id}>
                    <td>{ex.course_name}</td>
                    <td>{ex.professor}</td>
                    <td>{ex.exam_type}</td>
                    <td>{ex.room}</td>
                    <td>{ex.building}</td>
                    <td>{ex.duration} min</td>
                    <td>{ex.exam_date}</td>
                    <td>{ex.start_time}</td>
                    <td>{ex.assistant}</td>
                    <td className={`exam-status ${className}`}>
                      {text} {/* Afișăm statusul tradus */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExameneGrupa;
