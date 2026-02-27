import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './components/NotificationContainer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ContentList from './pages/ContentList';
import ServiceEditor from './pages/ServiceEditor';
import MediaLibrary from './components/MediaLibrary';
import SettingsForm from './pages/SettingsForm';
import NavigationManager from './pages/NavigationManager';
import './styles/base.scss';

const AdminApp = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="admin-root">
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes with layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/content"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ContentList />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/content/new"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ServiceEditor />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/content/:id"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ServiceEditor />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/media"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <MediaLibrary />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <SettingsForm />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/navigation"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <NavigationManager />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default AdminApp;
