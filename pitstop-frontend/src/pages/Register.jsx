import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import api from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'driver',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('Registration successful!');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
      toast.error('Registration failed!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <i className="fas fa-car-burst" style={styles.logoIcon}></i>
          <span style={styles.logoText}>PitStop</span>
        </div>
        
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join our platform today</p>
        
        {error && (
          <div style={styles.errorAlert}>
            <i className="fas fa-exclamation-circle" style={styles.errorIcon}></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <FormInput
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            icon="user"
          />
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            icon="envelope"
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            icon="lock"
          />
          <div style={styles.selectGroup}>
            <label htmlFor="role" style={styles.selectLabel}>
              <i className="fas fa-user-tag" style={styles.selectIcon}></i>
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="driver">Driver</option>
              <option value="mechanic">Mechanic</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            style={isLoading ? styles.buttonLoading : styles.button}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin" style={styles.buttonIcon}></i>
                Registering...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus" style={styles.buttonIcon}></i>
                Register
              </>
            )}
          </button>
        </form>

        <div style={styles.footerLinks}>
          <span style={styles.footerText}>Already have an account?</span>
          <a href="/login" style={styles.link}>Sign In</a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    padding: '40px',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  logoIcon: {
    fontSize: '32px',
    color: '#0a2463',
    marginRight: '10px',
  },
  logoText: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0a2463',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#0a2463',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  selectGroup: {
    textAlign: 'left',
    marginBottom: '10px',
  },
  selectLabel: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    color: '#0a2463',
    fontWeight: '500',
    fontSize: '14px',
  },
  selectIcon: {
    marginRight: '8px',
    color: '#0a2463',
    fontSize: '16px',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    backgroundColor: '#f8f9fa',
    color: '#333',
    fontSize: '14px',
  },
  button: {
    backgroundColor: '#0a2463',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '10px',
  },
  buttonLoading: {
    backgroundColor: '#0a2463',
    opacity: '0.8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '10px',
  },
  buttonIcon: {
    fontSize: '16px',
  },
  errorAlert: {
    backgroundColor: '#FFF5F5',
    color: '#E53E3E',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '14px',
  },
  errorIcon: {
    fontSize: '16px',
  },
  footerLinks: {
    marginTop: '25px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#666',
  },
  footerText: {
    color: '#666',
  },
  link: {
    color: '#0a2463',
    textDecoration: 'none',
    fontWeight: '500',
  },
};

export default Register;