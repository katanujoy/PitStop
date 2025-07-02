import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Chat from '../components/Chat';
import PetrolFinder from '../components/PetrolFinder';
import MechanicsNearby from '../components/MechanicsNearby';
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
  FiCheckCircle,
  FiLogOut
} from 'react-icons/fi';

const emergencySchema = Yup.object().shape({
  message: Yup.string().required('Message is required')
});

const reviewSchema = Yup.object().shape({
  comment: Yup.string().required('Comment is required'),
  rating: Yup.number().min(1).max(5).required('Rating is required')
});

const EmergencyPage = ({ user, setUser }) => {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('Ready');
  const [emergencies, setEmergencies] = useState([]);
  const [assistantReply, setAssistantReply] = useState('');
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('emergency');
  const [mechanics, setMechanics] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(userLocation);
        fetchInitialData(userLocation);
      },
      (err) => {
        console.error('Location error:', err.message);
        const defaultLocation = { lat: -1.286389, lng: 36.817223 };
        setLocation(defaultLocation);
        fetchInitialData(defaultLocation);
      }
    );
  }, []);

  const fetchInitialData = async (loc) => {
    try {
      const emergenciesRes = await fetch('/api/emergencies', {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      const emergenciesData = await emergenciesRes.json();
      setEmergencies(emergenciesData);

      const mechanicsRes = await fetch('/api/mechanics/nearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          lat: loc.lat,
          lng: loc.lng,
          radius: 10
        })
      });
      const mechanicsData = await mechanicsRes.json();
      setMechanics(mechanicsData.nearby_mechanics);

    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const handleEmergencySubmit = async (values, { setSubmitting }) => {
    if (!location) {
      alert('Location not available. Please enable location and try again.');
      return;
    }

    setStatus('Sending Request...');
    setSubmitting(true);

    try {
      const response = await fetch('/api/emergencies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          message: values.message,
          lat: location.lat,
          lng: location.lng
        })
      });

      if (!response.ok) throw new Error('Failed to send request');

      const newEmergency = await response.json();
      setEmergencies([newEmergency, ...emergencies]);
      setStatus('Help is on the way! ✅');
    } catch (error) {
      console.error('Emergency request error:', error);
      setStatus('Failed to send request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateEmergencyStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/emergencies/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      const updatedEmergency = await response.json();
      setEmergencies(emergencies.map(e => 
        e.id === updatedEmergency.id ? updatedEmergency : e
      ));
    } catch (error) {
      console.error('Update status error:', error);
    }
  };

  const askAssistant = async (question) => {
    if (!question) return;

    setIsAssistantLoading(true);
    setAssistantReply('Thinking...');
    
    try {
      setTimeout(() => {
        const responses = [
          "For a dead battery, try jump-starting your car using jumper cables and another vehicle.",
          "If your engine is overheating, turn off the AC and turn on the heater to draw heat away.",
          "For a flat tire, find a safe location to pull over and use your spare tire.",
          "If your car won't start, check if your battery terminals are clean and connected properly.",
          "For a check engine light, try tightening your gas cap first.",
          "If you smell gasoline, pull over immediately and turn off the engine."
        ];
        setAssistantReply(responses[Math.floor(Math.random() * responses.length)]);
        setIsAssistantLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Assistant error:', error);
      setAssistantReply('❌ Error contacting assistant. Please try again.');
      setIsAssistantLoading(false);
    }
  };

  const handleReviewSubmit = async (values, { resetForm }) => {
    try {
      const review = {
        id: Date.now(),
        name: user?.name || 'Anonymous',
        rating: values.rating,
        comment: values.comment,
        date: new Date().toISOString().split('T')[0]
      };

      setReviews([review, ...reviews]);
      resetForm();
    } catch (error) {
      console.error('Review submission error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const renderProfileSection = () => (
    <div style={styles.profileContainer}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <FiUser size={24} style={styles.icon} />
          <h3 style={styles.cardTitle}>{user?.role === 'mechanic' ? 'Mechanic Profile' : 'User Profile'}</h3>
        </div>
        
        <div style={styles.profileInfo}>
          <div style={styles.avatarLarge}>{user?.name?.charAt(0) || 'M'}</div>
          <div style={styles.profileDetails}>
            <h4 style={styles.profileName}>{user?.name || 'User Name'}</h4>
            <p style={styles.profileText}><FiMail style={styles.profileIcon} /> {user?.email || 'user@example.com'}</p>
            <p style={styles.profileText}><FiUser style={styles.profileIcon} /> {user?.role || 'Role not specified'}</p>
            
            {user?.role === 'mechanic' && (
              <>
                <p style={styles.profileText}><FiTool style={styles.profileIcon} /> Tire Change, Battery Jumpstart, Engine Diagnostics</p>
                <p style={styles.profileText}><FiDollarSign style={styles.profileIcon} /> KES 1,500 - 3,000 per service</p>
                <p style={styles.profileText}><FiCheckCircle style={styles.profileIcon} /> <span style={styles.available}>Available</span></p>
              </>
            )}
          </div>
        </div>
      </div>

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

        <Formik
          initialValues={{ rating: 5, comment: '' }}
          validationSchema={reviewSchema}
          onSubmit={handleReviewSubmit}
        >
          {({ isSubmitting }) => (
            <Form style={styles.reviewForm}>
              <h4 style={styles.sectionTitle}>Add Your Review</h4>
              <div style={styles.ratingInput}>
                <label>Rating:</label>
                <Field as="select" name="rating" style={styles.selectInput}>
                  {[5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>{num} ★</option>
                  ))}
                </Field>
                <ErrorMessage name="rating" component="div" style={styles.error} />
              </div>
              <Field 
                as="textarea"
                name="comment"
                placeholder="Share your experience..."
                style={styles.textareaInput}
                rows={4}
              />
              <ErrorMessage name="comment" component="div" style={styles.error} />
              <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
                <FiEdit style={{ marginRight: '8px' }} />
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </Form>
          )}
        </Formik>

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
            
            <Formik
              initialValues={{ message: '' }}
              validationSchema={emergencySchema}
              onSubmit={handleEmergencySubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field 
                    as="textarea"
                    name="message"
                    placeholder="Describe your emergency..."
                    style={styles.textareaInput}
                    rows={3}
                  />
                  <ErrorMessage name="message" component="div" style={styles.error} />
                  <button 
                    type="submit" 
                    style={styles.emergencyButton}
                    disabled={isSubmitting}
                  >
                    <FiZap style={{ marginRight: '8px' }} />
                    {isSubmitting ? 'Sending...' : 'Send Emergency Alert 🚨'}
                  </button>
                </Form>
              )}
            </Formik>
            
            <p style={{ marginTop: '1rem', color: status.includes('✅') ? '#4ade80' : '#f59e0b' }}>{status}</p>
            
            <div style={{ marginTop: '2rem' }}>
              <h4 style={styles.sectionTitle}>Recent Requests</h4>
              <div style={styles.historyList}>
                {emergencies.map((emergency) => (
                  <div key={emergency.id} style={styles.historyItem}>
                    <div style={styles.historyTime}>{new Date(emergency.created_at).toLocaleString()}</div>
                    <div>{emergency.message}</div>
                    <div>Status: {emergency.status}</div>
                    {user?.role === 'mechanic' && emergency.status === 'pending' && (
                      <button 
                        onClick={() => updateEmergencyStatus(emergency.id, 'accepted')}
                        style={styles.acceptButton}
                      >
                        Accept Request
                      </button>
                    )}
                  </div>
                ))}
                {emergencies.length === 0 && (
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
            <MechanicsNearby mechanics={mechanics} location={location} />
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
                onChange={(e) => setQuestion(e.target.value)}
                style={styles.input}
                placeholder="Ask about car problems..."
                onKeyPress={(e) => e.key === 'Enter' && askAssistant(question)}
              />
              <button 
                onClick={() => askAssistant(question)} 
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
              {emergencies.filter(e => e.status === 'pending').map((emergency) => (
                <div key={emergency.id} style={styles.requestItem}>
                  <div style={styles.requestHeader}>
                    <span style={styles.requestName}>{emergency.user?.name || 'User'}</span>
                    <span style={styles.requestDistance}>
                      {location && emergency.lat && emergency.lng 
                        ? `${haversineDistance(
                            location.lat,
                            location.lng,
                            emergency.lat,
                            emergency.lng
                          ).toFixed(1)} km away`
                        : 'Distance unknown'}
                    </span>
                  </div>
                  <div style={styles.requestMessage}>{emergency.message}</div>
                  <div style={styles.requestTime}>{new Date(emergency.created_at).toLocaleString()}</div>
                  <button 
                    style={styles.acceptButton}
                    onClick={() => updateEmergencyStatus(emergency.id, 'accepted')}
                  >
                    Accept Request
                  </button>
                </div>
              ))}
              {emergencies.filter(e => e.status === 'pending').length === 0 && (
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No pending requests</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#ffffff',
    },
    mainLayout: {
      display: 'flex',
      flex: 1,
    },
    sidebar: {
      width: '250px',
      backgroundColor: '#1e293b',
      padding: '1rem',
      borderRight: '1px solid #334155',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '1rem',
      fontWeight: 'bold',
    },
    userDetails: {
      display: 'flex',
      flexDirection: 'column',
    },
    userName: {
      fontWeight: 'bold',
    },
    userRole: {
      fontSize: '0.8rem',
      color: '#94a3b8',
    },
    navMenu: {
      display: 'flex',
      flexDirection: 'column',
    },
    navButton: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      marginBottom: '0.5rem',
      borderRadius: '0.5rem',
      backgroundColor: 'transparent',
      color: '#e2e8f0',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.2s',
    },
    activeNavButton: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      marginBottom: '0.5rem',
      borderRadius: '0.5rem',
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
    },
    navIcon: {
      marginRight: '0.75rem',
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
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    locationText: {
      color: '#94a3b8',
    },
    card: {
      backgroundColor: '#1e293b',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
    },
    icon: {
      marginRight: '0.75rem',
      color: '#3b82f6',
    },
    textareaInput: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      backgroundColor: '#334155',
      border: '1px solid #475569',
      color: '#ffffff',
      marginBottom: '1rem',
      resize: 'vertical',
    },
    error: {
      color: '#ef4444',
      fontSize: '0.875rem',
      marginBottom: '1rem',
    },
    emergencyButton: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      transition: 'all 0.2s',
    },
    historyList: {
      marginTop: '1rem',
    },
    historyItem: {
      backgroundColor: '#334155',
      padding: '1rem',
      borderRadius: '0.375rem',
      marginBottom: '0.75rem',
    },
    historyTime: {
      color: '#94a3b8',
      fontSize: '0.875rem',
      marginBottom: '0.25rem',
    },
    acceptButton: {
      backgroundColor: '#10b981',
      color: '#ffffff',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      marginTop: '0.5rem',
    },
    sectionTitle: {
      fontSize: '1rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
    },
    replyBox: {
      backgroundColor: '#334155',
      borderRadius: '0.5rem',
      padding: '1rem',
    },
    replyHeader: {
      marginBottom: '0.75rem',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      backgroundColor: '#475569',
      border: '1px solid #64748b',
      color: '#ffffff',
      marginBottom: '1rem',
    },
    submitButton: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
    },
    replyContent: {
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: '#475569',
      borderRadius: '0.375rem',
    },
    profileContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '1.5rem',
    },
    profileInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
    },
    avatarLarge: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    profileDetails: {
      flex: 1,
    },
    profileName: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    profileText: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.5rem',
      color: '#cbd5e1',
    },
    profileIcon: {
      color: '#3b82f6',
    },
    available: {
      color: '#10b981',
    },
    ratingSummary: {
      marginBottom: '1.5rem',
    },
    averageRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    ratingNumber: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    stars: {
      display: 'flex',
      gap: '0.25rem',
    },
    ratingCount: {
      color: '#94a3b8',
      fontSize: '0.875rem',
    },
    reviewForm: {
      marginBottom: '2rem',
    },
    ratingInput: {
      marginBottom: '1rem',
    },
    selectInput: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      backgroundColor: '#334155',
      border: '1px solid #475569',
      color: '#ffffff',
      marginTop: '0.5rem',
    },
    reviewsList: {
      marginTop: '1.5rem',
    },
    reviewItem: {
      backgroundColor: '#334155',
      padding: '1rem',
      borderRadius: '0.375rem',
      marginBottom: '1rem',
    },
    reviewHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
    },
    reviewerAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '0.75rem',
      fontWeight: 'bold',
    },
    reviewStars: {
      display: 'flex',
      gap: '0.25rem',
    },
    reviewDate: {
      color: '#94a3b8',
      fontSize: '0.875rem',
    },
    reviewComment: {
      color: '#e2e8f0',
      lineHeight: '1.5',
    },
    requestsList: {
      marginTop: '1rem',
    },
    requestItem: {
      backgroundColor: '#334155',
      padding: '1rem',
      borderRadius: '0.375rem',
      marginBottom: '0.75rem',
    },
    requestHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
    },
    requestName: {
      fontWeight: 'bold',
    },
    requestDistance: {
      color: '#94a3b8',
      fontSize: '0.875rem',
    },
    requestMessage: {
      marginBottom: '0.5rem',
    },
    requestTime: {
      color: '#94a3b8',
      fontSize: '0.875rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainLayout}>
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