from extensions import db
from sqlalchemy_serializer import SerializerMixin

class Clinician (db.Model, SerializerMixin):
    __tablename__='clinicians'

    id = db.Column(db.Integer,primary_key=True)
    name= db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String)
    role = db.Column(db.String)
    is_active = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    patients=db.relationship('Patient', back_populates='clinicians')
    sessions=db.relationship('Session', back_populates='clinicians')
    referrals=db.relationship('Referral', back_populates='clinicians')
    auditLogs=db.relationship('AuditLog', back_populates='clinicians')

    serialize_rules=('-patients.clinicians', '-sessions.clinicians', '-referrals.clinicians', '-auditLogs.clinicians')


    def __repr__(self):
        return (
            f"Clinician(name={self.name}, email={self.email}, "
            f"role={self.role}, is_active={self.is_active}, "
            f"created_at={self.created_at})"
        )
    

class Patient(db.Model, SerializerMixin):
    __tablename__= 'patients'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String, nullable=False)
    date_of_birth = db.Column(db.Date)
    sex = db.Column(db.String, nullable=False)
    condition= db.Column(db.String)
    clinician_id =db.Column(db.Integer, db.ForeignKey('clinicians.id'))
    status = db.Column(db.String)
    date_of_admission =db.Column(db.DateTime, server_default=db.func.now())
    created_at=db.Column(db.DateTime, server_default=db.func.now())

    clinicians=db.relationship('Clinician', back_populates='patients')
    sessions=db.relationship('Session', back_populates='patients')
    referrals=db.relationship('Referral', back_populates='patients')

    serialize_rules=('-clinicians.patients', '-sessions.patients', '-referrals.patients')

    def __repr__(self):
        return (
            f"full_name={self.full_name}, date_of_birth={self.date_of_birth},"
            f"sex={self.sex}, condition={self.condition},"
            f"clinican_id={self.clinician_id}, status={self.status},"
            f"date_of_admission={self.date_of_admission}"
        ) 
    

class Session(db.Model, SerializerMixin):
    __tablename__='sessions'

    id= db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    clinician_id=db.Column(db.Integer, db.ForeignKey('clinicians.id'))
    session_date = db.Column(db.Date)
    notes = db.Column(db.Text)
    status= db.Column(db.String)
    created_at=db.Column(db.DateTime, server_default=db.func.now())
    updated_at=db.Column(db.DateTime, server_default=db.func.now())

    patients=db.relationship('Patient', back_populates='sessions')
    clinicians=db.relationship('Clinician', back_populates='sessions')

    serialize_rules=('-patients.sessions', '-clinicians.sessions')

    def __repr__(self):
        return(
            f"patient_id={self.patient_id}, clinician_id={self.clinician_id},"
            f"session_id={self.session_date}, notes={self.notes},"
            f"status={self.status}"
        )
    

class Referral(db.Model, SerializerMixin):
    __tablename__='referrals'

    id=db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    clinician_id=db.Column(db.Integer, db.ForeignKey('clinicians.id'))
    referred_to = db.Column(db.String)
    reason=db.Column(db.Text)
    summary=db.Column(db.Text)
    sessions_completed = db.Column(db.Integer)
    created_at=db.Column(db.DateTime, server_default=db.func.now())

    clinicians=db.relationship('Clinicians', back_populates='referrals')
    patients=db.relationship('Patient', back_populates='referrals')

    serialize_rules=('-clinicians.referrals', '-patients.referrals')

    def __repr__(self):
            return(
                f"patient_id={self.patient_id}, clinician_id={self.clinician_id},"
                f"referred_to={self.referred_to}, reason={self.reason,}"
                f"summary={self.summary}, sessions_completed={self.sessions_completed}" 
            )


class AuditLog(db.Model, SerializerMixin):
    __tablename__='auditLogs'

    id=db.Column(db.Integer, primary_key=True)
    clinician_id=db.Column(db.Integer, db.ForeignKey('clinicians.id'))
    action=db.Column(db.String)
    entity=db.Column(db.String)
    time=db.Column(db.DateTime)

    clinicians=db.relationship('Clinician', back_populates='auditLogs')

    serialize_rules=('-clinicians.auditLogs')


    def __repr__(self):
        return (
            f"clinician_id={self.clinician_id}, action={self.action},"
            f"entity={self.entity}, time={self.time}"
        )


