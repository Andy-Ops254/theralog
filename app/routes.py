from flask import Blueprint, request, jsonify, make_response
from datetime import timedelta
from flask_jwt_extended import create_access_token, create_refresh_token
from server.app.extensions import db, bcrypt
from server.app.models import Clinician, Patient

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
    pass


