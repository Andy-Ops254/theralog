from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from .config import Config
from .extensions import db, migrate, bcrypt, jwt


def create_app():
    """
    Application factory function.
    Creates and configures the Flask application.
    """
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS for client-side requests during development
    CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5173", "http://localhost:5173"]}}, supports_credentials=True)

    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    # Register blueprints
    from .routes import api
    app.register_blueprint(api)
    
    return app
    