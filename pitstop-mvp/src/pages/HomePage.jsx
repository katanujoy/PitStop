import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = ({ onStart }) => {
  const testimonials = [
    {
      name: 'James Mwangi',
      comment: 'Pitstop saved me when my car broke down in the middle of the night. Lifesaver! 🚘',
    },
    {
      name: 'Grace Njeri',
      comment: 'As a mechanic, I love how easy it is to get clients nearby. Great app! 🔧',
    },
    {
      name: 'Ali Yusuf',
      comment: 'Ran out of fuel near Ngong Road — Pitstop connected me with a nearby station in seconds. ⛽',
    },
  ];

  const features = [
    '🚨 One-Tap Emergency Assistance',
    '📍 Real-Time Location Tracking',
    '🔧 Mechanic Profiles with Ratings',
    '💬 Instant Live Chat between Drivers and Mechanics',
    '⛽ Nearby Petrol Station Finder (Free API Based)',
  ];

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>Pitstop <span style={styles.logoEmoji}>🚗</span></h2>
        <div style={styles.navButtons}>
          <Link to="/register" style={styles.enterBtn}>Register</Link>
          <Link to="/login" style={styles.loginBtn}>Login</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={styles.heroSection}>
        <div style={styles.heroCard}>
          <h1 style={styles.title}>The Story of <span style={styles.highlight}>Pitstop</span></h1>
          <p style={styles.description}>
            Pitstop was born to simplify emergency road assistance in Kenya. From breakdowns to fuel shortages,
            we help drivers find nearby help instantly — wherever, whenever.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>🔧 Key Features</h3>
        <div style={styles.featureGrid}>
          <div style={styles.featureRow}>
            {features.slice(0, 3).map((feat, i) => (
              <div key={i} style={styles.card}>
                <span style={styles.cardContent}>{feat}</span>
              </div>
            ))}
          </div>
          <div style={styles.featureRowBottom}>
            {features.slice(3).map((feat, i) => (
              <div key={i} style={styles.card}>
                <span style={styles.cardContent}>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>💬 What People Are Saying</h3>
        <div style={styles.testimonialGrid}>
          {testimonials.map((t, index) => (
            <div key={index} style={styles.testimonial}>
              <div style={styles.testimonialContent}>
                <strong style={styles.name}>{t.name}</strong>
                <p style={styles.comment}>{t.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <small>By Joy Katanu Kyalo | 2025</small>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#0f172a',
    color: '#f1f5f9',
    fontFamily: "'Inter', sans-serif",
    minHeight: '100vh',
    textAlign: 'center',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(252, 211, 77, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    color: '#fcd34d',
    fontSize: '1.8rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
  },
  logoEmoji: {
    marginLeft: '0.5rem',
    transform: 'rotate(-10deg)',
  },
  navButtons: {
    display: 'flex',
    gap: '0.75rem',
  },
  enterBtn: {
    background: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%)',
    color: '#0f172a',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.95rem',
    boxShadow: '0 2px 5px rgba(252, 211, 77, 0.2)',
    textDecoration: 'none',
  },
  loginBtn: {
    background: 'transparent',
    border: '1px solid rgba(252, 211, 77, 0.4)',
    color: '#fcd34d',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    fontWeight: '600',
    textDecoration: 'none',
    fontSize: '0.95rem',
  },
  heroSection: {
    padding: '5rem 1rem 3rem',
    background: 'url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop") center/cover no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    padding: '2rem',
    borderRadius: '12px',
    maxWidth: '700px',
    width: '100%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: '2.8rem',
    color: '#ffffff',
    marginBottom: '1rem',
    fontWeight: '800',
  },
  highlight: {
    color: '#fcd34d',
  },
  description: {
    color: '#cbd5e1',
    fontSize: '1.2rem',
    lineHeight: '1.6',
  },
  section: {
    marginTop: '4rem',
    marginBottom: '4rem',
    padding: '0 2rem',
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    color: '#fcd34d',
    marginBottom: '2rem',
    fontWeight: '700',
  },
  featureGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  featureRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
  },
  featureRowBottom: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
    marginTop: '1rem',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    fontSize: '1rem',
    color: '#e2e8f0',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  cardContent: {
    display: 'block',
    fontWeight: '500',
  },
  testimonialGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  testimonial: {
    backgroundColor: '#1e293b',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'left',
    border: '1px solid rgba(252, 211, 77, 0.1)',
  },
  testimonialContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    color: '#fcd34d',
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
    fontWeight: '600',
  },
  comment: {
    color: '#cbd5e1',
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
  footer: {
    marginTop: '4rem',
    padding: '2rem',
    backgroundColor: '#1e293b',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    color: '#94a3b8',
    fontSize: '0.9rem',
  },
};

export default HomePage;
