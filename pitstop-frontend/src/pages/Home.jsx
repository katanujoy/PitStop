// pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Function to scroll to the features section
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const styles = {
    container: {
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
      padding: '0',
      lineHeight: '1.6',
      maxWidth: '1100px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      color: '#212529',
    },
    hero: {
      textAlign: 'center',
      padding: '100px 20px 80px',
      backgroundColor: '#ffffff',
      background: 'linear-gradient(to bottom, #f8faff 0%, #ffffff 100%)',
    },
    heroTitle: {
      fontSize: '3.5rem',
      fontWeight: '800',
      color: '#0d47a1',
      marginBottom: '1rem',
      letterSpacing: '-0.5px',
      textShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    highlight: {
      color: '#1976d2',
      background: 'linear-gradient(120deg, #1976d2 0%, #0d47a1 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    heroSubtitle: {
      fontSize: '1.4rem',
      color: '#555',
      marginBottom: '2.5rem',
      fontWeight: '400',
      maxWidth: '700px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    buttons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    button: {
      padding: '0.8rem 1.8rem',
      border: 'none',
      borderRadius: '50px',
      fontSize: '1rem',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '160px',
    },
    buttonPrimary: {
      backgroundColor: '#1976d2',
      color: '#fff',
      background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
      },
    },
    buttonSecondary: {
      backgroundColor: '#607d8b',
      color: '#fff',
      background: 'linear-gradient(135deg, #607d8b 0%, #455a64 100%)',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(96, 125, 139, 0.3)',
      },
    },
    section: {
      padding: '5rem 2rem',
      backgroundColor: '#ffffff',
    },
    sectionTitle: {
      fontSize: '2.4rem',
      textAlign: 'center',
      marginBottom: '1.5rem',
      color: '#0d47a1',
      fontWeight: '700',
      position: 'relative',
      display: 'inline-block',
      marginLeft: 'auto',
      marginRight: 'auto',
      ':after': {
        content: '""',
        position: 'absolute',
        bottom: '-10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80px',
        height: '4px',
        background: 'linear-gradient(90deg, #1976d2 0%, #0d47a1 100%)',
        borderRadius: '2px',
      },
    },
    sectionText: {
      textAlign: 'center',
      maxWidth: '800px',
      margin: '0 auto 3rem',
      color: '#555',
      fontSize: '1.1rem',
      lineHeight: '1.7',
    },
    features: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '2rem',
      marginTop: '2rem',
    },
    featureBox: {
      flex: '1 1 300px',
      maxWidth: '350px',
      padding: '2.5rem 2rem',
      backgroundColor: '#ffffff',
      border: '1px solid rgba(0,0,0,0.05)',
      borderRadius: '16px',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      ':hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        borderColor: 'rgba(25, 118, 210, 0.2)',
      },
    },
    icon: {
      fontSize: '3rem',
      marginBottom: '1.5rem',
      background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'inline-block',
    },
    testimonial: {
      fontStyle: 'italic',
      textAlign: 'center',
      margin: '4rem auto',
      color: '#555',
      backgroundColor: '#ffffff',
      padding: '3rem',
      borderRadius: '16px',
      maxWidth: '800px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      borderLeft: '4px solid #1976d2',
      fontSize: '1.1rem',
      lineHeight: '1.8',
      position: 'relative',
      ':before': {
        content: '"\\201C"',
        fontSize: '5rem',
        color: 'rgba(25, 118, 210, 0.1)',
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        lineHeight: '1',
      },
    },
    testimonialAuthor: {
      textAlign: 'center',
      marginTop: '1.5rem',
      color: '#666',
      fontWeight: '600',
      fontSize: '1rem',
    },
    cta: {
      textAlign: 'center',
      padding: '5rem 2rem',
      backgroundColor: '#ffffff',
      marginTop: '2rem',
      background: 'linear-gradient(to bottom, #ffffff 0%, #f8faff 100%)',
      borderRadius: '16px',
    },
    storeButton: {
      backgroundColor: '#0d47a1',
      color: '#fff',
      padding: '0.8rem 1.8rem',
      margin: '0.5rem',
      border: 'none',
      borderRadius: '50px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(13, 71, 161, 0.3)',
      },
    },
    chatWidget: {
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: '300px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
      padding: '1.5rem',
      fontSize: '0.9rem',
      color: '#333',
      zIndex: 9999,
      border: '1px solid rgba(0,0,0,0.05)',
      transform: 'scale(1)',
      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      ':hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 10px 35px rgba(0,0,0,0.2)',
      },
    },
    chatHeader: {
      fontWeight: '700',
      marginBottom: '1rem',
      fontSize: '1.1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#0d47a1',
    },
    chatMessage: {
      backgroundColor: '#f0f7ff',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '1rem',
      fontSize: '0.95rem',
      lineHeight: '1.5',
      transition: 'all 0.3s ease',
      ':hover': {
        backgroundColor: '#e1f0ff',
      },
    },
    appIcon: {
      marginRight: '0.5rem',
      fontSize: '1.2rem',
    },
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          <span style={styles.highlight}>Pit</span>Stop
        </h1>
        <p style={styles.heroSubtitle}>Premium roadside assistance at your fingertips</p>
        <div style={styles.buttons}>
          <Link 
            to="/register" 
            style={{ 
              ...styles.button, 
              ...styles.buttonPrimary,
              ':hover': styles.buttonPrimary[':hover']
            }}
          >
            Get Started
          </Link>
          <button 
            onClick={scrollToFeatures}
            style={{ 
              ...styles.button, 
              ...styles.buttonSecondary,
              ':hover': styles.buttonSecondary[':hover']
            }}
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Value Proposition */}
      <div id="features-section" style={styles.section}>
        <h2 style={{...styles.sectionTitle, ':after': styles.sectionTitle[':after']}}>Your Journey, Our Priority</h2>
        <p style={styles.sectionText}>
          From emergency repairs to fuel delivery, we've got you covered 24/7 with our network of certified professionals.
        </p>
        <div style={styles.features}>
          <div style={{...styles.featureBox, ':hover': styles.featureBox[':hover']}}>
            <div style={styles.icon}>🛠️</div>
            <h3>Emergency Assistance</h3>
            <p>Connect instantly with nearby mechanics for immediate help.</p>
          </div>
          <div style={{...styles.featureBox, ':hover': styles.featureBox[':hover']}}>
            <Link to="/petrol" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div>
                <div style={styles.icon}>⛽</div>
                <h3>Fuel Delivery</h3>
                <p>Never stranded again with our on-demand fuel service.</p>
              </div>
            </Link>
          </div>
          <div style={{...styles.featureBox, ':hover': styles.featureBox[':hover']}}>
            <div style={styles.icon}>📱</div>
            <h3>Real-time Tracking</h3>
            <p>Watch your help arrive with live GPS tracking.</p>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div style={{...styles.testimonial, ':before': styles.testimonial[':before']}}>
        <blockquote>
          "I was stranded on the highway at night when my battery died. PitStop had a technician to me in 18 minutes.
          The app showed exactly when he would arrive and what he was doing. Incredible service!"
        </blockquote>
        <div style={styles.testimonialAuthor}>
          <p><strong>Michael Rodriguez</strong></p>
          <p>Premium Member since 2021</p>
        </div>
      </div>

      {/* CTA */}
      <div style={styles.cta}>
        <h2 style={{...styles.sectionTitle, ':after': styles.sectionTitle[':after']}}>Ready for Stress-Free Driving?</h2>
        <p style={styles.sectionText}>
          Download the PitStop app today and drive with confidence knowing help is always nearby.
        </p>
        <div>
          <button style={{...styles.storeButton, ':hover': styles.storeButton[':hover']}}>
            <span style={styles.appIcon}>🍏</span> App Store
          </button>
          <button style={{...styles.storeButton, ':hover': styles.storeButton[':hover']}}>
            <span style={styles.appIcon}>🤖</span> Google Play
          </button>
        </div>
      </div>

      {/* Chat Widget */}
      <Link to="/chat" style={{ textDecoration: 'none' }}>
        <div style={{...styles.chatWidget, ':hover': styles.chatWidget[':hover']}}>
          <div style={styles.chatHeader}>💬 PitStop Assistant</div>
          <div style={{...styles.chatMessage, ':hover': styles.chatMessage[':hover']}}>
            Hi there! Need help? We're just a message away.
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Home;