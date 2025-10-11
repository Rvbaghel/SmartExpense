from config.db import get_connection
import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def create_earning_table():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS earning (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            amount NUMERIC(12,2) NOT NULL,
            earning_date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)


    conn.commit()
    conn.close()


def exist_month_year_user(user_id, date):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT COUNT(*) FROM earning WHERE user_id = %s 
        AND EXTRACT(MONTH FROM earning_date) = EXTRACT(MONTH FROM %s::DATE)
        AND EXTRACT(YEAR FROM earning_date) = EXTRACT(YEAR FROM %s::DATE);""",
        (user_id, date, date)
    )
    result = cursor.fetchone()
    print(date, result)
    
    count = result["count"] if True else False

    cursor.close()
    conn.close()

    return count


def update_month_year_earning(user_id, amount, earning_date):
    """
    Update the earning amount for a given user and date (month & year based).
    """
    try:
        amount = float(amount)
    except ValueError:
        raise ValueError("Amount must be a number")

    if isinstance(earning_date, str):
        try:
            earning_date = datetime.datetime.strptime(earning_date, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("earning_date must be in YYYY-MM-DD format")

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute(
            """
            UPDATE earning 
            SET amount = %s 
            WHERE user_id = %s
              AND EXTRACT(MONTH FROM earning_date) = EXTRACT(MONTH FROM %s::DATE)
              AND EXTRACT(YEAR FROM earning_date) = EXTRACT(YEAR FROM %s::DATE)
            RETURNING id, user_id, amount, earning_date;
            """,
            (amount, user_id, earning_date, earning_date)
        )
        result = cursor.fetchone()
        conn.commit()
        return result

    except psycopg2.Error as e:
        conn.rollback()
        raise Exception(f"Database error while updating earning: {str(e)}")
    finally:
        conn.close()



def insert_earning(user_id, amount, earning_date):
    """
    Insert a earning record and return the inserted earning row
    """

    try:
        amount = float(amount)
    except ValueError:
        raise ValueError("Amount must be a number")

    if isinstance(earning_date, str):
        try:
            earning_date = datetime.datetime.strptime(earning_date, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("earning_date must be in YYYY-MM-DD format")

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute(
            """
            INSERT INTO earning (user_id, amount, earning_date)
            VALUES (%s, %s, %s)
            RETURNING id, user_id, amount, earning_date, created_at;
            """,
            (user_id, amount, earning_date)
        )
        result = cursor.fetchone()
        conn.commit()
        return result  
    except psycopg2.Error as e:
        conn.rollback()
        raise Exception(f"Database error while inserting earning: {str(e)}")
    finally:
        conn.close()


def get_salaries_by_user(user_id):
    """Fetch all earnings for a user ordered by date."""
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("""
        SELECT * FROM earning
        WHERE user_id = %s
        ORDER BY earning_date DESC;
    """, (user_id,))
    data = cursor.fetchall()
    conn.close()
    return data

def get_salaries_by_user_year(user_id, year):
    """Fetch earnings for a specific month & year."""
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("""
        SELECT * FROM earning
        WHERE user_id = %s
          AND EXTRACT(YEAR FROM earning_date) = %s
        ORDER BY earning_date DESC;
    """, (user_id, year))
    data = cursor.fetchall()
    conn.close()
    return data

def get_salaries_by_user_month_year(user_id, month, year):
    """Fetch earnings for a specific month & year."""
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("""
        SELECT * FROM earning
        WHERE user_id = %s
          AND EXTRACT(MONTH FROM earning_date) = %s
          AND EXTRACT(YEAR FROM earning_date) = %s
        ORDER BY earning_date DESC;
    """, (user_id, month, year))
    data = cursor.fetchall()
    conn.close()
    return data


def get_salaries_by_user_month_year(user_id, month, year):
    """
    Get all salaries for a user ordered by earning_date desc
    """
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        """
            SELECT * FROM earning WHERE user_id = %s
            AND EXTRACT(MONTH FROM earning_date) = %s
            AND EXTRACT(YEAR FROM earning_date) = %s 
            ORDER BY earning_date DESC""",
        (user_id,month, year)
    )
    salaries = cursor.fetchall()
    conn.close()
    return salaries


def delete_salaries(user_id):
    """
    Delete all salaries for a user
    """
    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
            "DELETE FROM earning where user_id = %s",
            (user_id)
        )
        conn.commit()
        return "Deleted Successfully"
    except psycopg2.Error as e:
        conn.rollback()
        raise Exception(f"Database error while deleting user earning: {str(e)}")
    finally:
        conn.close()
