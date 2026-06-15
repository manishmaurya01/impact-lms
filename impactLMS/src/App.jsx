import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing/Landing.jsx';
import Login from './components/Authentication/Login/Login.jsx';
import Register from './components/Authentication/Register/Register.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';


function App() {
  return (
    <Router>
      <Routes>
        {/* Base Route */}
        <Route path="/" element={<Landing />} />
        
        {/* Registration Onboarding Route */}
        <Route path="/register" element={<Register />} />
        
        {/* Secure Authorization Login Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;