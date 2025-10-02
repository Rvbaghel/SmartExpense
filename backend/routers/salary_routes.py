import traceback
from flask import Blueprint, request, jsonify
from models.salary_model import insert_salary, get_salaries_by_user, create_salary_table, delete_salaries

salary_bp = Blueprint("salary", __name__, url_prefix="/salary")
create_salary_table()

@salary_bp.route("/add", methods=["POST"])
def add_salary():
    data = request.get_json()
    print("Incoming salary data:", data)

    user_id = data.get("user_id")
    amount = data.get("amount")
    salary_date = data.get("salary_date")  # expects 'YYYY-MM-DD'

    if not user_id or not amount or not salary_date:
        return jsonify({"error": "Missing user_id, amount, or salary_date"}), 400

    try:
        # Call model function (handles validation + insert)
        new_salary = insert_salary(user_id, amount, salary_date)

        return jsonify({
            "message": "Salary added",
            "salary": new_salary  # full row dict
        }), 201

    except Exception as e:
        print("Error inserting salary:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@salary_bp.route("/user/<int:user_id>", methods=["GET"])
def get_salary(user_id):
    try:
        salaries = get_salaries_by_user(user_id)
        # salaries is already a list of dicts from RealDictCursor
        return jsonify(salaries)
    except Exception as e:
        print("Error fetching salaries:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@salary_bp.route("/latest/<int:user_id>", methods=["GET"])
def get_latest_salary(user_id):
    salaries = get_salaries_by_user(user_id)
    if not salaries:
        return jsonify({"success": False, "error": "No salary found"}), 404
    latest = salaries[0]  # assuming DESC order
    return jsonify({"success": True, "salary": latest}), 200

@salary_bp.route("/delete/<int:user_id>")
def delete_salaries(user_id):
    message = delete_salaries(user_id)

    if not message:
        return jsonify({"success": False, "error": "No salary found"}), 404
    return jsonify({"success": True, "salary": message}), 200