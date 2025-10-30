# routers/dashboard_routes.py
import traceback
import pandas as pd
from datetime import datetime
from flask import Blueprint, jsonify, request
from psycopg2.extras import RealDictCursor
from config.db import get_connection

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")

# =========================================================
# =============== HELPER UTILITIES =========================
# =========================================================

def safe_float(value):
    """Safely convert a value to float, returning 0.0 if invalid."""
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def fetch_dataframe(query, params=()):
    """Run a query and return a pandas DataFrame."""
    conn = None
    try:
        conn = get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return pd.DataFrame(rows)
    except Exception as e:
        print("❌ Database Fetch Error:", str(e))
        traceback.print_exc()
        return pd.DataFrame()  # Return empty DataFrame on failure
    finally:
        if conn:
            conn.close()


def aggregate_monthly(df, date_col, value_col):
    """Group by month/year and return total sum."""
    if df.empty:
        return pd.DataFrame(columns=["year", "month", value_col])
    df[date_col] = pd.to_datetime(df[date_col])
    df[value_col] = df[value_col].astype(float)
    df["year"] = df[date_col].dt.year
    df["month"] = df[date_col].dt.month
    grouped = df.groupby(["year", "month"], as_index=False)[value_col].sum()
    return grouped


# =========================================================
# =============== DASHBOARD ROUTES ========================
# =========================================================

@dashboard_bp.route("/summary/<int:user_id>")
def get_summary(user_id):
    """
    Returns monthly cumulative summary of earnings & expenses.
    JSON format:
    {
      "month": 10,
      "year": 2025,
      "summary": [ {year, month, total_earning, total_expenses, cumulative_earning, cumulative_expenses}, ... ]
    }
    """
    try:
        month = int(request.args.get("month") or datetime.now().month)
        year = int(request.args.get("year") or datetime.now().year)

        # Fetch data safely
        earning_df = fetch_dataframe(
            """
            SELECT amount, earning_date 
            FROM earning 
            WHERE user_id = %s AND EXTRACT(YEAR FROM earning_date) = %s
            """,
            (user_id, year)
        )

        expense_df = fetch_dataframe(
            """
            SELECT e.amount, e.expense_date, c.name AS category_name
            FROM expense e
            JOIN category c ON e.cate_id = c.id
            WHERE e.user_id = %s AND EXTRACT(YEAR FROM e.expense_date) = %s
            """,
            (user_id, year)
        )

        # Process data
        earn_group = aggregate_monthly(earning_df, "earning_date", "amount").rename(columns={"amount": "total_earning"})
        exp_group = aggregate_monthly(expense_df, "expense_date", "amount").rename(columns={"amount": "total_expenses"})

        summary = pd.merge(earn_group, exp_group, on=["year", "month"], how="outer").fillna(0)
        summary = summary.sort_values(["year", "month"]).reset_index(drop=True)

        # Add cumulative
        summary["cumulative_earning"] = summary["total_earning"].cumsum()
        summary["cumulative_expenses"] = summary["total_expenses"].cumsum()

        return jsonify({
            "success": True,
            "month": month,
            "year": year,
            "summary": summary.to_dict(orient="records")
        })

    except Exception as e:
        print("❌ Error in /summary:", str(e))
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

