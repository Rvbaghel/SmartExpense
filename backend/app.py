from flask import Flask
from flask_cors import CORS
from routers.auth_routes import auth_bp
from routers.salary_routes import salary_bp
from routers.category_routes import category_bp
from routers.expense_router import expense_bp
from routers.dashboard_routes import dashboard_bp

app = Flask(__name__)

# ✅ Update CORS to allow your deployed frontend
CORS(app, origins=["http://localhost:5173", "https://smart-expense-beta.vercel.app"], supports_credentials=True)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(salary_bp, url_prefix="/salary")
app.register_blueprint(category_bp, url_prefix="/category")
app.register_blueprint(expense_bp)
app.register_blueprint(dashboard_bp)

if __name__ == "__main__":
    app.run(debug=True)
