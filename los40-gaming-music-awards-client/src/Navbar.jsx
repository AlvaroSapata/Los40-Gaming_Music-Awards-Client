import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div className='myNavbar'>
    <Link to="/">Inicio</Link>
    <Link to="/signup">Signup</Link>
    <Link to="/login">Login</Link>
    </div>
  )
}

export default Navbar