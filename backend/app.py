from flask import Flask
from flask_cors import CORS
from routers.auth_routes import auth_bp

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # or 3000 if using CRA

# Register Blueprints (routers)
app.register_blueprint(auth_bp, url_prefix="/auth")

if __name__ == "__main__":
    app.run(debug=True)