@dashboard_bp.route("/charts/<int:user_id>")
def get_charts(user_id):
    """
    Return JSON for charts:
    - earning_trend (line)
    - expense_trend (line)
    - expense_by_category_pie (monthly category pie for provided month/year)
    - expense_by_category_bar (yearly category bar for provided year)
    - earning_vs_expense (monthly comparison for provided year)
    """
    try:
        # requested month/year (fallback to current)
        month = int(request.args.get("month") or datetime.now().month)
        year = int(request.args.get("year") or datetime.now().year)

        # Fetch year-scoped data (we'll filter for month where needed)
        earning_df = fetch_dataframe(
            """
            SELECT amount, earning_date
            FROM earning
            WHERE user_id = %s AND EXTRACT(YEAR FROM earning_date) = %s
            ORDER BY earning_date ASC
            """,
            (user_id, year)
        )

        expense_df = fetch_dataframe(
            """
            SELECT e.amount, e.expense_date, c.name AS category_name
            FROM expense e
            JOIN category c ON e.cate_id = c.id
            WHERE e.user_id = %s AND EXTRACT(YEAR FROM e.expense_date) = %s
            ORDER BY e.expense_date ASC
            """,
            (user_id, year)
        )

        charts = {}

        # ===== EARNING TREND =====
        if not earning_df.empty:
            earning_df["earning_date"] = pd.to_datetime(earning_df["earning_date"])
            earning_df = earning_df.sort_values("earning_date")
            charts["earning_trend"] = {
                "x": earning_df["earning_date"].dt.strftime("%Y-%m-%d").tolist(),
                "y": earning_df["amount"].astype(float).tolist()
            }
        else:
            charts["earning_trend"] = {"x": [], "y": []}

        # ===== EXPENSE TREND =====
        if not expense_df.empty:
            expense_df["expense_date"] = pd.to_datetime(expense_df["expense_date"])
            expense_df = expense_df.sort_values("expense_date")
            charts["expense_trend"] = {
                "x": expense_df["expense_date"].dt.strftime("%Y-%m-%d").tolist(),
                "y": expense_df["amount"].astype(float).tolist()
            }
        else:
            charts["expense_trend"] = {"x": [], "y": []}

        # ===== EXPENSE BY CATEGORY - MONTHLY PIE =====
        # Filter expense_df for the requested month & year
        if not expense_df.empty:
            expense_month_df = expense_df[
                (expense_df["expense_date"].dt.year == int(year)) &
                (expense_df["expense_date"].dt.month == int(month))
            ]
            if not expense_month_df.empty:
                pie_group = (
                    expense_month_df.groupby("category_name")["amount"]
                    .sum()
                    .reset_index()
                    .sort_values("amount", ascending=False)
                )
                charts["expense_by_category_pie"] = {
                    "x": pie_group["category_name"].tolist(),
                    "y": pie_group["amount"].astype(float).tolist()
                }
            else:
                charts["expense_by_category_pie"] = {"x": [], "y": []}
        else:
            charts["expense_by_category_pie"] = {"x": [], "y": []}

        # ===== EXPENSE BY CATEGORY - YEARLY BAR =====
        # Aggregate expenses for the entire year by category
        if not expense_df.empty:
            bar_group = (
                expense_df.groupby("category_name")["amount"]
                .sum()
                .reset_index()
                .sort_values("amount", ascending=False)
            )
            charts["expense_by_category_bar"] = {
                "x": bar_group["category_name"].tolist(),
                "y": bar_group["amount"].astype(float).tolist()
            }
        else:
            charts["expense_by_category_bar"] = {"x": [], "y": []}

        # ===== EARNING vs EXPENSE (monthly comparison for the requested year) =====
        earn_month = aggregate_monthly(earning_df, "earning_date", "amount") if not earning_df.empty else pd.DataFrame(columns=["year", "month", "amount"])
        exp_month = aggregate_monthly(expense_df, "expense_date", "amount") if not expense_df.empty else pd.DataFrame(columns=["year", "month", "amount"])

        merged = pd.merge(
            earn_month.rename(columns={"amount": "total_earning"}),
            exp_month.rename(columns={"amount": "total_expenses"}),
            on=["year", "month"],
            how="outer"
        ).fillna(0)

        # Ensure months for full year (1..12) are present with zeros if missing
        if merged.empty:
            # create empty months for year
            merged = pd.DataFrame({
                "year": [year] * 12,
                "month": list(range(1, 13)),
                "total_earning": [0.0] * 12,
                "total_expenses": [0.0] * 12
            })
        else:
            # reindex to ensure all months 1..12 appear for the given year
            all_months = pd.DataFrame({"year": [year]*12, "month": list(range(1,13))})
            merged = pd.merge(all_months, merged, on=["year","month"], how="left").fillna(0)
            merged["total_earning"] = merged["total_earning"].astype(float)
            merged["total_expenses"] = merged["total_expenses"].astype(float)

        merged = merged.sort_values(["month"])
        merged["x_label"] = merged.apply(lambda x: f"{int(x['month']):02d}-{int(x['year'])}", axis=1)

        charts["earning_vs_expense"] = {
            "x": merged["x_label"].tolist(),
            "earning": merged["total_earning"].astype(float).tolist(),
            "expenses": merged["total_expenses"].astype(float).tolist()
        }

        return jsonify({"success": True, "charts": charts})

    except Exception as e:
        # detailed error log for server side debugging; frontend receives safe JSON
        print("❌ Error in /charts:", str(e))
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

