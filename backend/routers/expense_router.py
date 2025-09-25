from flask import Blueprint, request, jsonify
from backend.models.expense_model import insert_expense, get_all_expenses

expense_bp = Blueprint("expense", __name__, url_prefix="/expense")


@expense_bp.route("/all", methods=["GET"])
def all_expenses():
    """
    Fetch all expenses
    """
    try:
        expenses = get_all_expenses()
        return jsonify({"success": True, "expenses": expenses}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@expense_bp.route("/add_bulk", methods=["POST"])
def add_bulk_expenses():
    """
    Insert multiple expenses at once
    Expect JSON: { user_id: int, expenses: [{cate_id, amount, expense_date}, ...] }
    """
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        expenses = data.get("expenses")

        if not user_id:
            return jsonify({"success": False, "error": "user_id is required"}), 400
        if not expenses or not isinstance(expenses, list):
            return jsonify({"success": False, "error": "expenses must be a non-empty list"}), 400

        inserted = []
        for exp in expenses:
            cate_id = exp.get("cate_id")
            amount = exp.get("amount")
            expense_date = exp.get("expense_date")

            if not cate_id or not amount or not expense_date:
                return jsonify({"success": False, "error": "All fields required for each expense"}), 400

            inserted_row = insert_expense(cate_id, amount, expense_date)
            inserted.append(inserted_row)

        return jsonify({"success": True, "inserted": inserted}), 201

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@expense_bp.route("/by_month", methods=["GET"])
def expenses_by_month():
    try:
        user_id = request.args.get("user_id", type=int)
        month = request.args.get("month", type=int)
        year = request.args.get("year", type=int)

        if not user_id or not month or not year:
            return jsonify({"success": False, "error": "user_id, month, and year are required"}), 400

        from config.db import get_connection
        from psycopg2.extras import RealDictCursor

        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT e.id, e.amount, e.expense_date, e.created_at,
                   c.name AS category_name, c.id AS cate_id
            FROM expense e
            JOIN category c ON e.cate_id = c.id
            WHERE EXTRACT(MONTH FROM e.expense_date) = %s
              AND EXTRACT(YEAR FROM e.expense_date) = %s
            ORDER BY e.expense_date ASC;
        """, (month, year))

        expenses = cursor.fetchall()
        conn.close()

        return jsonify({"success": True, "expenses": expenses}), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500