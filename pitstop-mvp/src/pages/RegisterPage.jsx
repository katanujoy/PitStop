import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', role: 'driver' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and Email are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://pitstop-backend1.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        const decoded = jwtDecode(data.token);
        localStorage.setItem('pitstopToken', data.token);
        localStorage.setItem('pitstopUser', JSON.stringify(decoded));
        navigate('/emergency');
      } else {
        setError(data?.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register 🚗</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Your full name"
          />

          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="you@example.com"
          />

          <label style={styles.label}>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="driver">Driver</option>
            <option value="mechanic">Mechanic</option>
          </select>

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading || !formData.name || !formData.email ? 0.7 : 1,
            }}
            disabled={loading || !formData.name || !formData.email}
          >
            {loading ? 'Registering...' : 'Enter App'}
          </button>

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
    fontFamily: "'Inter', Arial, sans-serif",
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '2.5rem 2rem',
    borderRadius: '16px',
    boxShadow: '0 12px 30px rgba(252, 211, 77, 0.3)',
    maxWidth: '450px',
    width: '100%',
    color: '#f1f5f9',
    boxSizing: 'border-box',
  },
  title: {
    textAlign: 'center',
    color: '#fcd34d',
    marginBottom: '2rem',
    fontWeight: '800',
    fontSize: '2rem',
    letterSpacing: '1px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: '600',
    fontSize: '0.95rem',
    color: '#e2e8f0',
  },
  input: {
    padding: '0.75rem 1rem',
    marginBottom: '1.2rem',
    borderRadius: '10px',
    border: '1px solid #374151',
    backgroundColor: '#0f172a',
    color: '#f1f5f9',
    fontSize: '1rem',
    outline: 'none',
  },
  select: {
    padding: '0.75rem 1rem',
    marginBottom: '1.5rem',
    borderRadius: '10px',
    border: '1px solid #374151',
    backgroundColor: '#0f172a',
    color: '#f1f5f9',
    fontSize: '1rem',
    outline: 'none',
    cursor: 'pointer',
  },
  button: {
    padding: '0.9rem',
    background: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%)',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '1.1rem',
    color: '#0f172a',
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(252, 211, 77, 0.5)',
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

export default RegisterPage;
