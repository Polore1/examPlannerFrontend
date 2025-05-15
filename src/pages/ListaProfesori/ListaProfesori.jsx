import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfessors } from "../../api/api";
import navigateWithError from "../../utils/navigateWithError";
import "./ListaProfesori.css";

const ListaProfesori = () => {
  const [profesori, setProfesori] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log("Token în localStorage: ", token);  // Adaugă această linie pentru a verifica tokenul
    localStorage.setItem("access_token", token);

    if (token) {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decodifică payload-ul tokenului
        const currentTime = Math.floor(Date.now() / 1000); // Timpul curent în secunde
        if (decodedToken.exp < currentTime) {
            console.log("Tokenul a expirat.");
            setError("Tokenul a expirat. Te rugăm să te autentifici din nou.");
            setIsLoading(false);
            return;
        }
    }
  
    fetchProfessors(token) // Apelăm funcția fetchProfessors cu doar tokenul
      .then((data) => {
        if (Array.isArray(data)) {
          setProfesori(data);
        } else {
          setError("Datele nu sunt în formatul corect.");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
        navigateWithError(navigate, err.message, "Eroare la încărcarea profesorilor");
      });
  }, [navigate]);

  return (
    <div className="profesori-container">
      {isLoading ? (
        <p className="loading-message">Se încarcă profesorii...</p>
      ) : (
        <>
          <div className="profesori-header">
            <h2>Lista profesorilor</h2>
            <span className="prof-count">{profesori.length} profesori</span>
          </div>

          <div className="table-container">
            <table className="profesori-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nume</th>
                  <th>Email</th>
                </tr>
              </thead>

              <tbody>
                {profesori.length > 0 ? (
                  profesori.map((prof) => (
                    <tr
                      key={prof.user_id}
                      onClick={() => navigate(`/users/${prof.user_id}`)} // Navighează către detaliile profesorului
                      style={{ cursor: "pointer" }}
                      className="profesor-row"
                    >
                      <td>{prof.user_id}</td>
                      <td>{prof.name}</td>
                      <td>{prof.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">Nu sunt profesori disponibili.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ListaProfesori;
