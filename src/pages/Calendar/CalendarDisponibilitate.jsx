import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar'; // sau orice librărie folosești
import 'react-calendar/dist/Calendar.css';
import './CalendarDisponibilitate.css';
import { fetchExaminationPeriods, getExamProposals } from '../../api/api';

const CalendarDisponibilitate = () => {
  const [examRange, setExamRange] = useState(null);
  const [propuneri, setPropuneri] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
  
        const periods = await fetchExaminationPeriods(token);
        const examPeriod = periods.find((p) => p.type === "examen");
  
        if (!examPeriod) {
          console.warn("Nu există o perioadă de tip 'examen'");
          return;
        }
  
        setExamRange({
          start: new Date(examPeriod.start_date),
          end: new Date(examPeriod.end_date),
        });
  
        const proposals = await getExamProposals(token);
        setPropuneri(proposals);
      } catch (error) {
        console.error("Eroare la încărcare calendar:", error);
      }
    };
  
    loadData();
  }, []);

  const isTileDisabled = ({ date }) => {
    if (!examRange) return true;

    return date < examRange.start || date > examRange.end;
  };

  const tileContent = ({ date }) => {
    const found = propuneri.find((p) => new Date(p.exam_date).toDateString() === date.toDateString());
    if (found) {
      return (
        <div className={`status-badge ${found.status}`}>
          {found.status}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="calendar-wrapper">
      <h3 className="calendar-title">Calendar examinări disponibile</h3>
      {examRange ? (
        <Calendar
          tileDisabled={isTileDisabled}
          tileContent={tileContent}
        />
      ) : (
        <p>Se încarcă calendarul...</p>
      )}
    </div>
  );
};

export default CalendarDisponibilitate;
