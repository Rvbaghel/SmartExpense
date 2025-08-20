from flask import Flask
from utils.database import db
# from routers.expense_routes import expense_bp
import config
from routers.expense_routes import expense_bp
from routers.salary_routes import salary_bp
from routers.auth_routes import auth_bp
def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(config.Config)

    # Initialize database
    db.init_app(app)

    # Register blueprints (routes)
    app.register_blueprint(expense_bp, url_prefix="/api/expenses")
    app.register_blueprint(salary_bp, url_prefix="/api/salary")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    @app.route("/")
    def home():
        return {"message": "Welcome to Salary Management API"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
