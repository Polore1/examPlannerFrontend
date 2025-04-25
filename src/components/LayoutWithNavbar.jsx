import Navbar from "./Navbar"; // verifică că există acest fișier în același folder
import { Outlet } from "react-router-dom";

const LayoutWithNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default LayoutWithNavbar;
