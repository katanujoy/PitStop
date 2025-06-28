from flask import Blueprint, request, jsonify
from models import db, EmergencyRequest

emergency_bp = Blueprint('emergency', __name__)

@emergency_bp.route('/report', methods=['POST'])
def report_emergency():
    data = request.json
    request_entry = EmergencyRequest(
        user_id=data['user_id'],
        message=data['message'],
        latitude=data.get('latitude'),
        longitude=data.get('longitude')
    )
    db.session.add(request_entry)
    db.session.commit()
    return jsonify({'message': 'Emergency reported'})

@emergency_bp.route('/history/<int:user_id>', methods=['GET'])
def get_history(user_id):
    requests = EmergencyRequest.query.filter_by(user_id=user_id).order_by(EmergencyRequest.timestamp.desc()).all()
    return jsonify([
        {
            'message': r.message,
            'timestamp': r.timestamp.strftime('%Y-%m-%d %H:%M'),
            'lat': r.latitude,
            'lng': r.longitude
        }
        for r in requests
    ])

