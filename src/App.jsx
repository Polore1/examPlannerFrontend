import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Home from "./pages/Home/Home";
import Courses from "./pages/Courses/Courses";
import CourseDetails from "./pages/Courses/CourseDetails";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import Callback from "./pages/Callback/Callback";
import Examene from "./pages/Examene/Examene";
import LayoutWithNavbar from "./components/LayoutWithNavbar";
import ExameneGrupa from "./pages/Examene/ExameneGrupa";
import Setari from "./pages/Setari/Setari";
import PropuneExamen from "./pages/Examene/PropuneExamen";
import Rooms from "./pages/Rooms/Rooms";

// 🔽 Importuri noi
import AddPeriod from "./pages/Setari/AddPeriod";
import EditPeriod from "./pages/Setari/EditPeriod";

function App() {
  const userRole = "ADM"; // Poți obține rolul utilizatorului dintr-o stare sau context global

  return (
    <Routes>
      {/* Pagina Landing fără navbar */}
      <Route path="/" element={<Landing />} />

      {/* Pagina de callback (pentru autentificare) */}
      <Route path="/auth/callback" element={<Callback />} />

      {/* Rute protejate care includ Navbar */}
      <Route element={<LayoutWithNavbar userRole={userRole} />}>
        <Route path="/home" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/exams" element={<Examene />} />
        <Route path="/exam/propose" element={<PropuneExamen />} />
        <Route path="/examene-grupa" element={<ExameneGrupa />} />
        <Route path="/rooms" element={<Rooms />} />
        
        {/* Rute pentru Setări */}
        <Route path="/settings" element={<Setari />} />
        <Route path="/settings/adaugare" element={<AddPeriod />} />
        <Route path="/settings/editare/:id" element={<EditPeriod />} />
      </Route>

      {/* Pagina de eroare */}
      <Route path="/error" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
