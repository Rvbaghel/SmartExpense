import traceback
import datetime
from flask import Blueprint, request, jsonify
from models.earning_model import insert_earning, get_salaries_by_user, get_salaries_by_user_year, create_earning_table, delete_salaries, exist_month_year_user, update_month_year_earning

earning_bp = Blueprint("earning", __name__, url_prefix="/earning")
create_earning_table()

@earning_bp.route("/add", methods=["POST"])
def add_earning():
    data = request.get_json()
    print("Incoming earning data:", data)

    user_id = data.get("user_id")
    amount = data.get("amount")
    earning_date = data.get("earning_date")  # expects 'YYYY-MM-DD'

    if not user_id or not amount or not earning_date:
        return jsonify({"error": "Missing user_id, amount, or earning_date"}), 400

    try:
        # Call model function (handles validation + insert)

        is_user_month_year_earning_exist = exist_month_year_user(user_id, earning_date)

        if is_user_month_year_earning_exist:
            data = update_month_year_earning(user_id, amount, earning_date)
        else:
            data = insert_earning(user_id, amount, earning_date)

        return jsonify({
            "message": "earning added",
            "earning": data  # full row dict
        }), 201

    except Exception as e:
        print("Error inserting earning:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@earning_bp.route("/user/<int:user_id>", methods=["GET"])
def get_earning(user_id):
    try:
        year = int(request.args.get("year") or datetime.datetime.now().year)
        salaries = get_salaries_by_user_year(user_id, year)
        # salaries is already a list of dicts from RealDictCursor
        print("Earning", salaries)
        return jsonify(salaries)
    except Exception as e:
        print("Error fetching salaries:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@earning_bp.route("/latest/<int:user_id>", methods=["GET"])
def get_latest_earning(user_id):
    salaries = get_salaries_by_user(user_id)
    if not salaries:
        return jsonify({"success": False, "error": "No earning found"}), 404
    latest = salaries[0]  # assuming DESC order
    return jsonify({"success": True, "earning": latest}), 200

@earning_bp.route("/delete/<int:user_id>")
def delete_salaries(user_id):
    message = delete_salaries(user_id)

    if not message:
        return jsonify({"success": False, "error": "No earning found"}), 404
    return jsonify({"success": True, "earning": message}), 200