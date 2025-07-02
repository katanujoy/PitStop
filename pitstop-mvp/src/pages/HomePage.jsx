import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const styles = {
    page: {
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6',
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
    },
    hero: {
      backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: isMobile ? '4rem 1rem' : '6rem 2rem',
      textAlign: 'center',
    },
    heroContent: {
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      padding: '2rem',
      borderRadius: '1rem',
      maxWidth: '600px',
      margin: '0 auto',
    },
    heroTitle: {
      fontSize: isMobile ? '2rem' : '2.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#ffffff',
    },
    heroHighlight: {
      color: '#fde047',
    },
    heroText: {
      fontSize: isMobile ? '1rem' : '1.125rem',
      color: '#cbd5e1',
    },
    section: {
      padding: isMobile ? '2rem 1rem' : '4rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    sectionTitle: {
      color: '#fde047',
      fontSize: isMobile ? '1.5rem' : '2rem',
      fontWeight: 'bold',
      marginBottom: '2rem',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.5rem',
    },
    featureCard: {
      backgroundColor: '#1e293b',
      padding: '1.5rem',
      borderRadius: '1rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      fontSize: '1rem',
    },
    testimonialsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
    },
    testimonialCard: {
      backgroundColor: '#1e293b',
      padding: '1.5rem',
      borderRadius: '1rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(253, 224, 71, 0.1)',
      textAlign: 'left',
    },
    testimonialName: {
      color: '#fde047',
      fontWeight: '600',
      fontSize: '1.125rem',
      marginBottom: '0.5rem',
    },
    testimonialComment: {
      color: '#cbd5e1',
      fontSize: '0.875rem',
    },
    footer: {
      backgroundColor: '#1e293b',
      padding: '1.5rem 1rem',
      textAlign: 'center',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      fontSize: '0.875rem',
      color: '#94a3b8',
    },
  };

  return (
    <div style={styles.page}>

      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            The Story of <span style={styles.heroHighlight}>Pitstop</span>
          </h1>
          <p style={styles.heroText}>
            Pitstop was born to simplify emergency road assistance in Kenya. From breakdowns to fuel shortages,
            we help drivers find nearby help instantly — wherever, whenever.
          </p>
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>🔧 Key Features</h3>
        <div style={styles.featuresGrid}>
          {features.map((feat, i) => (
            <div key={i} style={styles.featureCard}>
              <p>{feat}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>💬 What People Are Saying</h3>
        <div style={styles.testimonialsGrid}>
          {testimonials.map((t, i) => (
            <div key={i} style={styles.testimonialCard}>
              <h4 style={styles.testimonialName}>{t.name}</h4>
              <p style={styles.testimonialComment}>{t.comment}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={styles.footer}>
        <small>By Joy Katanu Kyalo | 2025</small>
      </footer>
    </div>
  );
};

export default HomePage;
