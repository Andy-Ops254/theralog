from flask import Blueprint, request, jsonify, make_response
from datetime import timedelta, datetime
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required, get_jwt # type: ignore
from .extensions import db, bcrypt, jwt
from .models import Clinician, Patient, Session, Referral, TokenBlacklist

#blueprint creation for the routes
api=Blueprint('api', __name__)

#blaclist checker, checks if the access token is the blacklist model
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti=jwt_payload.get("jti")
    #check the database for the jti
    token = TokenBlacklist.query.filter_by(jti=jti).first()
    return token is not None


@api.route('/login', methods=['POST'])
def clinician_login():
    data=request.get_json()
    #error handler
    if not data or"email" not in data or "password" not in data:
        return jsonify({"error": "please input Email and password!!"})
    
    #get info from clients side
    email= data['email'].strip().lower()
    password = data['password']
    name=data.get('name')
    #Query the useer from the db to check if they exist
    clinicians = Clinician.query.filter_by(email=email).first()
    if not clinicians:
        return jsonify({'error': "Clinician doesn't exist!"}), 404
    
    # validate password
    if not bcrypt.check_password_hash(clinicians.password_hash, password):
        return jsonify({'error': 'Invalid Password'}), 404
    
    # generate access tokens
    access_token = create_access_token(
        identity={"clinician_id": clinicians.id, "email": clinicians.email},
        expires_delta=timedelta(days=7), 
        additional_claims ={"name": clinicians.name}
    )
    refresh_token = create_refresh_token(identity={"clinician_id": clinicians.id, "email": clinicians.email})
    return jsonify({
        'message': 'Login is successful',
        "access_token": access_token,
        "refresh_token": refresh_token,
        "clinician": {
            "id": clinicians.id,
            "email": clinicians.email,
            "name":clinicians.name
        }
    }), 200
    

@api.route('/clinician/profile', methods=['GET', 'PATCH'])
@jwt_required()
def clinician_profile():
    identity = get_jwt_identity()
    clinician_id = identity.get('clinician_id') if isinstance(identity, dict) else None
    if clinician_id is None:
        return jsonify({"error": "Clinician identity not found in token"}), 400

    clinician = Clinician.query.filter_by(id=clinician_id).first()
    if not clinician:
        return jsonify({"error": "Clinician not found"}), 404

    if request.method == 'PATCH':
        data = request.get_json()
        if not data:
            return jsonify({"error": "No profile changes were provided"}), 400

        name = data.get('name', clinician.name)
        email = data.get('email', clinician.email)
        if not isinstance(name, str) or not name.strip():
            return jsonify({"error": "Name is required"}), 400
        if not isinstance(email, str) or '@' not in email.strip():
            return jsonify({"error": "A valid email is required"}), 400

        email = email.strip().lower()
        existing_clinician = Clinician.query.filter(
            Clinician.email == email,
            Clinician.id != clinician.id
        ).first()
        if existing_clinician:
            return jsonify({"error": "Email is already in use"}), 409

        clinician.name = name.strip()
        clinician.email = email
        db.session.commit()

    return jsonify({
        "id": clinician.id,
        "name": clinician.name,
        "email": clinician.email,
        "role": clinician.role,
        "is_active": clinician.is_active,
        "created_at": clinician.created_at.isoformat() if clinician.created_at else None,
    }), 200


