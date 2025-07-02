import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Chat from '../components/Chat';
import PetrolFinder from '../components/PetrolFinder';
import MechanicsNearby from '../components/MechanicsNearby';
import Navbar from '../components/Navbar';
import { 
  FiAlertTriangle, FiMapPin, FiTool, FiMessageSquare, 
  FiUser, FiClock, FiZap, FiStar, FiEdit, FiPhone,
  FiMail, FiDollarSign, FiCheckCircle, FiLogOut, FiSettings
} from 'react-icons/fi';

// Validation schemas
const emergencySchema = Yup.object().shape({
  message: Yup.string().required('Message is required')
});

const reviewSchema = Yup.object().shape({
  comment: Yup.string().required('Comment is required'),
  rating: Yup.number().min(1).max(5).required('Rating is required')
});

const profileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required')
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const navigate = useNavigate();

  // Get user location and initial data
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
      setLoading(true);
      setError(null);
      
      // Fetch user profile
      const userRes = await fetch(`/api/users/${user.id}`, {
        headers: { 'Authorization': localStorage.getItem('token') }
      });
      if (!userRes.ok) throw new Error('Failed to fetch user data');
      const userData = await userRes.json();
      setUser(userData);

      // Fetch emergencies
      const emergenciesRes = await fetch('/api/emergencies', {
        headers: { 'Authorization': localStorage.getItem('token') }
      });
      if (!emergenciesRes.ok) throw new Error('Failed to fetch emergencies');
      const emergenciesData = await emergenciesRes.json();
      setEmergencies(emergenciesData);

      // Fetch nearby mechanics
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
      if (!mechanicsRes.ok) throw new Error('Failed to fetch mechanics');
      const mechanicsData = await mechanicsRes.json();
      setMechanics(mechanicsData.nearby_mechanics);

      // Fetch reviews
      const reviewsRes = await fetch(`/api/reviews?mechanic_id=${user.id}`, {
        headers: { 'Authorization': localStorage.getItem('token') }
      });
      if (!reviewsRes.ok) throw new Error('Failed to fetch reviews');
      const reviewsData = await reviewsRes.json();
      setReviews(reviewsData);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle emergency alert
  const handleEmergencySubmit = async (values, { setSubmitting, resetForm }) => {
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send request');
      }

      const newEmergency = await response.json();
      setEmergencies([newEmergency, ...emergencies]);
      setStatus('Help is on the way! ✅');
      resetForm();
    } catch (error) {
      setError(error.message);
      setStatus('Failed to send request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle emergency status update
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
      setError(error.message);
    }
  };

  // Handle review submission
  const handleReviewSubmit = async (values, { resetForm }) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          rating: values.rating,
          comment: values.comment,
          mechanic_id: user.id
        })
      });

      if (!response.ok) throw new Error('Failed to submit review');

      const newReview = await response.json();
      setReviews([newReview, ...reviews]);
      resetForm();
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedUser = await response.json();
      setUser(updatedUser);
      setEditProfile(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Haversine distance calculation
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Render loading state
  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  // Render error state
  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h3>Error loading data</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // ... [rest of your component code remains the same, 
  // just update the profile section to include the edit form]

  const renderProfileSection = () => (
    <div style={styles.profileContainer}>
      {/* Profile Info Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <FiUser size={24} style={styles.icon} />
          <h3 style={styles.cardTitle}>{user?.role === 'mechanic' ? 'Mechanic Profile' : 'User Profile'}</h3>
          <button 
            onClick={() => setEditProfile(!editProfile)}
            style={styles.editButton}
          >
            <FiSettings size={18} />
          </button>
        </div>
        
        {editProfile ? (
          <Formik
            initialValues={{
              name: user?.name || '',
              email: user?.email || '',
              // Add other editable fields as needed
            }}
            validationSchema={profileSchema}
            onSubmit={handleProfileUpdate}
          >
            {({ isSubmitting }) => (
              <Form>
                <div style={styles.formGroup}>
                  <label>Name:</label>
                  <Field type="text" name="name" style={styles.input} />
                  <ErrorMessage name="name" component="div" style={styles.errorText} />
                </div>
                
                <div style={styles.formGroup}>
                  <label>Email:</label>
                  <Field type="email" name="email" style={styles.input} />
                  <ErrorMessage name="email" component="div" style={styles.errorText} />
                </div>
                
                <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setEditProfile(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </Form>
            )}
          </Formik>
        ) : (
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
        )}
      </div>

      {/* Reviews Card */}
      <div style={styles.card}>
        {/* ... [rest of your reviews section code] ... */}
      </div>
    </div>
  );

  // ... [rest of your existing component code]

  return (
    <div style={styles.container}>
      {/* ... [rest of your JSX remains the same] ... */}
    </div>
  );
};

// Add these new styles to your existing styles object
const styles = {
  // ... your existing styles ...
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.5rem'
  },
  errorContainer: {
    padding: '2rem',
    textAlign: 'center',
    color: '#ef4444'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  errorText: {
    color: '#ef4444',
    fontSize: '0.8rem',
    marginTop: '0.25rem'
  },
  editButton: {
    background: 'none',
    border: 'none',
    color: '#fcd34d',
    cursor: 'pointer',
    marginLeft: 'auto'
  },
  cancelButton: {
    background: '#64748b',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    marginLeft: '1rem',
    cursor: 'pointer'
  }
};

export default EmergencyPage;