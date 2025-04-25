import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Home from "./pages/Home/Home";
import Courses from "./pages/Courses/Courses";
import CourseDetails from "./pages/Courses/CourseDetails";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import Callback from "./pages/Callback/Callback";

function App() {
  return (
    <Routes>
      {/* Pagina Landing fără navbar */}
      <Route path="/" element={<Landing />} />

      {/* Pagina de callback (pentru autentificare) */}
      <Route path="/auth/callback" element={<Callback />} />

      {/* Pagina Home cu Navbar */}
      <Route path="/home" element={<Home />} />

      {/* Pagina Courses */}
      <Route path="/courses" element={<Courses />} />

      {/* Detalii pentru un curs */}
      <Route path="/courses/:id" element={<CourseDetails />} />

      {/* Pagina de eroare */}
      <Route path="/error" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
