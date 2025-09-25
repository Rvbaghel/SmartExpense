import traceback
from flask import Blueprint, request, jsonify
from backend.models.users_model import create_users_table, insert_user, find_user_by_email_and_password
from config.db import get_connection
from psycopg2.extras import RealDictCursor

auth_bp = Blueprint("auth", __name__)

# Ensure table exists when routes are imported
create_users_table()


@auth_bp.route("/profile/<int:user_id>", methods=["GET"])
def profile(user_id):
    conn = get_connection()
    # Use RealDictCursor if not already
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        "SELECT id, email, username, phone, bio FROM users WHERE id = %s;",
        (user_id,)
    )
    user = cursor.fetchone()
    conn.close()

    if user:
        # Access fields by keys, not by index
        return jsonify({
            "id": user["id"],
            "email": user["email"],
            "username": user["username"],
            "phone": user["phone"],
            "bio": user["bio"]
        })

    return jsonify({"error": "User not found"}), 404

@auth_bp.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Required fields
        email = data.get("email")
        username = data.get("username")
        password = data.get("password")

        # Optional fields
        phone = data.get("phone", "")
        bio = data.get("bio", "")

        if not email or not username or not password:
            return jsonify({"error": "Email, username, and password are required"}), 400

        # Insert user safely using your model function
        from models.users_model import insert_user, find_user_by_email

        # Check if user already exists
        if find_user_by_email(email):
            return jsonify({"error": "User with this email already exists"}), 400

        user_id = insert_user(email, username, phone, password, bio)
        if not user_id:
            return jsonify({"error": "Failed to create user"}), 500

        return jsonify({
            "message": "User created successfully",
            "user": {
                "id": user_id,
                "email": email,
                "username": username,
                "phone": phone,
                "bio": bio
            }
        }), 201

    except Exception as e:
        print("Signup error:", e)
        traceback.print_exc()
        return jsonify({"error": "Server error"}), 500
    
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = find_user_by_email_and_password(email, password)
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        # If user is a dict (RealDictCursor), map it safely
        if isinstance(user, dict):
            user_dict = {k: v for k, v in user.items() if k != "password"}  # hide password
        else:
            # If tuple, map manually
            user_dict = {
                "id": user[0],
                "email": user[1],
                "username": user[2],
                "phone": user[3],
                "bio": user[5]
            }

        return jsonify({"message": "Login successful", "user": user_dict}), 200

    except Exception as e:
        import traceback
        print("Login error:", e)
        traceback.print_exc()
        return jsonify({"error": "Server error"}), 500
