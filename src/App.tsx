import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Challenge from './pages/Challenge';
import MirrorPractice from './pages/MirrorPractice';
import Topics from './pages/Topics';
import Motivation from './pages/Motivation';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/challenge" element={
                <ProtectedRoute>
                  <Challenge />
                </ProtectedRoute>
              } />
              <Route path="/mirror-practice" element={
                <ProtectedRoute>
                  <MirrorPractice />
                </ProtectedRoute>
              } />
              <Route path="/topics" element={
                <ProtectedRoute>
                  <Topics />
                </ProtectedRoute>
              } />
              <Route path="/motivation" element={
                <ProtectedRoute>
                  <Motivation />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;