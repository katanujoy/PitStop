import React, { useEffect, useState } from 'react';
import Chat from '../components/Chat';
import PetrolFinder from '../components/PetrolFinder';
import MechanicsNearby from '../components/MechanicsNearby';
import Navbar from '../components/Navbar';
import { 
  FiAlertTriangle, 
  FiMapPin, 
  FiTool, 
  FiMessageSquare, 
  FiUser, 
  FiClock, 
  FiZap, 
  FiStar,
  FiEdit,
  FiPhone,
  FiMail,
  FiDollarSign,
  FiCheckCircle
} from 'react-icons/fi';

const EmergencyPage = ({ user }) => {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('Ready');
  const [history, setHistory] = useState([]);
  const [assistantReply, setAssistantReply] = useState('');
  const [question, setQuestion] = useState('');
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('emergency');
  const [mockRequests, setMockRequests] = useState([]);
  const [reviews, setReviews] = useState([
    { id: 1, name: 'James Mwangi', rating: 5, comment: 'Fixed my flat tire in 15 minutes!', date: '2023-05-15' },
    { id: 2, name: 'Grace Njeri', rating: 4, comment: 'Good service but a bit pricey', date: '2023-04-22' },
  ]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        console.log('Location fetched:', pos.coords.latitude, pos.coords.longitude);
        generateMockRequests(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.error('Location error:', err.message);
        alert('Location access denied: ' + err.message);
        const defaultLocation = { lat: -1.286389, lng: 36.817223 }; // Default to Nairobi
        setLocation(defaultLocation);
        generateMockRequests(defaultLocation.lat, defaultLocation.lng);
      }
    );
  }, []);

  // Generate mock requests for mechanics
  const generateMockRequests = (lat, lng) => {
    const mockData = [
      {
        id: 1,
        user_id: 'mock1',
        name: 'John Mwangi',
        message: 'Flat tire near CBD',
        distance: (Math.random() * 5 + 1).toFixed(1),
        timestamp: new Date(Date.now() - 300000).toLocaleString(),
        lat: lat + (Math.random() * 0.02 - 0.01),
        lng: lng + (Math.random() * 0.02 - 0.01)
      },
      {
        id: 2,
        user_id: 'mock2',
        name: 'Sarah Kamau',
        message: 'Engine overheating on Mombasa Road',
        distance: (Math.random() * 5 + 1).toFixed(1),
        timestamp: new Date(Date.now() - 600000).toLocaleString(),
        lat: lat + (Math.random() * 0.02 - 0.01),
        lng: lng + (Math.random() * 0.02 - 0.01)
      },
      {
        id: 3,
        user_id: 'mock3',
        name: 'David Ochieng',
        message: 'Battery died near Westlands',
        distance: (Math.random() * 5 + 1).toFixed(1),
        timestamp: new Date(Date.now() - 900000).toLocaleString(),
        lat: lat + (Math.random() * 0.02 - 0.01),
        lng: lng + (Math.random() * 0.02 - 0.01)
      }
    ];
    setMockRequests(mockData);
  };

  // Handle emergency alert
  const handleEmergency = () => {
    if (!location) {
      alert('Location not available. Please enable location and try again.');
      return;
    }

    setStatus('Sending Request...');

    setTimeout(() => {
      setStatus('Help is on the way! ✅');
      setHistory((prev) => [
        {
          message: 'Emergency assistance requested',
          timestamp: new Date().toLocaleString(),
          lat: location.lat,
          lng: location.lng,
        },
        ...prev,
      ]);
      
      const newRequest = {
        id: Date.now(),
        user_id: user?.id || 'current-user',
        name: user?.name || 'Anonymous',
        message: 'Emergency assistance requested',
        distance: '0.5',
        timestamp: new Date().toLocaleString(),
        lat: location.lat,
        lng: location.lng
      };
      setMockRequests(prev => [newRequest, ...prev]);
    }, 1500);
  };

  // Ask assistant AI
  const askAssistant = async () => {
    if (!question) return;

    setIsAssistantLoading(true);
    setAssistantReply('Thinking...');
    
    try {
      setTimeout(() => {
        const responses = [
          "For a dead battery, try jump-starting your car using jumper cables and another vehicle. Make sure to connect positive to positive and negative to a grounded metal part.",
          "If your engine is overheating, turn off the AC and turn on the heater to draw heat away from the engine. Pull over safely and wait for the engine to cool.",
          "For a flat tire, find a safe location to pull over. Use your spare tire and jack to replace it, or call for assistance if you're unsure.",
          "If your car won't start, check if your battery terminals are clean and properly connected. Sometimes corrosion can prevent proper contact.",
          "For a check engine light, try tightening your gas cap first. If the light stays on, you'll need to get the code read at a mechanic.",
          "If you smell gasoline, pull over immediately and turn off the engine. There might be a fuel leak which is a fire hazard."
        ];
        setAssistantReply(responses[Math.floor(Math.random() * responses.length)]);
        setQuestion('');
        setIsAssistantLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Assistant error:', error);
      setAssistantReply('❌ Error contacting assistant. Please try again.');
      setIsAssistantLoading(false);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    const review = {
      id: Date.now(),
      name: user?.name || 'Anonymous',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
  };

  const renderProfileSection = () => (
    <div style={styles.profileContainer}>
      {/* Profile Info Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <FiUser size={24} style={styles.icon} />
          <h3 style={styles.cardTitle}>Mechanic Profile</h3>
        </div>
        
        <div style={styles.profileInfo}>
          <div style={styles.avatarLarge}>{user?.name?.charAt(0) || 'M'}</div>
          <div style={styles.profileDetails}>
            <h4 style={styles.profileName}>{user?.name || 'Mechanic Name'}</h4>
            <p style={styles.profileText}><FiMail style={styles.profileIcon} /> {user?.email || 'mechanic@pitstop.com'}</p>
            <p style={styles.profileText}><FiPhone style={styles.profileIcon} /> +254 700 123456</p>
            <p style={styles.profileText}><FiTool style={styles.profileIcon} /> Tire Change, Battery Jumpstart, Engine Diagnostics</p>
            <p style={styles.profileText}><FiDollarSign style={styles.profileIcon} /> KES 1,500 - 3,000 per service</p>
            <p style={styles.profileText}><FiCheckCircle style={styles.profileIcon} /> <span style={styles.available}>Available</span></p>
          </div>
        </div>
      </div>

      {/* Reviews Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <FiStar size={24} style={styles.icon} />
          <h3 style={styles.cardTitle}>Ratings & Reviews</h3>
        </div>

        <div style={styles.ratingSummary}>
          <div style={styles.averageRating}>
            <span style={styles.ratingNumber}>4.5</span>
            <div style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar 
                  key={star} 
                  color={star <= 4.5 ? '#fcd34d' : '#94a3b8'} 
                  fill={star <= 4.5 ? '#fcd34d' : 'none'}
                />
              ))}
            </div>
            <span style={styles.ratingCount}>{reviews.length} reviews</span>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleReviewSubmit} style={styles.reviewForm}>
          <h4 style={styles.sectionTitle}>Add Your Review</h4>
          <div style={styles.ratingInput}>
            <label>Rating:</label>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
              style={styles.selectInput}
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>{num} ★</option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Share your experience..."
            value={newReview.comment}
            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
            style={styles.textareaInput}
            rows={4}
            required
          />
          <button type="submit" style={styles.submitButton}>
            <FiEdit style={{ marginRight: '8px' }} />
            Submit Review
          </button>
        </form>

        {/* Reviews List */}
        <div style={styles.reviewsList}>
          {reviews.map((review) => (
            <div key={review.id} style={styles.reviewItem}>
              <div style={styles.reviewHeader}>
                <div style={styles.reviewerAvatar}>{review.name.charAt(0)}</div>
                <div>
                  <strong>{review.name}</strong>
                  <div style={styles.reviewStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar 
                        key={star} 
                        size={16}
                        color={star <= review.rating ? '#fcd34d' : '#94a3b8'} 
                        fill={star <= review.rating ? '#fcd34d' : 'none'}
                      />
                    ))}
                  </div>
                </div>
                <span style={styles.reviewDate}>{review.date}</span>
              </div>
              <p style={styles.reviewComment}>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'emergency':
        return (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <FiAlertTriangle size={24} style={styles.icon} />
              <h3 style={styles.cardTitle}>Emergency Assistance</h3>
            </div>
            <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
              Your Location: {location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : 'Fetching...'}
            </p>
            <button onClick={handleEmergency} style={styles.emergencyButton}>
              <FiZap style={{ marginRight: '8px' }} />
              Send Emergency Alert 🚨
            </button>
            <p style={{ marginTop: '1rem', color: status.includes('✅') ? '#4ade80' : '#f59e0b' }}>{status}</p>
            
            <div style={{ marginTop: '2rem' }}>
              <h4 style={styles.sectionTitle}>Recent Requests</h4>
              <div style={styles.historyList}>
                {history.map((item, index) => (
                  <div key={index} style={styles.historyItem}>
                    <div style={styles.historyTime}>{item.timestamp}</div>
                    <div>{item.message}</div>
                  </div>
                ))}
                {history.length === 0 && (
                  <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No emergency requests yet</p>
                )}
              </div>
            </div>
          </div>
        );
      case 'petrol':
        return (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <FiMapPin size={24} style={styles.icon} />
              <h3 style={styles.cardTitle}>Nearby Petrol Stations</h3>
            </div>
            <PetrolFinder user={user} location={location} />
          </div>
        );
      case 'mechanics':
        return (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <FiTool size={24} style={styles.icon} />
              <h3 style={styles.cardTitle}>Nearby Mechanics</h3>
            </div>
            <MechanicsNearby location={location} />
          </div>
        );
      case 'chat':
        return (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <FiMessageSquare size={24} style={styles.icon} />
              <h3 style={styles.cardTitle}>Live Chat</h3>
            </div>
            <Chat user={user} />
          </div>
        );
      case 'assistant':
        return (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <FiUser size={24} style={styles.icon} />
              <h3 style={styles.cardTitle}>AI Assistant</h3>
            </div>
            <div style={styles.replyBox}>
              <div style={styles.replyHeader}>Ask our AI assistant for help:</div>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                style={styles.input}
                placeholder="Ask about car problems..."
                onKeyPress={(e) => e.key === 'Enter' && askAssistant()}
              />
              <button 
                onClick={askAssistant} 
                style={styles.submitButton}
                disabled={isAssistantLoading}
              >
                {isAssistantLoading ? 'Thinking...' : 'Ask Assistant'}
              </button>
              {assistantReply && (
                <div style={styles.replyContent}>
                  <p><strong>Assistant:</strong> {assistantReply}</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'profile':
        return renderProfileSection();
      case 'requests':
        return (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <FiClock size={24} style={styles.icon} />
              <h3 style={styles.cardTitle}>Service Requests</h3>
            </div>
            <div style={styles.requestsList}>
              {mockRequests.map((request) => (
                <div key={request.id} style={styles.requestItem}>
                  <div style={styles.requestHeader}>
                    <span style={styles.requestName}>{request.name}</span>
                    <span style={styles.requestDistance}>{request.distance} km away</span>
                  </div>
                  <div style={styles.requestMessage}>{request.message}</div>
                  <div style={styles.requestTime}>{request.timestamp}</div>
                  <button style={styles.acceptButton}>Accept Request</button>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const styles = {
    container: {
      backgroundColor: '#0f172a',
      color: '#f1f5f9',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      minHeight: '100vh',
    },
    mainLayout: {
      display: 'flex',
      minHeight: 'calc(100vh - 60px)',
    },
    sidebar: {
      width: '280px',
      backgroundColor: '#1e293b',
      padding: '1.5rem 1rem',
      borderRight: '1px solid #334155',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '2rem',
      paddingBottom: '1.5rem',
      borderBottom: '1px solid #334155',
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      backgroundColor: '#fcd34d',
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginRight: '1rem',
    },
    userDetails: {
      display: 'flex',
      flexDirection: 'column',
    },
    userName: {
      fontWeight: '600',
      fontSize: '1rem',
    },
    userRole: {
      color: '#94a3b8',
      fontSize: '0.85rem',
      textTransform: 'capitalize',
    },
    navMenu: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    navButton: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      backgroundColor: 'transparent',
      color: '#e2e8f0',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      textAlign: 'left',
      fontSize: '0.95rem',
      transition: 'all 0.2s ease',
    },
    activeNavButton: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      backgroundColor: '#334155',
      color: '#fcd34d',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      textAlign: 'left',
      fontSize: '0.95rem',
      fontWeight: '500',
      transition: 'all 0.2s ease',
    },
    navIcon: {
      marginRight: '0.75rem',
      fontSize: '1.1rem',
    },
    contentArea: {
      flex: 1,
      padding: '2rem',
      overflowY: 'auto',
    },
    contentHeader: {
      marginBottom: '2rem',
    },
    welcomeText: {
      color: '#f8fafc',
      fontSize: '1.8rem',
      marginBottom: '0.5rem',
    },
    locationText: {
      color: '#94a3b8',
      fontSize: '0.9rem',
    },
    card: {
      backgroundColor: '#1e293b',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      border: '1px solid #334155',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    icon: {
      color: '#fcd34d',
      marginRight: '0.75rem',
    },
    cardTitle: {
      color: '#f8fafc',
      fontSize: '1.3rem',
      margin: 0,
    },
    sectionTitle: {
      color: '#fcd34d',
      fontSize: '1.1rem',
      marginBottom: '1rem',
    },
    emergencyButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '1rem',
      width: '100%',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
    },
    input: {
      padding: '0.75rem 1rem',
      width: '100%',
      marginBottom: '1rem',
      borderRadius: '8px',
      border: '1px solid #334155',
      backgroundColor: '#1e293b',
      color: '#f1f5f9',
      fontSize: '0.95rem',
    },
    replyBox: {
      background: '#1f2937',
      color: '#e2e8f0',
      padding: '1rem',
      borderRadius: '8px',
      borderLeft: '3px solid #fcd34d',
    },
    replyHeader: {
      color: '#fcd34d',
      marginBottom: '0.5rem',
      fontSize: '0.9rem',
    },
    replyContent: {
      lineHeight: '1.6',
      marginTop: '1rem',
      padding: '0.75rem',
      backgroundColor: '#334155',
      borderRadius: '8px',
    },
    historyList: {
      marginTop: '1rem',
    },
    historyItem: {
      padding: '0.75rem 0',
      borderBottom: '1px solid #334155',
      fontSize: '0.9rem',
    },
    historyTime: {
      color: '#94a3b8',
      fontSize: '0.8rem',
      marginBottom: '0.25rem',
    },
    requestsList: {
      marginTop: '1rem',
    },
    requestItem: {
      padding: '1rem',
      marginBottom: '1rem',
      backgroundColor: '#334155',
      borderRadius: '8px',
      borderLeft: '3px solid #fcd34d',
    },
    requestHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
    },
    requestName: {
      fontWeight: '600',
      color: '#f8fafc',
    },
    requestDistance: {
      color: '#fcd34d',
      fontSize: '0.85rem',
    },
    requestMessage: {
      color: '#e2e8f0',
      marginBottom: '0.5rem',
    },
    requestTime: {
      color: '#94a3b8',
      fontSize: '0.8rem',
      marginBottom: '0.75rem',
    },
    acceptButton: {
      background: '#fcd34d',
      color: '#0f172a',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      fontWeight: '500',
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
    profileContainer: {
      display: 'grid',
      gap: '1.5rem',
    },
    profileInfo: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1.5rem',
    },
    avatarLarge: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#fcd34d',
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      fontWeight: 'bold',
      flexShrink: 0,
    },
    profileDetails: {
      flex: 1,
    },
    profileName: {
      color: '#f8fafc',
      fontSize: '1.5rem',
      margin: '0 0 0.5rem 0',
    },
    profileText: {
      color: '#cbd5e1',
      margin: '0.5rem 0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    profileIcon: {
      color: '#fcd34d',
    },
    available: {
      color: '#4ade80',
    },
    ratingSummary: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '1.5rem',
    },
    averageRating: {
      textAlign: 'center',
    },
    ratingNumber: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#f8fafc',
      display: 'block',
    },
    stars: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.25rem',
      margin: '0.5rem 0',
    },
    ratingCount: {
      color: '#94a3b8',
      fontSize: '0.9rem',
    },
    reviewForm: {
      marginBottom: '2rem',
      padding: '1rem',
      backgroundColor: '#334155',
      borderRadius: '8px',
    },
    ratingInput: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1rem',
      color: '#e2e8f0',
    },
    selectInput: {
      padding: '0.5rem',
      borderRadius: '6px',
      backgroundColor: '#1e293b',
      color: '#f1f5f9',
      border: '1px solid #334155',
    },
    textareaInput: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '8px',
      backgroundColor: '#1e293b',
      color: '#f1f5f9',
      border: '1px solid #334155',
      marginBottom: '1rem',
      resize: 'vertical',
    },
    submitButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fcd34d',
      color: '#0f172a',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '1rem',
      width: '100%',
    },
    reviewsList: {
      marginTop: '1rem',
    },
    reviewItem: {
      padding: '1rem 0',
      borderBottom: '1px solid #334155',
    },
    reviewHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '0.5rem',
    },
    reviewerAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#334155',
      color: '#f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
    },
    reviewStars: {
      display: 'flex',
      gap: '0.1rem',
    },
    reviewDate: {
      color: '#94a3b8',
      fontSize: '0.8rem',
      marginLeft: 'auto',
    },
    reviewComment: {
      color: '#e2e8f0',
      margin: '0.5rem 0 0 0',
      lineHeight: '1.5',
    },
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.mainLayout}>
        {/* Sidebar Navigation */}
        <div style={styles.sidebar}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>{user?.name?.charAt(0) || 'U'}</div>
            <div style={styles.userDetails}>
              <div style={styles.userName}>{user?.name || 'User'}</div>
              <div style={styles.userRole}>{user?.role || 'Driver'}</div>
            </div>
          </div>

          <nav style={styles.navMenu}>
            {user?.role === 'driver' && (
              <>
                <button 
                  onClick={() => setActiveTab('emergency')} 
                  style={activeTab === 'emergency' ? styles.activeNavButton : styles.navButton}
                >
                  <FiAlertTriangle style={styles.navIcon} />
                  Emergency
                </button>
                <button 
                  onClick={() => setActiveTab('petrol')} 
                  style={activeTab === 'petrol' ? styles.activeNavButton : styles.navButton}
                >
                  <FiMapPin style={styles.navIcon} />
                  Petrol Stations
                </button>
                <button 
                  onClick={() => setActiveTab('mechanics')} 
                  style={activeTab === 'mechanics' ? styles.activeNavButton : styles.navButton}
                >
                  <FiTool style={styles.navIcon} />
                  Mechanics
                </button>
                <button 
                  onClick={() => setActiveTab('assistant')} 
                  style={activeTab === 'assistant' ? styles.activeNavButton : styles.navButton}
                >
                  <FiUser style={styles.navIcon} />
                  AI Assistant
                </button>
                <button 
                  onClick={() => setActiveTab('chat')} 
                  style={activeTab === 'chat' ? styles.activeNavButton : styles.navButton}
                >
                  <FiMessageSquare style={styles.navIcon} />
                  Live Chat
                </button>
                <button 
                  onClick={() => setActiveTab('profile')} 
                  style={activeTab === 'profile' ? styles.activeNavButton : styles.navButton}
                >
                  <FiUser style={styles.navIcon} />
                  My Profile
                </button>
              </>
            )}

            {user?.role === 'mechanic' && (
              <>
                <button 
                  onClick={() => setActiveTab('requests')} 
                  style={activeTab === 'requests' ? styles.activeNavButton : styles.navButton}
                >
                  <FiClock style={styles.navIcon} />
                  Service Requests
                </button>
                <button 
                  onClick={() => setActiveTab('profile')} 
                  style={activeTab === 'profile' ? styles.activeNavButton : styles.navButton}
                >
                  <FiUser style={styles.navIcon} />
                  My Profile
                </button>
                <button 
                  onClick={() => setActiveTab('chat')} 
                  style={activeTab === 'chat' ? styles.activeNavButton : styles.navButton}
                >
                  <FiMessageSquare style={styles.navIcon} />
                  Live Chat
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Main Content Area */}
        <div style={styles.contentArea}>
          <div style={styles.contentHeader}>
            <h2 style={styles.welcomeText}>
              {activeTab === 'emergency' && 'Emergency Assistance'}
              {activeTab === 'petrol' && 'Nearby Petrol Stations'}
              {activeTab === 'mechanics' && 'Find Mechanics Nearby'}
              {activeTab === 'assistant' && 'Pitstop AI Assistant'}
              {activeTab === 'chat' && 'Live Chat Support'}
              {activeTab === 'profile' && 'My Profile'}
              {activeTab === 'requests' && 'Service Requests'}
            </h2>
            <p style={styles.locationText}>
              {location ? `📍 Your location: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : 'Locating...'}
            </p>
          </div>

          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;