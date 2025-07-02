import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    role: 'driver' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and Email are required');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address');
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
        localStorage.setItem('pitstopUser', JSON.stringify({
          ...decoded,
          ...data.user  // Include any additional user data from the response
        }));
        
        // Navigate based on role
        navigate(formData.role === 'mechanic' ? '/mechanic-dashboard' : '/emergency');
      } else {
        setError(data?.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Join Pitstop 🚗</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Your name"
              autoFocus
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>I am a</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="driver">Driver (Need Help)</option>
              <option value="mechanic">Mechanic (Provide Help)</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Continue'}
          </button>

          {error && <p style={styles.error}>{error}</p>}

          <p style={styles.note}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
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
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: '600',
    fontSize: '0.95rem',
    color: '#e2e8f0',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid #374151',
    backgroundColor: '#0f172a',
    color: '#f1f5f9',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    ':focus': {
      borderColor: '#fcd34d',
    }
  },
  select: {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid #374151',
    backgroundColor: '#0f172a',
    color: '#f1f5f9',
    fontSize: '1rem',
    outline: 'none',
    cursor: 'pointer',
    ':focus': {
      borderColor: '#fcd34d',
    }
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
    transition: 'all 0.3s ease',
    marginTop: '0.5rem',
  },
  error: {
    color: 'tomato',
    fontWeight: '600',
    fontSize: '0.9rem',
    textAlign: 'center',
    marginTop: '0.5rem',
  },
  note: {
    color: '#94a3b8',
    fontSize: '0.8rem',
    textAlign: 'center',
    marginTop: '1.5rem',
    lineHeight: '1.4',
  },
};

export default RegisterPage;