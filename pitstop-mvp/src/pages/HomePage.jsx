import React from 'react';

const HomePage = ({ onStart, mockLogin }) => {
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

  const handleMockLogin = () => {
    const demoUser = {
      name: 'Joy Kyalo',
      email: 'joy@example.com',
      role: 'driver',
    };
    mockLogin(demoUser);
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Arial, sans-serif', backgroundColor: '#0f172a', color: '#f1f5f9' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#fcd34d' }}>Pitstop 🚗</h2>
        <div>
          <button onClick={onStart} style={{ background: '#fcd34d', color: '#0f172a', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 'bold', marginRight: '0.5rem', cursor: 'pointer' }}>Enter App</button>
          <button onClick={handleMockLogin} style={{ background: '#1e293b', color: '#fcd34d', border: '1px solid #fcd34d', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Demo Login</button>
        </div>
      </nav>

      <section style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#fcd34d' }}>The Story of Pitstop</h1>
        <p style={{ maxWidth: '600px', margin: '1rem auto', color: '#cbd5e1', fontSize: '1rem' }}>
          Pitstop was born out of a need to simplify emergency road assistance in Kenya. From vehicle breakdowns to fuel shortages, we empower drivers to instantly locate help — wherever they are, whenever they need it.
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ color: '#fcd34d', fontSize: '1.5rem' }}>🔧 Features</h3>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', color: '#e2e8f0', fontSize: '1.1rem' }}>
          {features.map((feat, idx) => (
            <li key={idx} style={{ marginBottom: '0.6rem' }}>{feat}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ color: '#fcd34d' }}>💬 What People Are Saying</h3>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          {testimonials.map((t, idx) => (
            <li key={idx} style={{
              background: '#1e293b',
              padding: '1rem',
              borderRadius: '10px',
              color: '#f1f5f9',
              boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
            }}>
              <strong style={{ color: '#fcd34d' }}>{t.name}</strong>
              <p style={{ marginTop: '0.5rem', color: '#cbd5e1' }}>{t.comment}</p>
            </li>
          ))}
        </ul>
      </section>

      <small style={{ color: '#94a3b8' }}>By Joy Katanu Kyalo | 2025</small>
    </div>
  );
};

export default HomePage;
