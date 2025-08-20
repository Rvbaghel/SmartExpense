from flask import Blueprint, request, jsonify
from model import Expense
from utils.database import db
import csv
from datetime import datetime
import io

# Create Blueprint
expense_bp = Blueprint("expenses", __name__)

# -------------------------
# Add expense via JSON/Form
# -------------------------
@expense_bp.route("", methods=["POST"])
def add_expense():
    try:
        data = request.get_json() or request.form

        amount = float(data.get("amount"))
        description = data.get("description")
        date = datetime.strptime(data.get("date"), "%Y-%m-%d").date()
        user_id = int(data.get("user_id"))  # Later: Get from auth token

        expense = Expense(
            amount=amount,
            description=description,
            date=date,
            user_id=user_id
        )
        db.session.add(expense)
        db.session.commit()

        return jsonify({"message": "Expense added successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# -------------------------
# Upload expenses via CSV
# -------------------------
@expense_bp.route("/upload", methods=["POST"])
def upload_expenses_csv():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    try:
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        csv_reader = csv.DictReader(stream)

        for row in csv_reader:
            amount = float(row["amount"])
            description = row["description"]
            date = datetime.strptime(row["date"], "%Y-%m-%d").date()
            user_id = int(row["user_id"])

            expense = Expense(
                amount=amount,
                description=description,
                date=date,
                user_id=user_id
            )
            db.session.add(expense)

        db.session.commit()
        return jsonify({"message": "CSV expenses uploaded successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# -------------------------
# Get all expenses
# -------------------------
@expense_bp.route("", methods=["GET"])
def get_expenses():
    try:
        expenses = Expense.query.all()
        result = [
            {
                "id": e.id,
                "amount": e.amount,
                "description": e.description,
                "date": e.date.strftime("%Y-%m-%d"),
                "user_id": e.user_id
            }
            for e in expenses
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
