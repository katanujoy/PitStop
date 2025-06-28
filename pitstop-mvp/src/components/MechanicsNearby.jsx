import React, { useEffect, useState } from 'react';

const MechanicsNearby = () => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const query = `https://overpass-api.de/api/interpreter?data=[out:json];node["craft"="mechanic"](around:5000,${latitude},${longitude});out;`;

        fetch(query)
          .then((res) => res.json())
          .then((data) => {
            const results = data.elements.map((el) => ({
              id: el.id,
              name: el.tags.name || 'Unnamed Mechanic',
              lat: el.lat,
              lon: el.lon,
              phone: el.tags.phone || 'N/A'
            }));
            setMechanics(results);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      },
      () => {
        alert('Failed to get location. Please enable GPS.');
        setLoading(false);
      }
    );
  }, []);

  return (
    <div style={{ marginTop: '2rem', textAlign: 'left' }}>
      <h3 style={{ color: '#fcd34d' }}>Mechanics Nearby 🧰</h3>
      {loading ? (
        <p>Loading nearby mechanics...</p>
      ) : mechanics.length === 0 ? (
        <p>No mechanics found nearby.</p>
      ) : (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem'
        }}>
          {mechanics.map((mech) => (
            <li key={mech.id} style={{
              background: '#1f2937',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              color: '#fff'
            }}>
              <strong style={{ color: '#fcd34d' }}>{mech.name}</strong><br />
              <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                Lat: {mech.lat.toFixed(3)}, Lng: {mech.lon.toFixed(3)}
              </span><br />
              <span style={{ fontSize: '0.9rem', color: '#f1f5f9' }}>
                Phone: {mech.phone}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MechanicsNearby;
