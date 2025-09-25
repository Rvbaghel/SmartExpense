from flask import Blueprint, jsonify, request
from models.category_model import (
    create_category_table,
    insert_default_categories,
    insert_category,
    get_all_categories
)

# Create Blueprint
category_bp = Blueprint("category", __name__, url_prefix="/category")

# Ensure table + default data exist when server starts
create_category_table()
insert_default_categories()


@category_bp.route("/all", methods=["GET"])
def all_categories():
    """
    Get all categories
    """
    try:
        categories = get_all_categories()
        return jsonify({"success": True, "categories": categories}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@category_bp.route("/add", methods=["POST"])
def add_category():
    """
    Add a new category
    """
    try:
        data = request.get_json()
        name = data.get("name")

        if not name:
            return jsonify({"success": False, "error": "Category name is required"}), 400

        category = insert_category(name)
        return jsonify({"success": True, "category": category}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
