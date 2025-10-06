from config.db import get_connection

def create_users_table():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(100) UNIQUE NOT NULL,
            username VARCHAR(50) NOT NULL,
            phone VARCHAR(20),
            password VARCHAR(50) NOT NULL,
            bio TEXT
        );
    """)
    conn.commit()
    conn.close()

def insert_user(email, username, phone, password, bio):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (email, username, phone, password, bio) VALUES (%s, %s, %s, %s, %s) RETURNING id;",
            (email, username, phone, password, bio)
        )
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        if result:
            return result[0]  # return user id
        else:
            print("Insert user error: No ID returned")
            return None

    except Exception as e:
        print("Insert user error:", e)
        return None
    
def find_all_users():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    user = cursor.fetchall()
    print(user)
    conn.close()
    return user

def find_user_by_email(email):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email=%s;", (email,))
    user = cursor.fetchone()
    conn.close()
    return user

def find_user_by_email_and_password(email, password):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email=%s AND password=%s;", (email, password))
    user = cursor.fetchone()
    conn.close()
    return user
