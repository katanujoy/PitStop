import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routers import users, mechanics, requests, auth
from app.database import engine, Base

# Load environment variables
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(BASE_DIR, "..", ".env")
load_dotenv(dotenv_path)

# Create DB tables
try:
    Base.metadata.create_all(bind=engine)
    print("[✓] Database tables created.")
except Exception as e:
    print("[!] Database setup error:", e)

# Initialize FastAPI app
app = FastAPI(title="Pitstop API")

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5175",
        "http://127.0.0.1:5175"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
try:
    app.include_router(auth.router, prefix="/auth", tags=["Auth"])
    app.include_router(users.router, prefix="/users", tags=["Users"])
    app.include_router(mechanics.router, prefix="/mechanics", tags=["Mechanics"])
    app.include_router(requests.router, prefix="/requests", tags=["Requests"])
    print("[✓] Routers registered.")
except Exception as e:
    print("[!] Router registration failed:", e)

# Root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to Pitstop!"}
