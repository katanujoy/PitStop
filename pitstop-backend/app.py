from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Initialize app
app = Flask(__name__)
CORS(app)

# Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pitstop.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize DB
db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role
        }

# Ensure tables exist
with app.app_context():
    db.create_all()

# 🔹 Root/Home Route
@app.route('/')
def home():
    return '🚗 Pitstop Backend API is running! 🛠️'

# 🔹 Register User
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    role = data.get('role')

    if not name or not email or not role:
        return jsonify({'error': 'Missing fields'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email already registered'}), 400

    user = User(name=name, email=email, role=role)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

# 🔹 Login User
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    role = data.get('role')

    user = User.query.filter_by(email=email, name=name, role=role).first()
    if user:
        return jsonify(user.to_dict()), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# 🔹 Run server
if __name__ == '__main__':
    app.run(debug=True)
