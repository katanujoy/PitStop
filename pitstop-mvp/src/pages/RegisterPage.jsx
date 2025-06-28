import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', role: 'driver' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('pitstopUser', JSON.stringify(data));
        navigate('/emergency');
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setError('Server error. Try again later.');
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Register 🚗</h2>
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input} />

        <label style={styles.label}>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />

        <label style={styles.label}>Role</label>
        <select name="role" value={formData.role} onChange={handleChange} style={styles.input}>
          <option value="driver">Driver</option>
          <option value="mechanic">Mechanic</option>
        </select>

        <button type="submit" style={styles.button}>Enter App</button>
        {error && <p style={{ color: 'tomato', marginTop: '1rem' }}>{error}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: 'auto',
    textAlign: 'left',
    padding: '2rem',
    backgroundColor: '#0f172a',
    color: '#f1f5f9',
    borderRadius: '10px',
    marginTop: '3rem',
    fontFamily: 'Arial, sans-serif'
  },
  title: { textAlign: 'center', color: '#fcd34d', marginBottom: '1.5rem' },
  label: { display: 'block', marginBottom: '0.25rem', color: '#f8fafc' },
  input: {
    width: '100%',
    padding: '0.6rem',
    marginBottom: '1.2rem',
    borderRadius: '5px',
    border: '1px solid #334155',
    backgroundColor: '#1e293b',
    color: '#f8fafc'
  },
  button: {
    width: '100%',
    padding: '0.8rem',
    backgroundColor: '#fcd34d',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    color: '#0f172a',
    cursor: 'pointer'
  }
};

export default RegisterPage;
