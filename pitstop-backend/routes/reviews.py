from flask import Blueprint, request, jsonify
from models import db, Review

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/', methods=['GET'])
def list_reviews():
    reviews = Review.query.order_by(Review.timestamp.desc()).all()
    return jsonify([
        {
            'user_id': r.user_id,
            'rating': r.rating,
            'comment': r.comment,
            'timestamp': r.timestamp.strftime('%Y-%m-%d %H:%M')
        } for r in reviews
    ])

@reviews_bp.route('/submit', methods=['POST'])
def submit_review():
    data = request.json
    review = Review(
        user_id=data['user_id'],
        rating=data['rating'],
        comment=data['comment']
    )
    db.session.add(review)
    db.session.commit()
    return jsonify({'message': 'Review submitted'})

