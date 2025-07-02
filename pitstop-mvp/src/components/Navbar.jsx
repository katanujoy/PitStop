import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleLogout = () => {
    localStorage.removeItem('pitstopToken');
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.topRow}>
          <h2 style={styles.logo}>Pitstop 🚗</h2>

          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} style={styles.hamburger}>
              ☰
            </button>
          )}
        </div>

        <div
          style={{
            ...styles.links,
            ...(isMobile
              ? {
                  display: menuOpen ? 'flex' : 'none',
                  flexDirection: 'column',
                  width: '100%',
                  marginTop: '1rem',
                  gap: '1rem',
                  alignItems: 'flex-start',
                }
              : {}),
          }}
        >
          <Link to="/" style={styles.link} onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link
            to="/emergency"
            style={{ ...styles.link, color: '#f87171' }}
            onClick={() => setMenuOpen(false)}
          >
            🚨 Emergency
          </Link>

          <Link to="/register" style={styles.link} onClick={() => setMenuOpen(false)}>
            Register
          </Link>

          {user ? (
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout ❌
            </button>
          ) : (
            <Link to="/login" style={styles.link} onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#0f172a',
    borderBottom: '2px solid white',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fcd34d',
    margin: 0,
  },
  hamburger: {
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    color: '#fcd34d',
    cursor: 'pointer',
  },
  links: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
    marginTop: '1rem',
  },
  link: {
    textDecoration: 'none',
    color: '#f1f5f9',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'color 0.2s',
  },
  logoutBtn: {
    background: '#fcd34d',
    color: '#0f172a',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default Navbar;
