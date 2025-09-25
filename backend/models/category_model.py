from config.db import get_connection
import psycopg2
from psycopg2.extras import RealDictCursor

def create_category_table():
    """
    Create category table if it doesn't exist.
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS category (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE
        );
    """)
    conn.commit()
    conn.close()


def insert_default_categories():
    """
    Insert default categories (only if table is empty).
    """
    default_categories = [
        "Food & Groceries",
        "Rent",
        "Electricity Bill",
        "Water Bill",
        "Mobile Bill",
        "Fuel",
        "Healthcare",
        "Education",
        "Entertainment",
        "Traveling",
        "Shopping",
        "Investments",
        "EMI",
        "Insurance",
        "Other"
    ]

    conn = get_connection()
    cursor = conn.cursor()

    # check if already inserted
    cursor.execute("SELECT COUNT(*) AS total FROM category;")
    count = cursor.fetchone()["total"]

    if count == 0:  # only insert if empty
        for cat in default_categories:
            cursor.execute("INSERT INTO category (name) VALUES (%s) ON CONFLICT (name) DO NOTHING;", (cat,))
        conn.commit()

    conn.close()


def insert_category(name):
    """
    Insert a single new category
    """
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute(
            "INSERT INTO category (name) VALUES (%s) RETURNING id, name;",
            (name,)
        )
        result = cursor.fetchone()
        conn.commit()
        return result
    except psycopg2.Error as e:
        conn.rollback()
        raise Exception(f"Database error while inserting category: {str(e)}")
    finally:
        conn.close()


def get_all_categories():
    """
    Get all categories
    """
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM category ORDER BY id;")
    categories = cursor.fetchall()
    conn.close()
    return categories
