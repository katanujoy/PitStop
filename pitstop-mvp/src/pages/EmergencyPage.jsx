import React, { useEffect, useState } from 'react';
import Chat from '../components/Chat';
import PetrolFinder from '../components/PetrolFinder';
import MechanicProfile from '../components/MechanicProfile';
import Reviews from '../components/Reviews';
import MechanicsNearby from '../components/MechanicsNearby';
import Navbar from '../components/Navbar';

const EmergencyPage = ({ user }) => {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('Ready');
  const [history, setHistory] = useState([]);
  const [assistantReply, setAssistantReply] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => alert('Location access denied!')
    );
  }, []);

  useEffect(() => {
    // Fetch history from backend
    fetch(`http://localhost:5000/api/emergency/history/${user.id}`)
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error('Failed to fetch history:', err));
  }, [user]);

  const handleEmergency = () => {
    setStatus('Sending Request...');
    fetch('http://localhost:5000/api/emergency/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        message: 'Assistance requested from current location',
        latitude: location?.lat,
        longitude: location?.lng,
      })
    })
      .then(res => res.json())
      .then(() => {
        setStatus('Help is on the way! ✅');
        setHistory(prev => [
          {
            message: 'Assistance requested from current location',
            timestamp: new Date().toLocaleString(),
            lat: location?.lat,
            lng: location?.lng,
          },
          ...prev
        ]);
      })
      .catch(() => setStatus('Failed to send request ❌'));
  };

  const askAssistant = async (question) => {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful roadside assistant chatbot." },
          { role: "user", content: question }
        ]
      })
    });
    const data = await res.json();
    setAssistantReply(data.choices?.[0]?.message?.content || 'No reply.');
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f1f5f9', fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: 'auto', padding: '2rem' }}>
        <h2 style={{ color: '#fcd34d', marginBottom: '0.5rem' }}>Welcome {user.name} ({user.role})</h2>
        <p style={{ color: '#cbd5e1', marginBottom: '2rem' }}>Email: {user.email}</p>

        {user.role === 'driver' && (
          <>
            <div style={styles.card}>
              <p>Your Location: {location ? `${location.lat.toFixed(3)}, ${location.lng.toFixed(3)}` : 'Fetching...'}</p>
              <button onClick={handleEmergency} style={styles.button}>Send Emergency Alert 🚨</button>
              <p>{status}</p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Request History</h3>
              <ul style={{ paddingLeft: '1rem' }}>
                {history.map((item, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem', color: '#e2e8f0' }}>
                    {item.timestamp} — {item.message}
                  </li>
                ))}
              </ul>
            </div>

            <div style={styles.card}><PetrolFinder user={user} /></div>
            <div style={styles.card}><MechanicsNearby /></div>
            <div style={styles.card}><Reviews user={user} /></div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Ask Pitstop Assistant 🧠</h3>
              <input
                type="text"
                placeholder="e.g. What to do if my battery is dead?"
                onKeyDown={(e) => e.key === 'Enter' && askAssistant(e.target.value)}
                style={styles.input}
              />
              {assistantReply && (
                <div style={styles.replyBox}>
                  <strong>AI:</strong> {assistantReply}
                </div>
              )}
            </div>
          </>
        )}

        {user.role === 'mechanic' && (
          <>
            <div style={styles.card}>
              <p style={{ color: '#cbd5e1' }}>Waiting for requests near your location...</p>
              <MechanicProfile user={user} />
            </div>
          </>
        )}

        <div style={styles.card}>
          <Chat user={user} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '10px',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
  },
  cardTitle: {
    color: '#fcd34d',
    marginBottom: '1rem'
  },
  button: {
    background: '#fcd34d',
    color: '#0f172a',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: 'none',
    fontWeight: 'bold',
    marginTop: '1rem',
    cursor: 'pointer'
  },
  input: {
    padding: '0.5rem',
    width: '100%',
    marginBottom: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #334155',
    backgroundColor: '#1e293b',
    color: '#f1f5f9'
  },
  replyBox: {
    background: '#1f2937',
    color: '#fcd34d',
    padding: '1rem',
    borderRadius: '5px',
    marginTop: '1rem'
  }
};

export default EmergencyPage;
