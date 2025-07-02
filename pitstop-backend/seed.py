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
