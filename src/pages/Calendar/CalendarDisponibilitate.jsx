import React from 'react';
import Calendar from 'react-calendar'; // Importăm Calendarul
import 'react-calendar/dist/Calendar.css'; // Importăm stilurile pentru Calendar
import './CalendarDisponibilitate.css'; // Importăm stiluri personalizate

const CalendarDisponibilitate = ({ examRange, onDateSelect }) => {
  const minDate = new Date(examRange.period_start);
  const maxDate = new Date(examRange.period_end);

  const handleDateChange = (date) => {
    onDateSelect(date); // Transmite data selectată în formular
  };

  return (
    <div className="calendar-wrapper">
      <h3 className="calendar-title">Selectează o dată pentru examen</h3>
      <Calendar
        onChange={handleDateChange}
        minDate={minDate} // Setează data minimă
        maxDate={maxDate} // Setează data maximă
        tileClassName="calendar-tile" // Adaugă o clasă CSS pentru personalizare
      />
    </div>
  );
};

export default CalendarDisponibilitate;
