import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import ServiceDetails from './pages/ServiceDetails';
import Membership from './pages/Membership';
import Experience from './pages/Experience';
import Contact from './pages/Contact';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminServices from './pages/Admin/AdminServices';
import AdminNavigation from './pages/Admin/AdminNavigation';
import AdminSettings from './pages/Admin/AdminSettings';
import AdminLayout from './components/AdminLayout';
import { trackPageView } from './config/analytics';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(pathname);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services/:serviceId" element={<ServiceDetails />} />
        <Route path="/service-details" element={<Navigate to="/services/private-luxury-transport" replace />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route path="" element={<AdminDashboard />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="navigation" element={<AdminNavigation />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </AdminLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
