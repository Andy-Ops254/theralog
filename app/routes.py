from flask import Blueprint, request, jsonify, make_response
from datetime import timedelta
from flask_jwt_extended import create_access_token, create_refresh_token
from .extensions import db, bcrypt
from .models import Clinician, Patient,Session

#blueprint creation for the routes
api=Blueprint('api', __name__)

@api.route('/login', methods=['POST'])
def clinician_login():
    data=request.get_json()
    #error handler
    if not data or"email" not in data or "password" not in data:
        return jsonify({"error": "please input Email and password!!"})
    
    #get info from clients side
    email= data['email'].strip().lower()
    password = data['password']
    name=data['name']
    #Query the useer from the db to check if they exist
    clinicians = Clinician.query.filter_by(email=email).first()
    if not clinicians:
        return jsonify({'error': "Clinician doesn't exist!"}), 401
    
    # validate password
    if not bcrypt.check_password_hash(clinicians.password_hash, password):
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
            "email": clinicians.email,
            "name":clinicians.name
        }
    }), 200
    

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
    
@api.route("/new_patient", methods=['POST'])
def new_patient():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Please fill in the required fields!!"}), 400
    
    id = data.get("id")
    full_name = data.get('full_name')
    date_of_birth = data.get('date_of_birth')
    sex = data.get('sex')
    condition = data.get('condition')
    clinician_id = data.get("clinician_id")
    status = data.get("status")
    date_of_admission = data.get("date_of_admission")
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


@api.route("/patients", methods=['GET'])
def read_patients():
    
    #database querying 
    patients = Patient.query.all()

    if not patients:
        return jsonify ({"error": "Patients not found!"}), 404
    
    response = [
    {
        "full_name" : patient.full_name,
        "date_of_birth":patient.date_of_birth,
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

@api.route('/patient/<string:full_name>', methods=['GET', 'PATCH'])
def get_patient(full_name):
    if request.method == 'GET':
        #get the full name from the client side
        # full_name = request.args.get("full_name")

        # if not full_name:
        #     return jsonify({"error": "full_name input is required!"}), 200
        #db query
        patient = Patient.query.filter_by(full_name=full_name).first()

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
        patient = Patient.query.filter_by(full_name=full_name).first()

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
    

@api.route('/patient/<int:patient_id>/sessions', methods=['GET'])
def patients_sessions(patient_id):
    #patient query
    patient = Patient.query.filter_by(patient_id=patient_id).first()

    if not patient:
        return jsonify({"error": "Patient not found!"}), 404
    
    #if patient is found we query the sessions
    sessions=Session.query.filter_by(patient_id=patient_id).all()

    if not sessions:
        return jsonify ({'error': "No sessions found"}), 404

    response = [
        {
        "session_date":session.session_date.isoformat(),
        "notes": session.notes,
        "status": session.status,
        "created_at":session.created_at.isoformat()
    }
        for session in sessions
    ]

    return jsonify({
        "patient's name":patient.full_name,
        "total_sessions": len(sessions),
        "sessions": response
    }),200


@api.route('/patient/<int:id>/session', methods=['POST', 'PATCH'])
def create_sessions(id):
    if request.method=='POST':
        patient = Patient.query.filter_by(id=id).first()
        if not patient:
            return jsonify({"error": "Patient not found!"}), 404

        #extract what the client has sent in json
        data = request.get_json()
        print(data)
        # clinician_id = data.get('clinician_id')
        session_date=data.get('session_date')
        print(session_date)
        notes = data.get('notes')
        status = data.get('status')


        new_session= Session(
            id=id,
            session_date = session_date,
            notes = notes,
            status = status,
        )

        db.session.add(new_session)
        db.session.commit()

        return jsonify(new_session.to_dict()), 201
    
    elif request.method=='PATCH':
        patient = Patient.query.filter_by(id=id).first()

        if not patient:
            return jsonify({"error": "Patient not found!"}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data sent"}), 404
        
        allowed_fields = ['session_date', 'notes', 'status']

        for field in allowed_fields:
            if field in data:
                setattr(patient, field, data[field])

        db.session.commit()
        return jsonify ({"message": "session updated successfully"}), 200