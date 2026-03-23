import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import RequestCard from '../components/RequestCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MechanicDashboard = () => {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignedRequests = async () => {
      try {
        const { data } = await api.get('/requests/assigned');
        setRequests(data);
        toast.success('Requests loaded successfully');
      } catch (error) {
        setError('Failed to load requests');
        toast.error('Failed to load requests');
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedRequests();
  }, []);

  const updateRequestStatus = async (requestId, status) => {
    try {
      await api.patch(`/requests/${requestId}`, { status });
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status } : req
      ));
      toast.success(`Request status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update request status');
      console.error('Error updating request:', error);
    }
  };

  if (loading) return (
    <div style={styles.loadingContainer}>
      <i className="fas fa-tools fa-spin" style={styles.spinner}></i>
      <p style={styles.loadingText}>Loading your dashboard...</p>
    </div>
  );

  if (error) return (
    <div style={styles.errorContainer}>
      <i className="fas fa-exclamation-triangle" style={styles.errorIcon}></i>
      <p style={styles.errorText}>{error}</p>
      <button 
        style={styles.retryButton}
        onClick={() => window.location.reload()}
      >
        <i className="fas fa-sync-alt" style={styles.buttonIcon}></i>
        Try Again
      </button>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Mechanic Dashboard</h1>
          <p style={styles.welcomeText}>
            Welcome back, <span style={styles.userName}>{user?.name}</span>
          </p>
        </div>
        <button style={styles.logoutButton} onClick={logout}>
          <i className="fas fa-sign-out-alt" style={styles.buttonIcon}></i>
          Logout
        </button>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <i className="fas fa-clipboard-list" style={styles.sectionIcon}></i>
          <h2 style={styles.sectionTitle}>Your Assigned Requests</h2>
        </div>
        
        {requests.length === 0 ? (
          <div style={styles.emptyState}>
            <i className="fas fa-inbox" style={styles.emptyIcon}></i>
            <p style={styles.emptyText}>No requests assigned to you yet</p>
            <p style={styles.emptySubtext}>New requests will appear here when assigned</p>
          </div>
        ) : (
          <div style={styles.requestsGrid}>
            {requests.map(request => (
              <RequestCard 
                key={request.id}
                request={request}
                onStatusUpdate={updateRequestStatus}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#0a2463',
    margin: 0,
  },
  welcomeText: {
    fontSize: '16px',
    color: '#666',
    margin: '5px 0 0 0',
  },
  userName: {
    fontWeight: '600',
    color: '#0a2463',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    color: '#0a2463',
    border: '1px solid #0a2463',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
  },
  buttonIcon: {
    fontSize: '14px',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    padding: '30px',
    marginBottom: '30px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '30px',
  },
  sectionIcon: {
    fontSize: '24px',
    color: '#0a2463',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#0a2463',
    margin: 0,
  },
  requestsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '48px',
    color: '#0a2463',
    marginBottom: '20px',
    opacity: '0.5',
  },
  emptyText: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#0a2463',
    marginBottom: '10px',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
  },
  spinner: {
    fontSize: '48px',
    color: '#0a2463',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '18px',
    color: '#0a2463',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    backgroundColor: '#FFF5F5',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '500px',
    margin: '40px auto',
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: '48px',
    color: '#E53E3E',
    marginBottom: '20px',
  },
  errorText: {
    fontSize: '18px',
    color: '#E53E3E',
    marginBottom: '20px',
  },
  retryButton: {
    backgroundColor: '#0a2463',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s ease',
  },
};

export default MechanicDashboard;