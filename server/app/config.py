import os
from flask import Flask

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
app.config["JWT_SECRET_KEY"] = os.environ["JWT_SECRET_KEY"]