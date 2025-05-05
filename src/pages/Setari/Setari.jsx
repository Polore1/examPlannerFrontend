import React, { useEffect, useState } from "react";
import {
  fetchExaminationPeriods,
  deleteExaminationPeriod,
  addExaminationPeriod,
  updateExaminationPeriod,
  getExaminationPeriodById,
} from "../../api/api";
import "./Setari.css";

const Setari = () => {
  const [periods, setPeriods] = useState([]);
  const [formData, setFormData] = useState({ name: "Examen", period_start: "", period_end: "" });
  const [editId, setEditId] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    loadPeriods();
  }, []);

  const loadPeriods = () => {
    fetchExaminationPeriods(token)
      .then((data) => setPeriods(data))
      .catch((err) => alert(err.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Ești sigur că vrei să ștergi această perioadă?")) return;
    deleteExaminationPeriod(id, token)
      .then(() => loadPeriods())
      .catch((err) => alert(err.message));
  };

  const handleEdit = (period) => {
    setFormData({
      name: period.name,
      period_start: period.period_start,
      period_end: period.period_end,
    });
    setEditId(period.examination_period_id);
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  setSubmitError("");

  const action = editId
    ? updateExaminationPeriod(editId, formData, token)
    : addExaminationPeriod(formData, token);

  action
    .then(() => {
      loadPeriods();
      setFormData({ name: "Examen", period_start: "", period_end: "" });
      setEditId(null);
      setSubmitError("");
    })
    .catch((err) => {
      setSubmitError(err.message || "A apărut o eroare la salvare.");
    });
};

  
const handleSearchById = () => {
  setSearchAttempted(true);
  setSearchError("");

  if (!searchId.trim()) {
    setSearchResult(null);
    setSearchError("Vă rugăm să introduceți un ID valid.");
    return;
  }

  getExaminationPeriodById(searchId, token)
    .then((data) => {
      setSearchResult(data);
      setSearchError("");
    })
    .catch((err) => {
      setSearchResult(null);
      setSearchError(`Perioada cu ID-ul ${searchId} nu a fost găsită.`);
    });
}

  return (
    <div className="settings-container">

      <h2 className="section-title">Perioade de Examinare</h2>

      {/* Tabel cu perioade */}
      <div className="table-container">
        <table className="period-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nume</th>
              <th>Început</th>
              <th>Sfârșit</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr key={period.examination_period_id}>
                <td>{period.examination_period_id}</td>
                <td>{period.name}</td>
                <td>{period.period_start}</td>
                <td>{period.period_end}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(period)}>
                    Editează
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(period.examination_period_id)}>
                    Șterge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Containerele pentru formulare: căutare și adăugare/editare */}
      <div className="form-flex-row">

        {/* Căutare după ID */}
        <div className="form-container" style={{ flex: "1", minWidth: "300px", maxWidth: "48%" }}>
          <h3>Caută perioadă după ID</h3>

          <div className="form-group">
            <label htmlFor="search-id">ID:</label>
            <input
              type="number"
              placeholder="Introduceți ID-ul"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            {searchAttempted && searchError && (
              <div style={{ color: "red", marginTop: "6px", fontSize: "0.9rem" }}>
                {searchError}
              </div>
            )}
            <button onClick={handleSearchById} className="submit-btn" style={{ marginTop: "10px" }}>
              Caută
            </button>
          </div>

          {searchResult && (
            <div style={{ marginTop: "10px", padding: "10px", background: "#f1f1f1", borderRadius: "6px" }}>
              <strong>ID:</strong> {searchResult.examination_period_id} <br />
              <strong>Nume:</strong> {searchResult.name} <br />
              <strong>Inceput:</strong> {searchResult.period_start} <br />
              <strong>Sfarsit:</strong> {searchResult.period_end}
            </div>
          )}
          

          
        </div>

        {/* Formular pentru adăugare/editare perioadă */}
        <div className="form-container" style={{ flex: "1", minWidth: "300px", maxWidth: "48%" }}>
          <h3>{editId ? "Editează Perioada" : "Adaugă Perioadă"}</h3>
          <form onSubmit={handleSubmit}>
            {editId && (
              <div className="form-group">
                <label htmlFor="perioada-id">ID Perioadă:</label>
                <input
                  type="text"
                  value={editId}
                  readOnly
                  className="input-readonly"
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="nume">Nume:</label>
              <select
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              >
                <option value="EXAMEN">Examen</option>
                <option value="COLOCVIU">Colocviu</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="start-date">Data Început:</label>
              <input
                type="date"
                value={formData.period_start}
                onChange={(e) => setFormData({ ...formData, period_start: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="end-date">Data Sfârșit:</label>
              <input
                type="date"
                value={formData.period_end}
                onChange={(e) => setFormData({ ...formData, period_end: e.target.value })}
                required
              />
            </div>
            

            <button type="submit" className="submit-btn">
            {editId ? "Salvează Modificările" : "Adaugă Perioadă"}
          </button>

          {editId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditId(null);
                setFormData({ name: "Examen", period_start: "", period_end: "" });
                setSubmitError("");
              }}
            >
              Anulează Editarea
            </button>
          )}

          {submitError && (
            <div className="submit-error">
              {submitError}
            </div>
          )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default Setari;
