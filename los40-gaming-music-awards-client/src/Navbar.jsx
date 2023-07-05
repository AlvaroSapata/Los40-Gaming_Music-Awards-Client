import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {AuthContext} from "../src/context/auth.context.js"

function Navbar() {

  const navigate = useNavigate()
  const {authenticateUser} = useContext(AuthContext)

  const handleLogout = () => {
    // 1. Borrar el token
    localStorage.removeItem("authToken");
  
    // 2. validar contra el BE que el token fue borrado
    authenticateUser();
  
    // 3. Redirigir
    navigate("/");
  };


  return (
    <div className='myNavbar'>
    <Link to="/">Inicio</Link>
    <Link to="/signup">Signup</Link>
    <Link to="/login">Login</Link>
    <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Navbar