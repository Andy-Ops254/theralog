from flask import Flask
from flask_jwt_extended import JWTManager

from .config import Config
from .extensions import db, migrate, bcrypt


def create_app():
    """
    Application factory function.
    Creates and configures the Flask application.
    """
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    
    # Initialize JWT
    jwt = JWTManager(app)
    
    # Register blueprints
    from .routes import api
    app.register_blueprint(api)
    
    return app
    