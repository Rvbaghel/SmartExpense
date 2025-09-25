from flask import Flask
from flask_cors import CORS
from routers.auth_routes import auth_bp
from routers.salary_routes import salary_bp
from routers.category_routes import category_bp   # 👈 import category routes
from routers.expense_router import expense_bp
from routers.dashboard_routes import dashboard_bp



app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"],supports_credentials=True)  # change port if needed

# ✅ Register Blueprints (routers)
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(salary_bp, url_prefix="/salary")
app.register_blueprint(category_bp, url_prefix="/category")   # 👈 register here
app.register_blueprint(expense_bp)
app.register_blueprint(dashboard_bp)

if __name__ == "__main__":
    app.run(debug=True)
