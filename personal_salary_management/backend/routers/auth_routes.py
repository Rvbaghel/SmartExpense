from flask import Blueprint, request, jsonify
from utils.database import db
from model import User

auth_bp = Blueprint("auth", __name__)

# Temporary user registration (no login/signup, just personal info)
@auth_bp.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()
    name = data.get("name")
    occupation = data.get("occupation")
    bio = data.get("bio")

    if not name:
        return jsonify({"error": "Name is required"}), 400

    user = User(name=name, occupation=occupation, bio=bio)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "occupation": user.occupation,
            "bio": user.bio
        }
    }), 201


# Fetch all registered users (for testing)
@auth_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    result = [
        {"id": u.id, "name": u.name, "occupation": u.occupation, "bio": u.bio}
        for u in users
    ]
    return jsonify(result)
