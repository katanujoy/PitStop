from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(50), nullable=False)  # 'driver' or 'mechanic'

    # Relationships
    emergencies = db.relationship('EmergencyRequest', backref='user', lazy=True, cascade="all, delete-orphan")
    reviews = db.relationship('Review', backref='user', lazy=True, cascade="all, delete-orphan")
    mechanic_profile = db.relationship('Mechanic', backref='user', lazy=True, uselist=False, cascade="all, delete-orphan")

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role
        }

    def __repr__(self):
        return f"<User {self.email} ({self.role})>"


class EmergencyRequest(db.Model):
    __tablename__ = 'emergency_requests'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'message': self.message,
            'lat': self.lat,
            'lng': self.lng,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'user': self.user.serialize() if self.user else None
        }

    def __repr__(self):
        return f"<EmergencyRequest {self.id} by User {self.user_id}>"


class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    mechanic_id = db.Column(db.Integer, db.ForeignKey('mechanics.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(255))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'mechanic_id': self.mechanic_id,
            'rating': self.rating,
            'comment': self.comment,
            'timestamp': self.timestamp.isoformat(),
            'user': self.user.serialize() if self.user else None,
            'mechanic': self.mechanic.serialize() if self.mechanic else None
        }

    def __repr__(self):
        return f"<Review {self.id} - User {self.user_id} → Mechanic {self.mechanic_id}>"


class Mechanic(db.Model):
    __tablename__ = 'mechanics'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    location_lat = db.Column(db.Float, nullable=False)
    location_lng = db.Column(db.Float, nullable=False)
    is_available = db.Column(db.Boolean, default=True)  # Added availability status

    reviews = db.relationship('Review', backref='mechanic', lazy=True, cascade="all, delete-orphan")

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'location_lat': self.location_lat,
            'location_lng': self.location_lng,
            'is_available': self.is_available,
            'user': self.user.serialize() if self.user else None,
            'average_rating': self.calculate_average_rating()
        }

    def calculate_average_rating(self):
        if not self.reviews:
            return None
        total = sum(review.rating for review in self.reviews)
        return round(total / len(self.reviews), 2)

    def __repr__(self):
        return f"<Mechanic {self.id} for User {self.user_id}>"