@dashboard_bp.route("/review/<int:user_id>", methods=["GET"])
def review_summary(user_id):
    """
    Returns a summary for the selected year:
    - Earning (salary) per month
    - Total expenses per month
    - Expense breakdown by category for that month
    """
    try:
        import traceback
        year = int(request.args.get("year") or datetime.now().year)

        # Fetch data from DB
        earning_df = fetch_dataframe(
            """
            SELECT amount, earning_date
            FROM earning
            WHERE user_id = %s AND EXTRACT(YEAR FROM earning_date) = %s
            """,
            (user_id, year)
        )

        expense_df = fetch_dataframe(
            """
            SELECT e.amount, e.expense_date, c.name AS category_name
            FROM expense e
            JOIN category c ON e.cate_id = c.id
            WHERE e.user_id = %s AND EXTRACT(YEAR FROM e.expense_date) = %s
            """,
            (user_id, year)
        )

        # Prepare DataFrames
        if not earning_df.empty:
            earning_df["earning_date"] = pd.to_datetime(earning_df["earning_date"])
            earning_df["month"] = earning_df["earning_date"].dt.month
            earning_monthly = (
                earning_df.groupby("month")["amount"].sum().reset_index()
            )
        else:
            earning_monthly = pd.DataFrame(columns=["month", "amount"])

        if not expense_df.empty:
            expense_df["expense_date"] = pd.to_datetime(expense_df["expense_date"])
            expense_df["month"] = expense_df["expense_date"].dt.month

            # Monthly total expenses
            total_expenses = expense_df.groupby("month")["amount"].sum().reset_index()

            # Monthly category breakdown
            category_breakdown = (
                expense_df.groupby(["month", "category_name"])["amount"]
                .sum()
                .reset_index()
            )
        else:
            total_expenses = pd.DataFrame(columns=["month", "amount"])
            category_breakdown = pd.DataFrame(columns=["month", "category_name", "amount"])

        # Merge salary & expenses
        merged = pd.merge(
            earning_monthly.rename(columns={"amount": "earning"}),
            total_expenses.rename(columns={"amount": "total_expenses"}),
            on="month",
            how="outer"
        ).fillna(0)

        summary = []
        for _, row in merged.iterrows():
            month = int(row["month"])
            earning = float(row["earning"])
            total_exp = float(row["total_expenses"])

            # Get category breakdown for this month
            breakdown_df = category_breakdown[category_breakdown["month"] == month]
            category_map = {
                str(cat): float(amt)
                for cat, amt in zip(breakdown_df["category_name"], breakdown_df["amount"])
            }

            summary.append({
                "month": month,
                "earning": earning,
                "total_expenses": total_exp,
                "category_breakdown": category_map
            })

        return jsonify({"success": True, "year": year, "summary": summary}), 200

    except Exception as e:
        print("❌ Error in /dashboard/review:", str(e))
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500
