from flask import Flask, request, jsonify, make_response
from config import Config
from extensions import db, migrate, bcrypt
from flask_jwt_extended import (
    create_access_token, create_refresh_token)
from datetime import timedelta

def create_app():
    app=Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    

    from models import Clinician, Patient, Referral, Session, AuditLog

    



    @app.route('/login', methods=['POST'])
    def clinician_login():
        data=request.get_json()

        #error handler
        if not data or"email" not in data or "password" not in data:
            return jsonify({"error": "please input Email and password!!"})
        
        #get info from clients side
        email= data['email'].strip().lower()
        password = data['password']

        #Query the useer from the db to check if they exist

        clinicians = Clinician.query.filter_by(email=email).first()
        if not clinicians:
            return jsonify({'error': "Clinician doesn't exist!"}), 401
        
        # validate password
        if not bcrypt.check_password(clinicians.password_hash, password):
            return jsonify({'error': 'Invalid Password'}), 401
        
        # generate access tokens
        access_token = create_access_token(
            identity={"clinician_id": clinicians.id, "email": clinicians.email},
            expires_delta=timedelta(days=7)
        )
        refresh_token = create_refresh_token(identity={"clinician_id": clinicians.id, "email": clinicians.email})

        return jsonify({
            'message': 'Login is successful',
            "access_token": access_token,
            "refresh_token": refresh_token,
            "clinician": {
                "id": clinicians.id,
                "email": clinicians.email
            }
        }), 200
    

    

    return app

if __name__ == "__main__":
    app=create_app()
    app.run(debug=True)
