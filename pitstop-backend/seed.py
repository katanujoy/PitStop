<<<<<<< HEAD
from app import app, db, User

with app.app_context():
    db.create_all()

    if not User.query.filter_by(email="driver@example.com").first():
        driver = User(
            name="Driver One",
            email="driver@example.com", 
            role="driver"
        )
        db.session.add(driver)
        print("Seeded driver user")

    if not User.query.filter_by(email="mechanic@example.com").first():
        mechanic = User(
            name="Mechanic Mike",
            email="mechanic@example.com",
            role="mechanic"
        )
        db.session.add(mechanic)
        print("Seeded mechanic user")

    db.session.commit()
    print("seeded!")
=======
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models
import random
from datetime import datetime, timedelta

# Recreate tables
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

db: Session = SessionLocal()

def create_user(email, password, role):
    return models.User(
        email=email,
        password=password,
        role=role,
    )

def seed_users():
    print("🌱 Seeding users...")

    drivers = []
    mechanics = []

    # Create 10 drivers
    for i in range(1, 11):
        email = f"driver{i}@example.com"
        user = create_user(email, "password123", "driver")
        db.add(user)
        db.flush()
        drivers.append(user)
        print(f"🚗 Driver: {email}")

    # Create 10 mechanics
    for i in range(1, 11):
        email = f"mechanic{i}@example.com"
        user = create_user(email, "password123", "mechanic")
        db.add(user)
        db.flush()

        profile = models.MechanicProfile(
            user_id=user.id,
            services="Oil change, Brake repair",
            rates=round(random.uniform(50, 150), 2),
            is_available=True
        )
        db.add(profile)
        mechanics.append(user)
        print(f"🔧 Mechanic: {email}")

    db.commit()
    return drivers, mechanics

def seed_requests_and_chats(drivers, mechanics):
    print("\n📦 Seeding requests and chat messages...\n")

    for i in range(10):
        driver = random.choice(drivers)
        mechanic = random.choice(mechanics)

        request = models.Request(
            driver_id=driver.id,
            mechanic_id=mechanic.id,
            status=random.choice(["pending", "accepted", "completed"]),
            latitude=round(random.uniform(-1.3, -1.1), 6),
            longitude=round(random.uniform(36.7, 36.9), 6),
        )
        db.add(request)
        db.flush()

        message_templates = [
            ("driver", "Hi, I need help with my car."),
            ("mechanic", "Sure, what seems to be the issue?"),
            ("driver", "The engine makes a weird sound."),
            ("mechanic", "I can take a look at it this afternoon."),
            ("driver", "Perfect. Thanks!"),
        ]

        num_messages = random.randint(3, 5)
        for j in range(num_messages):
            role, content = message_templates[j]
            sender = driver if role == "driver" else mechanic
            receiver = mechanic if role == "driver" else driver

            message = models.ChatMessage(
                sender_id=sender.id,
                receiver_id=receiver.id,
                request_id=request.id,
                content=content,
                created_at=datetime.utcnow() - timedelta(minutes=(5 * (num_messages - j)))
            )
            db.add(message)

        print(f"📨 Request #{i+1} between Driver({driver.email}) & Mechanic({mechanic.email}) with {num_messages} messages")

    db.commit()
    print("\n✅ All requests and chats seeded.\n")

if __name__ == "__main__":
    drivers, mechanics = seed_users()
    seed_requests_and_chats(drivers, mechanics)
>>>>>>> c41985a (fixed up documentation error)
