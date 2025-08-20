from flask import Blueprint, request, jsonify
from utils.database import db
from model import Salary

salary_bp = Blueprint("salary", __name__)

# Add salary
@salary_bp.route("", methods=["POST"])
def add_salary():
    data = request.get_json()
    user_id = data.get("user_id")
    month = data.get("month")   # Example: "2025-08"
    amount = data.get("amount")

    if not user_id or not month or not amount:
        return jsonify({"error": "Missing required fields"}), 400

    # prevent duplicate salary entry for same month
    existing_salary = Salary.query.filter_by(user_id=user_id, month=month).first()
    if existing_salary:
        return jsonify({"error": "Salary for this month already exists"}), 400

    salary = Salary(user_id=user_id, month=month, amount=amount)
    db.session.add(salary)
    db.session.commit()

    return jsonify({"message": "Salary added successfully"}), 201


# Get salaries for a user
@salary_bp.route("/<int:user_id>", methods=["GET"])
def get_salary(user_id):
    salaries = Salary.query.filter_by(user_id=user_id).all()
    result = [
        {"id": s.id, "month": s.month, "amount": s.amount}
        for s in salaries
    ]
    return jsonify(result)
