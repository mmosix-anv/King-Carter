import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import ServiceDetails from './pages/ServiceDetails';
import Membership from './pages/Membership';
import Experience from './pages/Experience';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services/:serviceId" element={<ServiceDetails />} />
        <Route path="/service-details" element={<Navigate to="/services/private-luxury-transport" replace />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
