import React, { useState } from 'react';

const Reviews = ({ user }) => {
  const [reviews, setReviews] = useState([
    { id: 1, reviewer: 'Joy', rating: 5, comment: 'Quick and professional!' },
    { id: 2, reviewer: 'Sam', rating: 4, comment: 'Arrived in 20 minutes, helpful.' },
    { id: 3, reviewer: 'Andy', rating: 3, comment: 'Fixed it, but slow to respond.' },
  ]);

  const [newReview, setNewReview] = useState({ rating: '', comment: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newReview.rating && newReview.comment) {
      const next = {
        id: reviews.length + 1,
        reviewer: user.name,
        rating: parseInt(newReview.rating),
        comment: newReview.comment,
      };
      setReviews([next, ...reviews]);
      setNewReview({ rating: '', comment: '' });
    }
  };

  return (
    <div style={{ marginTop: '2rem', textAlign: 'left' }}>
      <h3 style={{ color: '#fcd34d' }}>Mechanic Ratings & Reviews ⭐</h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <label>Rating (1-5):</label><br />
        <input
          type="number"
          value={newReview.rating}
          onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
          min="1"
          max="5"
          required
          style={{ width: '60px', marginBottom: '0.5rem' }}
        /><br />

        <label>Comment:</label><br />
        <textarea
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          rows="2"
          required
          style={{ width: '100%', marginBottom: '0.5rem' }}
        /><br />

        <button type="submit">Submit Review</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {reviews.map((rev) => (
          <li key={rev.id} style={{
            background: '#1f2937',
            padding: '1rem',
            borderRadius: '8px',
            color: '#fff',
            marginBottom: '1rem'
          }}>
            <strong style={{ color: '#fcd34d' }}>{rev.reviewer}</strong> — {rev.rating}★<br />
            <span>{rev.comment}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;
