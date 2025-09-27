import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UploadForm from './pages/UploadForm';
import RecordsList from './pages/RecordsList';
import Navbar from './components/Navbar';

export default function App(){
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<UploadForm />} />
        <Route path="/records" element={<RecordsList />} />        
      </Routes>
    </BrowserRouter>
  );
}
