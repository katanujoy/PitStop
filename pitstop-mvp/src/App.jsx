import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import EmergencyPage from './pages/EmergencyPage';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <HomePage onStart={() => window.location.href = '/register'} mockLogin={(demoUser) => {
            setUser(demoUser);
            window.location.href = '/emergency';
          }} />
        } />
        <Route path="/register" element={<RegisterPage onRegister={setUser} />} />
        <Route path="/emergency" element={<EmergencyPage user={user || { name: 'Guest', role: 'driver', email: 'guest@pitstop.com' }} />} />
      </Routes>
    </Router>
  );
};

export default App;
