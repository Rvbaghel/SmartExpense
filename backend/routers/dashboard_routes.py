# routers/dashboard_routes.py
import io
import numpy as np
import base64
import pandas as pd
from datetime import datetime
from flask import Blueprint, jsonify, request
import matplotlib.pyplot as plt
import matplotlib
from models.salary_model import get_salaries_by_user
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
        month = int(request.args.get("month") or datetime.now().month)
        year = int(request.args.get("year") or datetime.now().year)

        # Fetch from DB
        salaries = get_salaries_by_user(user_id)
        expenses = get_all_expenses()

        # --- Salaries ---
        sal_df = pd.DataFrame(salaries)
        sal_df['salary_date'] = pd.to_datetime(sal_df['salary_date'])
        sal_df['year'] = sal_df['salary_date'].dt.year
        sal_df['month'] = sal_df['salary_date'].dt.month
        sal_df['amount'] = sal_df['amount'].astype(float)

        # Group by month + year → sum
        sal_grouped = (
            sal_df.groupby(['year', 'month'])['amount']
            .sum()
            .reset_index()
            .rename(columns={"amount": "total_salary"})
        )

        # --- Expenses ---
        exp_df = pd.DataFrame(expenses)
        exp_df['expense_date'] = pd.to_datetime(exp_df['expense_date'])
        exp_df['year'] = exp_df['expense_date'].dt.year
        exp_df['month'] = exp_df['expense_date'].dt.month
        exp_df['amount'] = exp_df['amount'].astype(float)

        exp_grouped = (
            exp_df.groupby(['year', 'month'])['amount']
            .sum()
            .reset_index()
            .rename(columns={"amount": "total_expenses"})
        )

        # --- Merge Salaries + Expenses ---
        summary = pd.merge(
            sal_grouped,
            exp_grouped,
            on=["year", "month"],
            how="outer"
        ).fillna(0)

        # Sort by year, month
        summary = summary.sort_values(["year", "month"]).reset_index(drop=True)

        # --- Add cumulative totals ---
        summary['cumulative_salary'] = summary['total_salary'].cumsum()
        summary['cumulative_expenses'] = summary['total_expenses'].cumsum()

        # Convert to JSON
        summary_data = summary.to_dict(orient="records")

        return jsonify({
            "success": True,
            "summary": summary_data
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})



@dashboard_bp.route("/charts/<int:user_id>")
def get_charts(user_id):
    try:

        month = int( request.args.get("month") or 10)
        print("Month is", month)

        salaries = get_salaries_by_user(user_id)
        expenses = get_all_expenses()

        # Filter only expenses of this user
        user_expenses = [e for e in expenses if e["cate_id"]]

        charts = {}

        # ----- 1. Salary Trend (Line Chart) -----
        plt.figure(figsize=(6,4))
        # salaries['salary_date'] = pd.to_datetime(salaries['salary_date'])
        # filtered = salaries[salaries['salary_date'].dt.month == month]

        salary_dates = [ str(sal['salary_date']) for sal in salaries]
        salary_amounts = [ float(sal['amount']) for sal in salaries]


        plt.plot(salary_dates, salary_amounts , marker='o', color='green', label="Salary")
        plt.title("Salary Trend Over Time")
        plt.xlabel("Date")
        plt.ylabel("Amount")
        plt.grid(True)
        plt.legend()

        # charts["salary_trend"] = plot_to_base64()
        charts["salary_trend"] = {
            'x': salary_dates[::-1],
            'y': salary_amounts[::-1]
        }

        # ----- 2. Expense Trend (Line Chart) -----
        plt.figure(figsize=(6,4))
        expense_dates = [str(e["expense_date"]) for e in user_expenses]
        expense_amounts = [float(e["amount"]) for e in user_expenses]
        plt.plot(expense_dates, expense_amounts, marker='x', color='red', label="Expenses")
        plt.title("Expense Trend Over Time")
        plt.xlabel("Date")
        plt.ylabel("Amount")
        plt.grid(True)
        plt.legend()
        # charts["expense_trend"] = plot_to_base64()
        charts["expense_trend"] = {
            'x': expense_dates[::-1],
            'y': expense_amounts[::-1]
        }

        # ----- 3. Expenses by Category (Pie Chart) -----
        plt.figure(figsize=(5,5))
        category_totals = {}
        for e in user_expenses:
            cat = e["category_name"]
            category_totals[cat] = category_totals.get(cat, 0) + float(e["amount"])
        plt.pie(category_totals.values(), labels=category_totals.keys(), autopct="%1.1f%%", startangle=140)
        plt.title("Expenses by Category")
        # charts["expense_by_category_pie"] = plot_to_base64()
        charts["expense_by_category_pie"] = {
            'x': list(category_totals.values()),
            'y': list(category_totals.keys())
        }

        # ----- 4. Expenses per Category (Bar Chart) -----
        plt.figure(figsize=(6,4))
        plt.bar(category_totals.keys(), category_totals.values(), color='skyblue')
        plt.xticks(rotation=45, ha='right')
        plt.ylabel("Amount")
        plt.title("Expenses per Category")
        # charts["expense_by_category_bar"] = plot_to_base64()
        charts["expense_by_category_bar"] = {
            'x': list(category_totals.keys()),
            'y': list(category_totals.values())
        }

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

        x = np.arange(len(months))
        width = 0.35
        plt.bar(x - width/2, salary_values, width, label="Salary", color="green")
        plt.bar(x + width/2, expense_values, width, label="Expenses", color="red")
        plt.xticks(x, months, rotation=45)
        plt.ylabel("Amount")
        plt.title("Salary vs Expense per Month")
        plt.legend()
        # charts["salary_vs_expense"] = plot_to_base64()
        charts["salary_vs_expense"] = {
            'x': list(category_totals.keys()),
            'y': list(category_totals.values())
        }

        print(charts)

#        return jsonify({"success": True, "charts": charts})
        return jsonify({"success": True, "charts": charts})


    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
