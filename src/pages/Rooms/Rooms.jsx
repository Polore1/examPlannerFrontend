// src/components/Rooms/Rooms.jsx
import React, { useEffect, useState } from "react";
import { fetchRooms } from "../../api/api";
import "./Rooms.css";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetchRooms(token)
      .then((data) => {
        setRooms(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    <div className="rooms-container">
      <h2>Listele Sălilor de Clasă</h2>
      {error && <div className="error-message">{error}</div>}

      <table className="rooms-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nume</th>
            <th>Capacitate</th>
            <th>Etaj</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.room_id}>
              <td>{room.room_id}</td>
              <td>{room.name}</td>
              <td>{room.capacity}</td>
              <td>{room.floor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Rooms;
