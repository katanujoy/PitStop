import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import EmergencyPage from './pages/EmergencyPage';
import LoginPage from './pages/Login';
import Navbar from './components/Navbar';
import { jwtDecode } from 'jwt-decode';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('pitstopToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('pitstopToken');
      }
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    window.location.href = '/emergency';
  };

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route
          path="/"
          element={<HomePage onStart={() => (window.location.href = '/register')} />}
        />
        <Route
          path="/register"
          element={<RegisterPage onRegister={setUser} />}
        />
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} goBack={() => (window.location.href = '/')} />}
        />
        <Route
          path="/emergency"
          element={
            <EmergencyPage
              user={user || { name: 'Guest', role: 'driver', email: 'guest@pitstop.com' }}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
