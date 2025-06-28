import React, { useState } from 'react';

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([
    { from: 'mechanic', text: 'Hello, how can I help you?' },
    { from: 'driver', text: 'I’m stuck on Mombasa Road with a flat tire.' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { from: user.role, text: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div style={{ marginTop: '2rem', textAlign: 'left' }}>
      <h3 style={{ color: '#fcd34d' }}>Live Chat</h3>
      <div style={{
        maxHeight: '200px',
        overflowY: 'auto',
        background: '#1f2937',
        padding: '1rem',
        borderRadius: '6px',
        marginBottom: '1rem'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            textAlign: msg.from === user.role ? 'right' : 'left',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              background: msg.from === user.role ? '#fcd34d' : '#374151',
              color: msg.from === user.role ? '#000' : '#fff',
              padding: '6px 10px',
              borderRadius: '12px',
              display: 'inline-block'
            }}>{msg.text}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
