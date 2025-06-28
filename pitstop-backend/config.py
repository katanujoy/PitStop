import os
class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///pitstop.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'secret123')