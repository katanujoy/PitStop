from flask import Flask
from models import db, init_db  # assuming init_db is defined in models.py

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  # or PostgreSQL/MySQL URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    init_db(app)

    # Register blueprints here if any
    # from routes import main as main_blueprint
    # app.register_blueprint(main_blueprint)

    return app

# Run app
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
