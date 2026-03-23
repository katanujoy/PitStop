import { Link } from 'react-router-dom';

const MechanicCard = ({ mechanic }) => {
  return (
    <div className="mechanic-card">
      <div className="card-header">
        <h3>{mechanic.user.name}</h3>
        {mechanic.rating && (
          <div className="rating-badge">
            ⭐ {mechanic.rating.toFixed(1)}
          </div>
        )}
      </div>
      
      <div className="card-details">
        <div className="detail-item">
          <span className="detail-label">Specialty:</span>
          <span className="detail-value">{mechanic.specialty}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Experience:</span>
          <span className="detail-value">{mechanic.years_of_experience} years</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Rate:</span>
          <span className="detail-value">${mechanic.hourly_rate}/hour</span>
        </div>
      </div>
      
      <div className="card-footer">
        <Link 
          to={`/request/${mechanic.id}`} 
          className="request-button"
        >
          Request Service
        </Link>
      </div>

      <style jsx>{`
        .mechanic-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          padding: 20px;
          max-width: 320px;
        }
        
        .mechanic-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .card-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #2d3748;
        }
        
        .rating-badge {
          background: #4a6fa5;
          color: white;
          padding: 4px 8px;
          border-radius: 16px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .card-details {
          margin-bottom: 20px;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .detail-label {
          font-weight: 600;
          color: #4a5568;
        }
        
        .detail-value {
          color: #2d3748;
        }
        
        .request-button {
          display: block;
          text-align: center;
          background: #4a6fa5;
          color: white;
          padding: 10px 16px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .request-button:hover {
          background: #3a5a80;
        }
      `}</style>
    </div>
  );
};

export default MechanicCard;