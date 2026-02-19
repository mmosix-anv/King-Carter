import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import ServiceDetails from './pages/ServiceDetails';
import Membership from './pages/Membership';
import Experience from './pages/Experience';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/service-details" element={<ServiceDetails />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/experience" element={<Experience />} />
      </Routes>
    </Router>
  );
}

export default App;
