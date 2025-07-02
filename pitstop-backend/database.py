from flask import Flask
from models import db, init_db  

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pitstop.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    init_db(app)


    return app

# Run app
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
