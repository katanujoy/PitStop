from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from math import radians, sin, cos, sqrt, atan2

# App setup
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # More specific CORS configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pitstop.db'
app.config['SECRET_KEY'] = 'your-secret-key-here-make-it-strong'  # Changed to stronger key
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # To suppress warning
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Models (unchanged but included for completeness)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)  # Increased length for hashed passwords
    role = db.Column(db.String(20), nullable=False)

    mechanic_profile = db.relationship('Mechanic', backref='user', uselist=False)
    emergency_requests = db.relationship('EmergencyRequest', backref='user', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role
        }

# Improved token_required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'message': 'Authorization header is missing!'}), 401
            
        try:
            token = auth_header.split(" ")[1]  # Bearer <token>
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
        except Exception as e:
            return jsonify({'message': 'Token verification failed!', 'error': str(e)}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

# Improved login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ('email', 'password')):
            return jsonify({'error': 'Missing email or password'}), 400

        user = User.query.filter_by(email=data['email']).first()
        
        if not user:
            return jsonify({'error': 'Email not found'}), 401
            
        if not check_password_hash(user.password, data['password']):
            return jsonify({'error': 'Invalid password'}), 401

        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            'token': token,
            'user': user.serialize()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
# Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not all(k in data for k in ('name', 'email', 'password', 'role')):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400

    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        role=data['role']
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not all(k in data for k in ('email', 'password')):
        return jsonify({'error': 'Missing email or password'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({
        'token': token,
        'user': user.serialize()
    }), 200

@app.route('/api/emergencies', methods=['GET', 'POST'])
@token_required
def emergencies(current_user):
    if request.method == 'GET':
        emergencies = EmergencyRequest.query.all()
        return jsonify([e.serialize() for e in emergencies]), 200

    elif request.method == 'POST':
        data = request.get_json()
        if not all(k in data for k in ('message', 'lat', 'lng')):
            return jsonify({'error': 'Missing required fields'}), 400

        new_request = EmergencyRequest(
            user_id=current_user.id,
            message=data['message'],
            lat=data['lat'],
            lng=data['lng']
        )
        db.session.add(new_request)
        db.session.commit()
        return jsonify(new_request.serialize()), 201

@app.route('/api/emergencies/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
@token_required
def emergency(current_user, id):
    emergency = EmergencyRequest.query.get_or_404(id)

    if request.method == 'GET':
        return jsonify(emergency.serialize()), 200

    elif request.method == 'PATCH':
        data = request.get_json()
        emergency.status = data.get('status', emergency.status)
        db.session.commit()
        return jsonify(emergency.serialize()), 200

    elif request.method == 'DELETE':
        db.session.delete(emergency)
        db.session.commit()
        return jsonify({'message': 'Request deleted'}), 200

@app.route('/api/users', methods=['GET'])
@token_required
def get_users(current_user):
    users = User.query.all()
    return jsonify([u.serialize() for u in users]), 200

@app.route('/api/users/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
@token_required
def user(current_user, id):
    user = User.query.get_or_404(id)

    if request.method == 'GET':
        return jsonify(user.serialize()), 200

    elif request.method == 'PATCH':
        data = request.get_json()
        user.name = data.get('name', user.name)
        user.role = data.get('role', user.role)
        db.session.commit()
        return jsonify(user.serialize()), 200

    elif request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted'}), 200

def haversine_distance(lat1, lng1, lat2, lng2):
    R = 6371
    d_lat = radians(lat2 - lat1)
    d_lng = radians(lng2 - lng1)
    a = sin(d_lat / 2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lng / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

@app.route('/api/mechanics/nearby', methods=['POST'])
@token_required
def nearby_mechanics(current_user):
    data = request.get_json()
    lat = data.get('lat')
    lng = data.get('lng')
    radius = float(data.get('radius', 10))

    if lat is None or lng is None:
        return jsonify({'error': 'Latitude and longitude are required'}), 400

    mechanics = Mechanic.query.all()
    nearby = []

    for mech in mechanics:
        distance = haversine_distance(lat, lng, mech.location_lat, mech.location_lng)
        if distance <= radius:
            nearby.append({
                'mechanic': mech.serialize(),
                'distance_km': round(distance, 2)
            })

    return jsonify({'nearby_mechanics': nearby}), 200

# Run
if __name__ == '__main__':
    app.run(debug=True)
