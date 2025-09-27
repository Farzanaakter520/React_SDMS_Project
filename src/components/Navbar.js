import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar(){
  return (
    <nav style={{ padding: 10, borderBottom: '1px solid #ddd' }}>
      <Link to="/">Upload</Link> | <Link to="/records">Records</Link>
    </nav>
  );
}
