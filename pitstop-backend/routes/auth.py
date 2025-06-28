from flask import Blueprint, request, jsonify
from models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    user = User(
        name=data['name'],
        email=data['email'],
        password=data['password'],
        role=data['role']
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'})

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email'], password=data['password']).first()
    if user:
        return jsonify({ 'id': user.id, 'name': user.name, 'email': user.email, 'role': user.role })
    return jsonify({'message': 'Invalid credentials'}), 401

