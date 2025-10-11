# routers/dashboard_routes.py
import io
import numpy as np
import base64
import pandas as pd
from datetime import datetime
from flask import Blueprint, jsonify, request
import matplotlib.pyplot as plt
import matplotlib
from models.earning_model import get_salaries_by_user, get_salaries_by_user_year,  get_salaries_by_user_month_year
from models.expense_model import get_all_expenses

matplotlib.use("Agg")
dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")


def plot_to_base64():
    """Convert current plt figure to base64 string."""
    buffer = io.BytesIO()
    plt.savefig(buffer, format="png", bbox_inches="tight")
    buffer.seek(0)
    img_str = base64.b64encode(buffer.getvalue()).decode()
    plt.close()
    return f"data:image/png;base64,{img_str}"

@dashboard_bp.route("/summary/<int:user_id>")
def get_summary(user_id):
    try:
        # Read month/year or fallback to current
        month = int(request.args.get("month") or datetime.now().month)
        year = int(request.args.get("year") or datetime.now().year)

        # Fetch only relevant salaries for this month & year
        salaries = get_salaries_by_user_year(user_id, year)
        expenses = get_all_expenses(user_id)

        if not salaries and not expenses:
            return jsonify({"success": True, "summary": []})

        # --- Salaries ---
        sal_df = pd.DataFrame(salaries)
        if not sal_df.empty:
            sal_df['earning_date'] = pd.to_datetime(sal_df['earning_date'])
            sal_df['amount'] = sal_df['amount'].astype(float)
            sal_df['year'] = sal_df['earning_date'].dt.year
            sal_df['month'] = sal_df['earning_date'].dt.month

            sal_grouped = (
                sal_df.groupby(['year', 'month'])['amount']
                .sum()
                .reset_index()
                .rename(columns={"amount": "total_earning"})
            )
        else:
            sal_grouped = pd.DataFrame(columns=['year', 'month', 'total_earning'])

        # --- Expenses ---
        exp_df = pd.DataFrame(expenses)
        if not exp_df.empty:
            exp_df['expense_date'] = pd.to_datetime(exp_df['expense_date'])
            exp_df['amount'] = exp_df['amount'].astype(float)
            exp_df['year'] = exp_df['expense_date'].dt.year
            exp_df['month'] = exp_df['expense_date'].dt.month

            exp_grouped = (
                exp_df.groupby(['year', 'month'])['amount']
                .sum()
                .reset_index()
                .rename(columns={"amount": "total_expenses"})
            )
        else:
            exp_grouped = pd.DataFrame(columns=['year', 'month', 'total_expenses'])

        # --- Merge Salaries + Expenses ---
        summary = pd.merge(
            sal_grouped,
            exp_grouped,
            on=["year", "month"],
            how="outer"
        ).fillna(0)

        # Sort and compute cumulative
        summary = summary.sort_values(["year"]).reset_index(drop=True)
        summary['cumulative_earning'] = summary['total_earning'].cumsum()
        summary['cumulative_expenses'] = summary['total_expenses'].cumsum()

        summary_data = summary.to_dict(orient="records")

        return jsonify({
            "success": True,
            "summary": summary_data,
            "month": month,
            "year": year
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


@dashboard_bp.route("/charts/<int:user_id>")
def get_charts(user_id):
    """
    Returns chart data for earnings & expenses trends, by category,
    and comparison per month.
    """
    try:
        month = int(request.args.get("month") or datetime.now().month)
        year = int(request.args.get("year") or datetime.now().year)

        salaries = get_salaries_by_user_year(user_id, year)
        expenses = get_all_expenses(user_id)

        charts = {}

        # ✅ Earning Trend
        if salaries:
            earning_dates = [str(s["earning_date"]) for s in salaries]
            earning_amounts = [float(s["amount"]) for s in salaries]
            charts["earning_trend"] = {"x": earning_dates[::-1], "y": earning_amounts[::-1]}

        # ✅ Expense Trend
        if expenses:
            expense_dates = [str(e["expense_date"]) for e in expenses]
            expense_amounts = [float(e["amount"]) for e in expenses]
            charts["expense_trend"] = {"x": expense_dates, "y": expense_amounts}

        # ✅ Expense by Category (Pie + Bar)
        category_totals = {}
        for e in expenses:
            cat = e.get("category_name", "Uncategorized")
            category_totals[cat] = category_totals.get(cat, 0) + float(e["amount"])

        charts["expense_by_category_pie"] = {
            "x": list(category_totals.keys()),
            "y": list(category_totals.values())
        }
        charts["expense_by_category_bar"] = {
            "x": list(category_totals.keys()),
            "y": list(category_totals.values())
        }

        # ✅ Earnings vs Expenses per Month
        earning_months = {}
        for s in salaries:
            key = pd.to_datetime(s["earning_date"]).strftime("%Y-%m")
            earning_months[key] = earning_months.get(key, 0) + float(s["amount"])

        expense_months = {}
        for e in expenses:
            key = pd.to_datetime(e["expense_date"]).strftime("%Y-%m")
            expense_months[key] = expense_months.get(key, 0) + float(e["amount"])

        months = sorted(set(list(earning_months.keys()) + list(expense_months.keys())))
        earning_values = [earning_months.get(m, 0) for m in months]
        expense_values = [expense_months.get(m, 0) for m in months]

        charts["earning_vs_expense"] = {
            "x": months,
            "earning": earning_values,
            "expenses": expense_values
        }

        return jsonify({"success": True, "charts": charts})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500