@api.route('/logout', methods=['DELETE'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"] #gets the token id
    #save the token to the DB
    blacklisted_token = TokenBlacklist(jti=jti)
    db.session.add(blacklisted_token)
    db.session.commit()
    return jsonify({"message": "Successfully logged out"}), 200

@api.route("/register", methods=['POST'])
def register_clinician():
    data = request.get_json()
    if not data or "email" not in data or "password" not in data:
        return jsonify({"error": "Password and Email required!!"}), 400
    name = data.get("name")
    email = data["email"].strip().lower()
    raw_password = data["password"]
    role = data.get('role')
    is_active = data.get('is_active')
    clinician = Clinician.query.filter_by(email=email).first()
    if clinician:
        return jsonify({"error": "Clinician already exists!"}), 409
    new_clinician = Clinician(
        email=email,
        password=raw_password,
        name=name,
        role=role,
        is_active=is_active
    )
    db.session.add(new_clinician)
    db.session.commit()
    Clinician_dict = new_clinician.to_dict(only=("id", "email", "name", "role", "is_active"))
    return make_response(Clinician_dict, 201)

#refresh token
@api.route('/token/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    identity = get_jwt_identity()
    new_access = create_access_token(identity=identity, expires_delta=timedelta(hours=24))
    return jsonify({"access_token": new_access}), 200

    
@api.route("/new_patient", methods=['POST'])
@jwt_required()
def new_patient():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Please fill in the required fields!!"}), 400
    
    identity = get_jwt_identity()
    if not isinstance(identity, dict):
        return jsonify({"error": "Clinician identity not found in token"}), 400

    clinician_id = identity.get("clinician_id")
    if not clinician_id:
        return jsonify({"error": "Clinician identity not found in token"}), 400

    id = data.get("id")
    full_name = data.get('full_name') or data.get('name')
    date_of_birth = data.get('date_of_birth')
    sex = data.get('sex')
    condition = data.get('condition')
    status = data.get("status")
    date_of_admission = data.get("date_of_admission")

    if not full_name:
        return jsonify({"error": "Full name is required"}), 400

    patient = Patient.query.filter_by(id=id).first()
    if patient:
        return jsonify ({"error":"Patient already exists!"}), 409
    
    else:
        new_patient = Patient(
            id=id,
            full_name=full_name,
            date_of_birth = date_of_birth,
            sex = sex,
            condition = condition,
            clinician_id = clinician_id,
            status = status,
            date_of_admission = date_of_admission
        )
        db.session.add(new_patient)
        db.session.commit()
        patient_dict = new_patient.to_dict(only=(
            "id", "full_name", "sex", "date_of_birth", 
            "condition", "clinician_id", "status", 
            "date_of_admission", "created_at"))
        
        return make_response(patient_dict, 201)

# i want to query patients based on the clinician they have
@api.route("/patients", methods=['GET'])
@jwt_required()
def read_patients():

    identity=get_jwt_identity()
    Clinician_id = identity.get('clinician_id')
    
    #database querying 
    patients = Patient.query.filter(
        Patient.clinician_id==Clinician_id
    ).all()

    response = [
    {
        "id": patient.id,
        "full_name" : patient.full_name,
        "date_of_birth": patient.date_of_birth,
        "sex": patient.sex,
        "condition": patient.condition,
        "status": patient.status,
        "date_of_admission": patient.date_of_admission.isoformat(),
        "created_at": patient.created_at.isoformat()
    }
    
    #loop through each patient
    for patient in patients
    ]
    return jsonify ({
        "Total patients": len(patients),
        "patients": response
    }), 200

@api.route('/patient/<int:id>', methods=['GET', 'PATCH'])

def get_patient(id):
    if request.method == 'OPTIONS':
        return '', 200
    return _get_patient_protected(id)
@jwt_required()
def _get_patient_protected(id):
    if request.method == 'GET':
        #get the full name from the client side
        # full_name = request.args.get("full_name")

        # if not full_name:
        #     return jsonify({"error": "full_name input is required!"}), 200
        #db query
        patient = Patient.query.filter_by(id=id).first()

        if not patient:
            return jsonify({"error": "Patient is not found!"}), 404

        response = {
            "patient_id":patient.id,
            "full_name" : patient.full_name,
            "date_of_birth":patient.date_of_birth.isoformat(),
            "sex": patient.sex,
            "condition": patient.condition,
            "status": patient.status,
            "date_of_admission": patient.date_of_admission.isoformat(),
            "created_at": patient.created_at.isoformat()
        }

        return jsonify (response), 200

    elif request.method == 'PATCH':
        #querying the client
        patient = Patient.query.filter_by(id=id).first()

        if not patient:
            return jsonify({"error": "Patient not found!"}), 404
        
        #get the data from the client
        data = request.get_json()
        if not data:
            return jsonify({"error":"No data provided"}), 400
        
        #define allowed fields
        allowed_fields = ['full_name', 'date_of_birth', 'sex', 'condition', 'status', 'date_of_admission']

        #loop through and update the allowed fields

        for field in allowed_fields:
            if field in data:
                setattr(patient, field, data[field])

        db.session.commit()

        return jsonify({'message': 'Patient has successfully been updated'}), 200
    

@api.route('/patient/<int:id>/sessions', methods=['GET'])
@jwt_required()
def patients_sessions(id):
    #patient query
    patient = Patient.query.filter_by(id=id).first()

    if not patient:
        return jsonify({"error": "Patient not found!"}), 404
    
    #if patient is found we query the sessions
    sessions=Session.query.filter_by(patient_id=id).all()

    response = [
        {
        "id":session.id,
        "patient_id":session.patient_id,
        "clinician_id":session.clinician_id,
        "session_date":session.session_date.isoformat() if session.session_date else None,
        "notes": session.notes,
        "duration":session.duration,
        "session_type":session.session_type,
        "status": session.status,
        "created_at":session.created_at.isoformat() if session.created_at else None
    }
        for session in sessions
    ]

    return jsonify({
        "patient's name":patient.full_name,
        "total_sessions": len(sessions),
        "sessions": response
    }),200

@api.route('/sessions', methods=['GET'])
@jwt_required()
def get_sessions():
    sessions= Session.query.all()
    if not sessions:
        return jsonify({'error': "Sessions not found"}), 404

    return jsonify ({
        'total_sessions':len(sessions),
        'sessions':[
            {
                'id': session.id,
                'patient_id':session.patient_id,
                'patient_name': session.patients.full_name if session.patients else None,
                'clinician_id':session.clinician_id,
                'clinician_name': session.clinicians.name if session.clinicians else None,
                'session_date':session.session_date.isoformat() if session.session_date else None,
                'status':session.status,
                'created_at':session.created_at.isoformat() if session.created_at else None,
            }
            for session in sessions
        ]
    }), 200

@api.route('/patient/<int:id>/session', methods=['POST'])
@jwt_required()
def create_sessions(id):
    if request.method=='POST':
        patient = Patient.query.filter_by(id=id).first()
        if not patient:
            return jsonify({"error": "Patient not found!"}), 404

        identity = get_jwt_identity()
        clinician_id = identity.get('clinician_id')


        #extract what the client has sent in json
        data = request.get_json()
        print(data)
        # clinician_id = data.get('clinician_id')
        session_date=data.get('session_date')
        print(session_date)
        notes = data.get('notes')
        duration =data.get('duration')
        session_type =data.get('session_type')
        status = data.get('status')


        new_session= Session(
            patient_id=id,
            clinician_id=clinician_id,
            session_date = session_date,
            notes = notes,
            status = status,
            session_type = session_type,
            duration = duration
        )

        db.session.add(new_session)
        db.session.commit()

        return jsonify({
            'id': new_session.id,
            'patient_id': new_session.patient_id,
            'patient_name': patient.full_name,
            'clinician_id': new_session.clinician_id,
            'clinician_name': identity.get('name'),
            'session_date': new_session.session_date.isoformat() if new_session.session_date else None,
            'status': new_session.status,
            'created_at': new_session.created_at.isoformat() if new_session.created_at else None,
        }), 201
    
@api.route('/patient/<int:id>/session/<int:session_id>', methods=['PATCH', 'DELETE'])
@jwt_required()
def delete_session(id, session_id):
    identity = get_jwt_identity()
    clinician_id = identity.get('clinician_id') if isinstance(identity, dict) else None
    patient = Patient.query.filter_by(id=id, clinician_id=clinician_id).first()
    if not patient:
        return jsonify({"error": "Patient not found!"}), 404

    session = Session.query.filter_by(
        id=session_id,
        patient_id=id,
        clinician_id=clinician_id
    ).first()
    if not session:
        return jsonify({"error": "Session not found!"}), 404

    if request.method == 'PATCH':
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data sent"}), 400

        allowed_fields = ['session_date', 'notes', 'status', 'duration', 'session_type']
        for field in allowed_fields:
            if field in data:
                value = data[field]
                if field == 'session_date' and isinstance(value, str):
                    value = datetime.strptime(value, '%Y-%m-%d').date() if value else None
                elif field == 'duration' and value == '':
                    value = None
                elif field == 'duration' and value is not None:
                    value = int(value)
                setattr(session, field, value)

        db.session.commit()
        return jsonify({
            'id': session.id,
            'patient_id': session.patient_id,
            'session_date': session.session_date.isoformat() if session.session_date else None,
            'notes': session.notes,
            'duration': session.duration,
            'session_type': session.session_type,
            'status': session.status,
        }), 200

    db.session.delete(session)
    db.session.commit()
    return jsonify({"message": "Session has been successfully deleted!"}), 200


@api.route('/patient/<int:id>/referral', methods=['POST'])
@jwt_required()
def create_referrals(id):
    identity = get_jwt_identity()
    clinician_id = identity.get('clinician_id')
    patient = Patient.query.filter_by(id=id, clinician_id=clinician_id).first()
    if not patient:
        return jsonify({"error": "Patient not found!"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data was sent!"}), 400

    new_referral = Referral(
        patient_id=patient.id,
        clinician_id=clinician_id,
        referred_to=data.get('referred_to'),
        reason=data.get('reason'),
        summary=data.get('summary'),
        sessions_completed=data.get('sessions_completed')
    )
    db.session.add(new_referral)
    db.session.commit()

    return jsonify(serialize_referral(new_referral)), 201


def serialize_referral(referral):
    patient = referral.patients
    if not patient and not referral.patient_id:
        patient = Patient.query.filter_by(
            id=referral.id,
            clinician_id=referral.clinician_id
        ).first()

    return {
        "id": referral.id,
        "patient_id": referral.patient_id or (patient.id if patient else None),
        "patient_name": patient.full_name if patient else None,
        "clinician_id": referral.clinician_id,
        "clinician_name": referral.clinicians.name if referral.clinicians else None,
        "referred_to": referral.referred_to,
        "reason": referral.reason,
        "summary": referral.summary,
        "sessions_completed": referral.sessions_completed,
        "created_at": referral.created_at.isoformat() if referral.created_at else None,
    }


@api.route('/referrals', methods=['GET', 'POST'])
@jwt_required()
def clinic_referrals():
    identity = get_jwt_identity()
    clinician_id = identity.get('clinician_id')

    if request.method == 'GET':
        referrals = Referral.query.filter_by(clinician_id=clinician_id).order_by(Referral.created_at.desc()).all()
        return jsonify({
            "total_referrals": len(referrals),
            "referrals": [serialize_referral(referral) for referral in referrals]
        }), 200

    elif request.method == 'POST':
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data was sent"}), 400

        patient_id = data.get('patient_id')
        patient = Patient.query.filter_by(id=patient_id, clinician_id=clinician_id).first()
        if not patient:
            return jsonify({"error": "Patient not found"}), 404

        referred_to = data.get('referred_to')
        reason = data.get('reason')
        summary = data.get('summary')
        sessions_completed = data.get('sessions_completed')

        new_referral = Referral(
            patient_id=patient_id,
            clinician_id=clinician_id,
            referred_to=referred_to,
            reason=reason,
            summary=summary,
            sessions_completed=sessions_completed
        )
        db.session.add(new_referral)
        db.session.commit()

        return jsonify(serialize_referral(new_referral)), 201

@api.route('/referrals/<int:id>', methods=['PATCH', 'DELETE'])
@jwt_required()
def update_delete(id):
    identity = get_jwt_identity()
    clinician_id = identity.get('clinician_id')

    if request.method=='PATCH':
        referral = Referral.query.filter_by(id=id, clinician_id=clinician_id).first()
        if not referral:
            return jsonify({"error": "Referral not found"}), 404
        
        data= request.get_json()
        if not data:
            return jsonify({"error":"No data sent!"}), 400

        if 'patient_id' in data:
            patient = Patient.query.filter_by(id=data['patient_id'], clinician_id=clinician_id).first()
            if not patient:
                return jsonify({"error": "Patient not found"}), 404
        
        allowed_fields = ['patient_id', 'referred_to', 'reason', 'summary', 'sessions_completed']

        for field in allowed_fields:
            if field in data:
                setattr(referral, field, data[field])

        db.session.commit()
        return jsonify(serialize_referral(referral)), 200
    
    elif request.method == 'DELETE':
        referral = Referral.query.filter_by(id=id, clinician_id=clinician_id).first()
        if not referral:
            return jsonify({"error": "Referral not found!"}), 404
        
        db.session.delete(referral)
        db.session.commit()
        return jsonify({"msg": "Referral deleted successfully!"}), 200



@api.route('/dashboard/stats', methods=['GET'])
@jwt_required()
def dashStats():
    identity = get_jwt_identity()
    clinician_id = identity.get('clinician_id') if isinstance(identity, dict) else None

    if clinician_id is None:
        return jsonify({"error": "Clinician identity not found in token"}), 400

    return jsonify({
        "sessions": Session.query.filter_by(clinician_id=clinician_id).count(),
        "referrals": Referral.query.filter_by(clinician_id=clinician_id).count(),
        "patients": Patient.query.filter_by(clinician_id=clinician_id).count()
    }), 200

@api.route('/weekly/sessions', methods=['GET'])
@jwt_required()
def get_weekly_sessions():
    identity = get_jwt_identity()
    clinician_id = identity.get('clinician_id')

    today = datetime.utcnow().date()
    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week +timedelta(days=6)

    sessions= Session.query.filter(
        Session.clinician_id==clinician_id,
        Session.session_date >= start_of_week,
        Session.session_date <= end_of_week
    ).all()

    if not sessions:
        return jsonify({"error": "No Sessions were found"}), 204

    return jsonify([s.to_dict() for s in sessions])