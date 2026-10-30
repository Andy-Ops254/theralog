from flask import Flask
from flask_cors import CORS

from .config import app as config_app
from .extensions import db, migrate, bcrypt, jwt


def create_app():
    """
    Application factory function.
    Creates and configures the Flask application.
    """
    app = Flask(__name__)
    app.config.from_mapping(config_app.config)
    
    # Enable CORS for client-side requests during development
    CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5173", "http://localhost:5173", "http://localhost:3000"]}}, supports_credentials=True)

    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    # Register blueprints
    from .routes import api
    app.register_blueprint(api)
    
    return app


app = create_app()
    