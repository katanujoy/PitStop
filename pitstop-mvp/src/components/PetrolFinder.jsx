import React, { useEffect, useState } from 'react';
import Reviews from './Reviews';
import MechanicsNearby from '../components/MechanicsNearby';

const PetrolFinder = ({ user }) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const query = `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="fuel"](around:5000,${latitude},${longitude});out;`;

        fetch(query)
          .then(res => res.json())
          .then(data => {
            const results = data.elements.map((el) => ({
              id: el.id,
              name: el.tags.name || 'Unnamed Station',
              lat: el.lat,
              lon: el.lon
            }));
            setStations(results);
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
      <h3 style={{ color: '#fcd34d' }}>Nearby Petrol Stations ⛽</h3>
      {loading ? (
        <p>Fetching nearby stations...</p>
      ) : stations.length === 0 ? (
        <p>No stations found nearby.</p>
      ) : (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem'
        }}>
          {stations.map((station) => (
            <li key={station.id} style={{
              background: '#1f2937',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              color: '#fff'
            }}>
              <strong style={{ color: '#fcd34d' }}>{station.name}</strong><br />
              <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                Lat: {station.lat.toFixed(3)}, Lng: {station.lon.toFixed(3)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <Reviews user={user} />
      <MechanicsNearby />
    </div>
  );
};

export default PetrolFinder;
