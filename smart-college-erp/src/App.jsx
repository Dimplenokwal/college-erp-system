import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import all your pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Fees from './pages/Fees';
import CalendarPage from './pages/CalendarPage';

// ==========================================
// 🛡️ PROTECTED ROUTE COMPONENT
// ==========================================
// This checks if a user has a valid JWT token saved in their browser.
// If they don't, it redirects them back to the login page ("/").
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// ==========================================
// 🚀 MAIN APP ROUTER
// ==========================================
function App() {
  return (
    <BrowserRouter>
      
      {/* 👇 The Toaster component enables beautiful popups across the entire app */}
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
          },
        }}
      />
      
      <Routes>
        
        {/* Public Route: The Login Screen */}
        <Route path="/" element={<Login />} />
        
        {/* Protected Routes: The ERP System */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/students" 
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/attendance" 
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/fees" 
          element={
            <ProtectedRoute>
              <Fees />
            </ProtectedRoute>
          } 
        />
        <Route
         path="/calendar" 
         element={
         <ProtectedRoute>
          <CalendarPage />
          </ProtectedRoute>
       }
       />

      </Routes>
    </BrowserRouter>
  );
}

export default App;