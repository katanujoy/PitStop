import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Pitstop 🚗</h2>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>

        {/* Only show Logout if user is logged in */}
        {user && (
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout ❌</button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#0f172a',
    borderBottom: '2px solid rgb(255, 255, 255)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fcd34d',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
  },
  link: {
    textDecoration: 'none',
    color: '#f1f5f9',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  logoutBtn: {
    background: '#fcd34d',
    color: '#0f172a',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default Navbar;
