import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';

const LoginPage = ({ onLogin, goBack }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = 'Required';
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Invalid email format';
      }

      if (!values.password) {
        errors.password = 'Required';
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await fetch('https://pitstop-backend1.onrender.com/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('pitstopToken', data.token);
          localStorage.setItem('pitstopUser', JSON.stringify(data.user));
          onLogin(data.user);
          navigate('/');
        } else {
          setErrors({ general: data.error || 'Login failed.' });
        }
      } catch (err) {
        setErrors({ general: 'Server error. Try again later.' });
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button onClick={goBack} style={styles.backButton}>← Back</button>
        <h2 style={styles.title}>Login to Pitstop</h2>

        <form onSubmit={formik.handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            style={styles.input}
            placeholder="you@example.com"
          />
          {formik.touched.email && formik.errors.email && (
            <div style={styles.error}>{formik.errors.email}</div>
          )}

          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            style={styles.input}
            placeholder="Your password"
          />
          {formik.touched.password && formik.errors.password && (
            <div style={styles.error}>{formik.errors.password}</div>
          )}

          <button type="submit" style={styles.submitBtn} disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          {formik.errors.general && <p style={styles.error}>{formik.errors.general}</p>}
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
    marginBottom: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
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
    marginTop: '1rem',
  },
  error: {
    color: 'tomato',
    fontWeight: '600',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
};

export default LoginPage;
