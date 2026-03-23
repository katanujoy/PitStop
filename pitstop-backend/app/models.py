from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

# ------------------------------
# User Model
# ------------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)  # Plain text for dev/testing only
    role = Column(String, nullable=False)  # "driver" or "mechanic"

    # Relationships
    mechanic_profile = relationship("MechanicProfile", back_populates="user", uselist=False)
    sent_messages = relationship("ChatMessage", foreign_keys="ChatMessage.sender_id", back_populates="sender")
    received_messages = relationship("ChatMessage", foreign_keys="ChatMessage.receiver_id", back_populates="receiver")

# ------------------------------
# Mechanic Profile Model
# ------------------------------
class MechanicProfile(Base):
    __tablename__ = "mechanic_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    services = Column(String, nullable=False)
    rates = Column(Float, nullable=False)
    is_available = Column(Boolean, default=True)

    # Relationship
    user = relationship("User", back_populates="mechanic_profile")

# ------------------------------
# Request Model
# ------------------------------
class Request(Base):
    __tablename__ = "requests"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mechanic_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String, default="pending", nullable=False)  # pending, accepted, completed
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    # Relationship
    messages = relationship("ChatMessage", back_populates="request")

# ------------------------------
# Chat Message Model
# ------------------------------
class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    request_id = Column(Integer, ForeignKey("requests.id"), nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")
    request = relationship("Request", back_populates="messages")
