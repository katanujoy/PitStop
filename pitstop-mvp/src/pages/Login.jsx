import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin, goBack }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('driver');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://pitstop-backend1.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('pitstopUser', JSON.stringify(data));
        onLogin(data);
        navigate('/'); // Redirect to Home
      } else {
        setError(data.error || 'Login failed.');
      }
    } catch (err) {
      setError('Server error. Try again later.');
      console.error(err);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button onClick={goBack} style={styles.backButton}>← Back</button>
        <h2 style={styles.title}>Login to Pitstop</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            placeholder="you@example.com"
          />

          <label style={styles.label}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
            placeholder="Your full name"
          />

          <label style={styles.label}>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.select}
          >
            <option value="driver">Driver</option>
            <option value="mechanic">Mechanic</option>
          </select>

          <button type="submit" style={styles.submitBtn}>Login</button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '2.5rem 3rem',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(252, 211, 77, 0.25)',
    maxWidth: '400px',
    width: '100%',
    color: '#f1f5f9',
    boxSizing: 'border-box',
  },
  backButton: {
    background: 'transparent',
    border: 'none',
    color: '#fcd34d',
    cursor: 'pointer',
    fontSize: '1.1rem',
    marginBottom: '1.5rem',
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
    fontWeight: '700',
    fontSize: '1.8rem',
    color: '#fcd34d',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#e2e8f0',
  },
  input: {
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    border: '1px solid #374151',
    backgroundColor: '#0f172a',
    color: '#f1f5f9',
    fontSize: '1rem',
    marginBottom: '1.5rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  select: {
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    border: '1px solid #374151',
    backgroundColor: '#0f172a',
    color: '#f1f5f9',
    fontSize: '1rem',
    marginBottom: '2rem',
    outline: 'none',
    cursor: 'pointer',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%)',
    color: '#0f172a',
    border: 'none',
    padding: '0.75rem 0',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(252, 211, 77, 0.5)',
    transition: 'background-color 0.3s ease',
  },
  error: {
    marginTop: '1rem',
    color: 'tomato',
    fontWeight: '600',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
};

export default LoginPage;
