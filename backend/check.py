from config.db import get_connection

def check_user_exists(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM users WHERE id = %s;", (user_id,))
        user = cursor.fetchone()
        if user:
            print(f"User exists: {user}")
            return True
        else:
            print(f"No user found with id {user_id}")
            return False
    finally:
        conn.close()

# Example usage
check_user_exists(34)
