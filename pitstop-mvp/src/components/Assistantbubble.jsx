import React from 'react';

const AssistantBubble = ({ message }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.6rem',
      marginTop: '1rem',
      background: '#f3f4f6',
      padding: '1rem',
      borderRadius: '12px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      color: '#111827'
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        background: '#fcd34d',
        borderRadius: '50%',
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#000',
        fontSize: '18px',
        lineHeight: '36px'
      }}>
        🤖
      </div>
      <div style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
        {message}
      </div>
    </div>
  );
};

export default AssistantBubble;
