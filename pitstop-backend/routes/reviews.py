from flask import Blueprint, request, jsonify
from models import db, Review
from datetime import datetime

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/', methods=['GET'])
def list_reviews():
    reviews = Review.query.order_by(Review.timestamp.desc()).all()
    return jsonify([
        {
            'user_id': r.user_id,
            'mechanic_id': r.mechanic_id,
            'rating': r.rating,
            'comment': r.comment,
            'timestamp': r.timestamp.strftime('%Y-%m-%d %H:%M')
        } for r in reviews
    ]), 200


@reviews_bp.route('/submit', methods=['POST'])
def submit_review():
    data = request.get_json()

    # Validate required fields
    if not all(key in data for key in ('user_id', 'mechanic_id', 'rating')):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        review = Review(
            user_id=data['user_id'],
            mechanic_id=data['mechanic_id'],
            rating=data['rating'],
            comment=data.get('comment'),
            timestamp=datetime.utcnow()
        )
        db.session.add(review)
        db.session.commit()

        return jsonify({'message': 'Review submitted successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
