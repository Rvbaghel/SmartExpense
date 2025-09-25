# routers/dashboard_routes.py
import io
import base64
from flask import Blueprint, jsonify
import matplotlib.pyplot as plt
from models.salary_model import get_salaries_by_user
from models.expense_model import get_all_expenses

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")


def plot_to_base64():
    """Convert current plt figure to base64 string."""
    buffer = io.BytesIO()
    plt.savefig(buffer, format="png", bbox_inches="tight")
    buffer.seek(0)
    img_str = base64.b64encode(buffer.getvalue()).decode()
    plt.close()
    return f"data:image/png;base64,{img_str}"


@dashboard_bp.route("/charts/<int:user_id>")
def get_charts(user_id):
    try:
        salaries = get_salaries_by_user(user_id)
        expenses = get_all_expenses()

        # Filter only expenses of this user
        user_expenses = [e for e in expenses if e["cate_id"]]

        charts = {}

        # ----- 1. Salary Trend (Line Chart) -----
        plt.figure(figsize=(6,4))
        salary_dates = [s["salary_date"] for s in salaries]
        salary_amounts = [float(s["amount"]) for s in salaries]
        plt.plot(salary_dates, salary_amounts, marker='o', color='green', label="Salary")
        plt.title("Salary Trend Over Time")
        plt.xlabel("Date")
        plt.ylabel("Amount")
        plt.grid(True)
        plt.legend()
        charts["salary_trend"] = plot_to_base64()

        # ----- 2. Expense Trend (Line Chart) -----
        plt.figure(figsize=(6,4))
        expense_dates = [e["expense_date"] for e in user_expenses]
        expense_amounts = [float(e["amount"]) for e in user_expenses]
        plt.plot(expense_dates, expense_amounts, marker='x', color='red', label="Expenses")
        plt.title("Expense Trend Over Time")
        plt.xlabel("Date")
        plt.ylabel("Amount")
        plt.grid(True)
        plt.legend()
        charts["expense_trend"] = plot_to_base64()

        # ----- 3. Expenses by Category (Pie Chart) -----
        plt.figure(figsize=(5,5))
        category_totals = {}
        for e in user_expenses:
            cat = e["category_name"]
            category_totals[cat] = category_totals.get(cat, 0) + float(e["amount"])
        plt.pie(category_totals.values(), labels=category_totals.keys(), autopct="%1.1f%%", startangle=140)
        plt.title("Expenses by Category")
        charts["expense_by_category_pie"] = plot_to_base64()

        # ----- 4. Expenses per Category (Bar Chart) -----
        plt.figure(figsize=(6,4))
        plt.bar(category_totals.keys(), category_totals.values(), color='skyblue')
        plt.xticks(rotation=45, ha='right')
        plt.ylabel("Amount")
        plt.title("Expenses per Category")
        charts["expense_by_category_bar"] = plot_to_base64()

        # ----- 5. Salary vs Expense per Month (Bar Chart) -----
        plt.figure(figsize=(6,4))
        # Group salaries by month
        salary_months = {}
        for s in salaries:
            month = s["salary_date"].strftime("%Y-%m")
            salary_months[month] = salary_months.get(month, 0) + float(s["amount"])
        # Group expenses by month
        expense_months = {}
        for e in user_expenses:
            month = e["expense_date"].strftime("%Y-%m")
            expense_months[month] = expense_months.get(month, 0) + float(e["amount"])

        months = sorted(set(list(salary_months.keys()) + list(expense_months.keys())))
        salary_values = [salary_months.get(m, 0) for m in months]
        expense_values = [expense_months.get(m, 0) for m in months]

        import numpy as np
        x = np.arange(len(months))
        width = 0.35
        plt.bar(x - width/2, salary_values, width, label="Salary", color="green")
        plt.bar(x + width/2, expense_values, width, label="Expenses", color="red")
        plt.xticks(x, months, rotation=45)
        plt.ylabel("Amount")
        plt.title("Salary vs Expense per Month")
        plt.legend()
        charts["salary_vs_expense"] = plot_to_base64()

        return jsonify({"success": True, "charts": charts})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
