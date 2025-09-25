from flask import Flask
from flask_cors import CORS
from routers.auth_routes import auth_bp
from routers.salary_routes import salary_bp
from routers.category_routes import category_bp
from routers.expense_router import expense_bp
from routers.dashboard_routes import dashboard_bp
import os

app = Flask(__name__)

# Enable CORS for your frontend (Vercel URL or localhost for dev)
CORS(app, origins=["https://smart-expense-beta.vercel.app", "http://localhost:5173"], supports_credentials=True)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(salary_bp, url_prefix="/salary")
app.register_blueprint(category_bp, url_prefix="/category")
app.register_blueprint(expense_bp)
app.register_blueprint(dashboard_bp)

# Root route (optional)
@app.route("/")
def index():
    return {"message": "Smart Expense Backend is running!"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Use Render's PORT
    app.run(host="0.0.0.0", port=port)
