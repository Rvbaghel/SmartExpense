from config.db import get_connection
import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def create_salary_table():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS salary (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            amount NUMERIC(12,2) NOT NULL,
            salary_date DATE NOT NULL,
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
        SELECT COUNT(*) FROM salary WHERE user_id = %s 
        AND EXTRACT(MONTH FROM salary_date) = EXTRACT(MONTH FROM %s::DATE)
        AND EXTRACT(YEAR FROM salary_date) = EXTRACT(YEAR FROM %s::DATE);""",
        (user_id, date, date)
    )
    result = cursor.fetchone()
    print(date, result)
    
    count = result["count"] if True else False

    cursor.close()
    conn.close()

    return count


def update_month_year_salary(user_id, amount, salary_date):
    """
    Update the salary amount for a given user and date (month & year based).
    """
    try:
        amount = float(amount)
    except ValueError:
        raise ValueError("Amount must be a number")

    if isinstance(salary_date, str):
        try:
            salary_date = datetime.datetime.strptime(salary_date, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("salary_date must be in YYYY-MM-DD format")

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute(
            """
            UPDATE salary 
            SET amount = %s 
            WHERE user_id = %s
              AND EXTRACT(MONTH FROM salary_date) = EXTRACT(MONTH FROM %s::DATE)
              AND EXTRACT(YEAR FROM salary_date) = EXTRACT(YEAR FROM %s::DATE)
            RETURNING id, user_id, amount, salary_date;
            """,
            (amount, user_id, salary_date, salary_date)
        )
        result = cursor.fetchone()
        conn.commit()
        return result

    except psycopg2.Error as e:
        conn.rollback()
        raise Exception(f"Database error while updating salary: {str(e)}")
    finally:
        conn.close()



def insert_salary(user_id, amount, salary_date):
    """
    Insert a salary record and return the inserted salary row
    """

    try:
        amount = float(amount)
    except ValueError:
        raise ValueError("Amount must be a number")

    if isinstance(salary_date, str):
        try:
            salary_date = datetime.datetime.strptime(salary_date, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("salary_date must be in YYYY-MM-DD format")

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute(
            """
            INSERT INTO salary (user_id, amount, salary_date)
            VALUES (%s, %s, %s)
            RETURNING id, user_id, amount, salary_date, created_at;
            """,
            (user_id, amount, salary_date)
        )
        result = cursor.fetchone()
        conn.commit()
        return result  
    except psycopg2.Error as e:
        conn.rollback()
        raise Exception(f"Database error while inserting salary: {str(e)}")
    finally:
        conn.close()


def get_salaries_by_user(user_id):
    """
    Get all salaries for a user ordered by salary_date desc
    """
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        "SELECT * FROM salary WHERE user_id = %s ORDER BY salary_date DESC;",
        (user_id,)
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
            "DELETE FROM salary where user_id = %s",
            (user_id)
        )
        conn.commit()
        return "Deleted Successfully"
    except psycopg2.Error as e:
        conn.rollback()
        raise Exception(f"Database error while deleting user salary: {str(e)}")
    finally:
        conn.close()
