import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../src/context/auth.context.js";

function Navbar() {
  const navigate = useNavigate();
  const { authenticateUser } = useContext(AuthContext);
  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    // 1. Borrar el token
    localStorage.removeItem("authToken");

    // 2. validar contra el BE que el token fue borrado
    authenticateUser();

    // 3. Redirigir
    navigate("/");
  };

  return (
    <div className="myNavbar">
      <div className="navContainer">
        <Link to="/">Inicio</Link>
      </div>
      <div>
        <Link to="/">
          <img src="/imgs/los40.png" alt="los40" />
        </Link>
      </div>
      <div>
        {authContext.isLoggedIn ? (
          <div className="navContainer">
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </div>
        ) : (
          <div className="navContainer">
            <div>
              <Link to="/signup">Registro</Link>
            </div>
            <div>
              <Link to="/login">Login</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
