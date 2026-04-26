from flask import Flask
from config import Config
from extensions import db, migrate

def create_app():
    app=Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    migrate.init_app(app, db)

    from models import Clinician, Patient, Referral, Session, AuditLog

    return app 


def main():
    print("Hello from server!")


if __name__ == "__main__":
    main()
