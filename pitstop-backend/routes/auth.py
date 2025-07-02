from flask import Blueprint, request, jsonify
from models import db, User
import jwt
from datetime import datetime, timedelta
from flask import current_app

auth_bp = Blueprint('auth', __name__)

def generate_token(user):
    payload = {
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    required_fields = ['name', 'email', 'role']
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({'error': 'All fields are required'}), 400

    if data['role'] not in ['driver', 'mechanic']:
        return jsonify({'error': 'Invalid role'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400

    user = User(
        name=data['name'],
        email=data['email'],
        role=data['role']
    )

    db.session.add(user)
    db.session.commit()

    token = generate_token(user)

    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data.get('email'):
        return jsonify({'error': 'Email is required'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    token = generate_token(user)

    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }
    }), 200