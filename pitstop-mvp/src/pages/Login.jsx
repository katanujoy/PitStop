import React, { useState } from 'react';

const LoginPage = ({ onLogin, goBack }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('driver');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, role }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('pitstopUser', JSON.stringify(data));
        onLogin(data);
      } else {
        setError(data.error || 'Login failed.');
      }
    } catch (err) {
      setError('Server error. Try again later.');
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ textAlign: 'left' }}>
      <button
        onClick={goBack}
        style={{
          background: 'transparent',
          color: '#fcd34d',
          border: 'none',
          fontSize: '16px',
          marginBottom: '1rem',
          cursor: 'pointer',
        }}
      >
        ← Back
      </button>

      <h2 style={{ textAlign: 'center' }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label><br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />

        <label>Name</label><br />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        /><br /><br />

        <label>Role</label><br />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="driver">Driver</option>
          <option value="mechanic">Mechanic</option>
        </select><br /><br />

        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'tomato', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
