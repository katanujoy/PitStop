from flask import Blueprint, request, jsonify
from models import db, Emergency
from datetime import datetime

emergency_bp = Blueprint('emergency', __name__)

@emergency_bp.route('/report', methods=['POST'])
def report_emergency():
    data = request.get_json()

    # Validate required fields
    if not all(k in data for k in ('user_id', 'message', 'lat', 'lng')):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        emergency = Emergency(
            user_id=data['user_id'],
            message=data['message'],
            lat=data['lat'],
            lng=data['lng'],
            timestamp=datetime.utcnow()
        )
        db.session.add(emergency)
        db.session.commit()

        return jsonify({'message': 'Emergency reported successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@emergency_bp.route('/history/<int:user_id>', methods=['GET'])
def get_emergency_history(user_id):
    emergencies = Emergency.query.filter_by(user_id=user_id).order_by(Emergency.timestamp.desc()).all()

    history = [{
        'message': e.message,
        'timestamp': e.timestamp.strftime('%Y-%m-%d %H:%M'),
        'lat': e.lat,
        'lng': e.lng
    } for e in emergencies]

    return jsonify(history), 200
