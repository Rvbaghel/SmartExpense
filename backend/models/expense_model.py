from config.db import get_connection
import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

# 🔹 Import category setup
from models.category_model import create_category_table, insert_default_categories


def create_expense_table():
    """
    Ensure category table exists first, then create expense table.
    """
    # ✅ First make sure category table and defaults exist
    create_category_table()
    insert_default_categories()

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS expense (
            id SERIAL PRIMARY KEY,
            cate_id INT NOT NULL REFERENCES category(id) ON DELETE CASCADE,
            user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            amount NUMERIC(12,2) NOT NULL,
            expense_date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    conn.close()


def insert_expense(cate_id, user_id, amount, expense_date):
    """
    Insert an expense and return the inserted row as dict.
    """
    # ✅ Ensure amount is numeric
    try:
        amount = float(amount)
    except ValueError:
        raise ValueError("Amount must be a number")

    # ✅ Ensure date is correct format
    if isinstance(expense_date, str):
        try:
            expense_date = datetime.datetime.strptime(expense_date, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("expense_date must be in YYYY-MM-DD format")

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute(
            """
            INSERT INTO expense (cate_id, user_id, amount, expense_date)
            VALUES (%s, %s, %s, %s)
            RETURNING id, cate_id, user_id, amount, expense_date, created_at;
            """,
            (cate_id, user_id, amount, expense_date)
        )
        result = cursor.fetchone()
        conn.commit()
        return result
    except psycopg2.Error as e:
        conn.rollback()
        print(f"Database error while inserting expense: {str(e)}")
        raise Exception(f"Database error while inserting expense: {str(e)}")
    finally:
        conn.close()


def get_all_expenses(user_id):
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("""
        SELECT * FROM expense
        WHERE user_id = %s
        ORDER BY expense_date DESC;
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return rows


def delete_expenses(month, year):
    """
    Delete all expenses for a given month and year.
    """
    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = """
            DELETE FROM expense
            WHERE EXTRACT(MONTH FROM expense_date) = %s
              AND EXTRACT(YEAR FROM expense_date) = %s
            RETURNING id;
        """

        cursor.execute(query, (month, year))
        deleted_rows = cursor.fetchall()  # List of deleted expense IDs
        conn.commit()

        return {
            "success": True,
            "deleted_count": len(deleted_rows),
            "deleted_ids": [row["id"] for row in deleted_rows]
        }

    except Exception as e:
        if conn:
            conn.rollback()
        return {"success": False, "error": str(e)}

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# ✅ Call this once when module is loaded so tables are ready
create_expense_table()
