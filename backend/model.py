from utils.database import db
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    occupation = db.Column(db.String(100), nullable=True)   # New field
    bio = db.Column(db.Text, nullable=True)                 # New field
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<User {self.name}>"
    # # Relationship
    # salaries = db.relationship('Salary', backref='user', lazy=True)
    # expenses = db.relationship('Expense', backref='user', lazy=True)


class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Salary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    month = db.Column(db.String(20), nullable=False)  # Example: "August 2025"
    amount = db.Column(db.Float, nullable=False)  # Only monthly salary amount
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
