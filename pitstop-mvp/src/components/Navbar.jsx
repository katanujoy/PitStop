import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Pitstop 🚗</h2>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/register" style={styles.link}>Register</Link>
        <Link to="/login" style={styles.link}>Login</Link>
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
    borderBottom: '2px solidrgb(255, 255, 255)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fcd34d'
  },
  links: {
    display: 'flex',
    gap: '1.5rem'
  },
  link: {
    textDecoration: 'none',
    color: '#f1f5f9',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'color 0.3s',
  }
};

export default Navbar;
