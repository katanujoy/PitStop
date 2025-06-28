## Pitstop Frontend
The Pitstop Frontend is a modern web application built using Vite and JavaScript. It provides an intuitive user interface that allows drivers to send emergency requests, chat with nearby mechanics, locate nearby petrol stations, and rate services after receiving help.

- This frontend consumes a RESTful API from the Flask-based backend and is optimized for fast performance and a clean developer experience.

## Technologies Used
1. Vite – Lightning-fast frontend build tool

2. JavaScript (Vanilla or with framework, if specified)

3. HTML5, CSS3

4. Google Maps / Places API (for petrol station locator)

## REST API (for backend interaction)

- Project Structure

/pitstop-frontend
│
├── public/               # Static files (index.html, icons, etc.)
├── src/
│   ├── assets/           # Images, icons
│   ├── components/       # UI components (if applicable)
│   ├── styles/           # Global and component-specific CSS
│   ├── script.js         # Main logic and API handling
│   └── main.js           # App entry point
├── index.html            # Main HTML file
├── vite.config.js        # Vite configuration
└── package.json          # Project metadata and scripts
## Features
1. Emergency Assistance Button
2. Drivers can instantly broadcast emergency requests with their geolocation to nearby mechanics.

3. Petrol Station Locator
4. Uses the Google Maps Places API to find the nearest fuel stations based on the user’s current location.

5. Real-Time Chat
Enables live communication between the driver and mechanic for updates and directions.

6. Ratings & Reviews
After receiving assistance, drivers can rate and review the mechanic.

## Getting Started
1. Clone the Repository
git clone https://github.com/yourusername/pitstop-frontend.git
cd pitstop-frontend
2. Install Dependencies

npm install
3. Start the Development Server

npm run dev

Vite will start the app at http://localhost:5173/ (by default).

Ensure your backend Flask API is running (typically at http://127.0.0.1:5000). If needed, update the API base URL in your script.js or config file.

