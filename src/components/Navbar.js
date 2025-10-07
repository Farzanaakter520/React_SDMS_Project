import React from 'react';
import { Link } from 'react-router-dom';
// import './Navbar.css'; 
import '../cssFiles/Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-btn">Upload</Link>
      <Link to="/records" className="nav-btn">Records</Link>
    </nav>
  );
}
