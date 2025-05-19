import React, { useEffect, useState } from "react";
import {
  fetchExaminationPeriods,
  deleteExaminationPeriod,
  addExaminationPeriod,
  updateExaminationPeriod,
  handleDatabaseReset,
} from "../../api/api";
import "./Setari.css";

const Setari = () => {
  const [periods, setPeriods] = useState([]);
  const [formData, setFormData] = useState({ name: "EXAMEN", period_start: "", period_end: "" });
  const [editId, setEditId] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [resetMessage, setResetMessage] = useState("");

  const token = localStorage.getItem("access_token");
  const userRole = localStorage.getItem("user_role");

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
        alert(extractErrorMessage(err));
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    setConfirmDelete(id);
  };

  const handleResetDatabase = () => {
    setResetMessage("");
    handleDatabaseReset(token)
      .then(() => {
        setResetMessage("Baza de date a fost resetată cu succes.");
        loadPeriods();
      })
      .catch((err) => {
        setResetMessage(`Eroare la resetarea bazei de date: ${err.message}`);
      });
  };

  const confirmDeletePeriod = (id) => {
    deleteExaminationPeriod(id, token)
      .then(() => {
        loadPeriods();
        setConfirmDelete(null);
      })
      .catch((err) => alert(extractErrorMessage(err)));
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
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
    const types = periods.map((p) => p.name);
    return !types.includes("EXAMEN") || !types.includes("COLOCVIU");
  };

  const extractErrorMessage = (error) => {
    if (!error) return "A apărut o eroare necunoscută.";
    try {
      const parsed = JSON.parse(error.message || error);
      if (parsed.error) return parsed.error;
    } catch {
      return error.message || error.toString();
    }
    return error.message || error.toString();
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
        setFormData({ name: "EXAMEN", period_start: "", period_end: "" });
        setEditId(null);
        setSubmitError("");
      })
      .catch((err) => {
        setSubmitError(extractErrorMessage(err));
      });
  };

  const restrictedValues = periods.map((p) => p.name);

  return (
    <div className="settings-container">
      {userRole === "SEC" && (
        <>
          <h2 className="section-title">Perioade de Examinare</h2>

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
                      <div className="form-column">
                        <div className="form-group">
                          <label htmlFor="perioada-id">ID Perioadă:</label>
                          <input
                            id="perioada-id"
                            type="text"
                            value={editId || ""}
                            readOnly
                            className="input-readonly"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="nume">Nume:</label>
                          <select
                            id="nume"
                            value={formData.name}
                            disabled={!!editId}
                            className="input-readonly"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          >
                            <option value="EXAMEN" disabled={restrictedValues.includes("EXAMEN")}>Examen</option>
                            <option value="COLOCVIU" disabled={restrictedValues.includes("COLOCVIU")}>Colocviu</option>
                          </select>
                        </div>
                      </div>

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
        </>
      )}

      {/* Resetare DB pentru SEC și ADM */}
      {["ADM", "SEC"].includes(userRole) && (
        <div className="reset-db-container">
          <hr />
          <h3>Resetare Bază de Date</h3>
          <button className="reset-btn" onClick={handleResetDatabase}>
            🔄 Resetează baza de date
          </button>
          {resetMessage && <p className="reset-message">{resetMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default Setari;
