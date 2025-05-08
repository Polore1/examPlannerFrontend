import React, { useEffect, useState } from "react";
import {
  fetchExaminationPeriods,
  deleteExaminationPeriod,
  addExaminationPeriod,
  updateExaminationPeriod
} from "../../api/api";
import "./Setari.css";

const Setari = () => {
  const [periods, setPeriods] = useState([]);
  const [formData, setFormData] = useState({ name: "EXAMEN", period_start: "", period_end: "" });
  const [editId, setEditId] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null); // Track if we need confirmation for deletion
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    loadPeriods();
  }, []);

  const loadPeriods = () => {
    setLoading(true);
    fetchExaminationPeriods(token)
      .then((data) => {
        setPeriods(data);
        setLoading(false);
      })
      .catch((err) => {
        alert(err.message);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    setConfirmDelete(id); // Set the period ID that is being deleted
  };

  const confirmDeletePeriod = (id) => {
    deleteExaminationPeriod(id, token)
      .then(() => {
        loadPeriods();
        setConfirmDelete(null); // Reset confirmation state
      })
      .catch((err) => alert(err.message));
  };

  const cancelDelete = () => {
    setConfirmDelete(null); // Reset confirmation state
  };

  const handleEdit = (period) => {
    setFormData({
      name: period.name,
      period_start: period.period_start,
      period_end: period.period_end,
    });
    setEditId(period.examination_period_id);
  };

  
  const canAddPeriod = () => {
    const types = periods.map(p => p.name);
    // Permite adăugarea dacă lipsesc EXAMEN sau COLOCVIU
    return !types.includes("EXAMEN") || !types.includes("COLOCVIU");
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");
  
    // Dacă edităm o perioadă existentă, acțiunea va fi update, altfel va fi add
    const action = editId
      ? updateExaminationPeriod(editId, formData, token)
      : addExaminationPeriod(formData, token);
  
    action
      .then(() => {
        loadPeriods();
        setFormData({ name: "EXAMEN", period_start: "", period_end: "" });
        setEditId(null);
        setSubmitError("");
      })
      .catch((err) => {
        setSubmitError(err.message || "A apărut o eroare la salvare.");
      });
  };
  
  // Restricționarea valorilor "EXAMEN" și "COLOCVIU"
  const restrictedValues = periods.map(p => p.name);
  
  return (
    <div className="settings-container">
      <h2 className="section-title">Perioade de Examinare</h2>
  
      {/* Loading */}
      {loading && <p className="loading-message">Se încarcă datele...</p>}
  
      {!loading && (
        <>
          {/* Tabel */}
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
                      <button className="edit-btn" onClick={() => handleEdit(period)}>Editează</button>
                      <button className="delete-btn" onClick={() => handleDelete(period.examination_period_id)}>Șterge</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Confirmare ștergere */}
          {confirmDelete && (
            <div className="confirm-delete-message">
              <p>Sigur vrei să ștergi această perioadă?</p>
              <div className="button-container">
                <button className="submit-btn" onClick={() => confirmDeletePeriod(confirmDelete)}>Confirmați Ștergerea</button>
                <button className="cancel-btn" onClick={cancelDelete}>Anulează</button>
              </div>
            </div>
          )}
          {/* Formular */}
          {(canAddPeriod() || editId) && (
            <div className="form-container">
              <h3>{editId ? "Editează Perioada" : "Adaugă Perioadă"}</h3>
              <form onSubmit={handleSubmit}>
                
                <div className="form-flex-row">
                {/* Prima coloană - ID și Nume */}

                <div className="form-column">
                  
                    <div className="form-group">
                      <label htmlFor="perioada-id">ID Perioadă:</label>
                      <input
                        id="perioada-id"
                        type="text"
                        value={editId}
                        readOnly
                        className="input-readonly"  // Adaugă această clasă pentru a-l face readonly
                      />
                    </div>
                  

                  <div className="form-group">
                    <label htmlFor="nume">Nume:</label>

                    <select
                      id="nume"
                      value={formData.name}
                      disabled={!!editId}  // Dacă este în modul editare, îl dezactivezi
                      aria-disabled={!!editId}
                      className="input-readonly"  // Aplică stilul input-readonly pentru a-l face să arate ca un câmp readonly
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    >
                      <option value="EXAMEN" disabled={restrictedValues.includes("EXAMEN")}>Examen</option>
                      <option value="COLOCVIU" disabled={restrictedValues.includes("COLOCVIU")}>Colocviu</option>
                    </select>

                  </div>
                </div>

                {/* A doua coloană - Data Început și Data Sfârșit */}
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="start-date">Data Început:</label>
                    <input
                      id="start-date"
                      type="date"
                      value={formData.period_start}
                      onChange={(e) => setFormData({ ...formData, period_start: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="end-date">Data Sfârșit:</label>
                    <input
                      id="end-date"
                      type="date"
                      value={formData.period_end}
                      onChange={(e) => setFormData({ ...formData, period_end: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
  
                {/* Butoane */}
                <div className="form-btn-container">
                  <button type="submit" className="submit-btn">
                    {editId ? "Salvează Modificările" : "Adaugă Perioadă"}
                  </button>
  
                  {editId && (
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setEditId(null);
                        setFormData({ name: "EXAMEN", period_start: "", period_end: "" });
                        setSubmitError("");
                      }}
                    >
                      Anulează Editarea
                    </button>
                  )}
                </div>
  
                {submitError && <div className="submit-error">{submitError}</div>}
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
  
  

  


};

export default Setari;
