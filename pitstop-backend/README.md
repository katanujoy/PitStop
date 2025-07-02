# Pitstop Backend API
The Pitstop Backend is the API layer of the Pitstop platform, built using Flask, SQLite, and SQLAlchemy. It serves as the core service for managing users, emergency requests, chats, mechanic profiles, and reviews. The backend exposes RESTful endpoints consumed by the frontend.

## Technologies Used
1. Python 3.x

2. Flask

3. Flask-CORS

4. Flask-SQLAlchemy

5. SQLite (for development)

Project Structure

/backend
│
├── app.py               # Main API entry point
├── models.py            # Database models
├── database.db          # SQLite database file
└── requirements.txt     # Python dependencies

Getting Started
1. Clone the Repository

git clone https://github.com/katanujoy/PitStop.git
cd pitstop/backend

2. Set Up a Virtual Environment

python -m venv venv
source venv/bin/activate    
3. Install Dependencies

pip install -r requirements.txt

4. Run the Server

python app.py

The backend will run at:
http://127.0.0.1:5000/


## API Endpoints
Method	Endpoint	Description
GET	/	Test route (health check)
GET	/cars	Retrieve all car records
POST	/cars	Add a new car record
PUT	/cars/<id>	Update an existing car record
DELETE	/cars/<id>	Delete a car record

- Note: More endpoints (e.g., for users, requests, messages, profiles) can be added as the project scales.

- Notes
- This backend is currently configured to use SQLite for development purposes.

- Flask-CORS is enabled to allow requests from the Vite frontend (e.g., on port 5173).

- Be sure to update the database models and endpoints to match the full scope of the Pitstop platform (e.g., roles, chat, geolocation, etc.).
