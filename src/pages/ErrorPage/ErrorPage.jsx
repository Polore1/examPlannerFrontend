import { useLocation } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();  // Obține locația curentă
  const errorMessage = location.state?.message || "A apărut o eroare necunoscută.";  // Mesajul de eroare din state

  return (
    <div>
      <h1>Eroare</h1>
      <p>{errorMessage}</p>  {/* Afișează mesajul de eroare */}
    </div>
  );
};

export default ErrorPage;
