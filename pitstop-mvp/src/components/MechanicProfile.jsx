import React, { useState } from 'react';

const MechanicProfile = ({ user }) => {
  const [profile, setProfile] = useState({
    services: 'Tyre change, Battery jumpstart',
    rates: 'Ksh 1,500 - 3,000',
    available: true,
  });

  const toggleAvailability = () => {
    setProfile((prev) => ({ ...prev, available: !prev.available }));
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ marginTop: '2rem', textAlign: 'left' }}>
      <h3 style={{ color: '#fcd34d' }}>Mechanic Profile 🛠️</h3>

      <label>Services Offered:</label>
      <textarea
        rows="3"
        value={profile.services}
        onChange={(e) => handleChange('services', e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '1rem' }}
      />

      <label>Service Rates:</label>
      <input
        type="text"
        value={profile.rates}
        onChange={(e) => handleChange('rates', e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '1rem' }}
      />

      <label>Availability:</label>
      <p>
        <button onClick={toggleAvailability} style={{ marginTop: '0.5rem' }}>
          {profile.available ? '✅ Available' : '⛔ Not Available'}
        </button>
      </p>

      <div style={{
        background: '#1f2937',
        padding: '1rem',
        borderRadius: '8px',
        marginTop: '1rem',
        color: '#fff'
      }}>
        <h4 style={{ color: '#fcd34d' }}>Preview:</h4>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Services:</strong> {profile.services}</p>
        <p><strong>Rates:</strong> {profile.rates}</p>
        <p><strong>Status:</strong> {profile.available ? 'Available ✅' : 'Not Available ❌'}</p>
      </div>
    </div>
  );
};

export default MechanicProfile;
