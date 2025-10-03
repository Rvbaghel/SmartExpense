import psycopg2
import os
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor

load_dotenv()
DATABASE_URL = os.getenv("DB_URL") or "postgresql://vishal:lNM5bZ3kBS8WzSIpkYhLpnE7vGvIyP2A@dpg-d39atder433s73850ijg-a.oregon-postgres.render.com/salary_op8c"

def get_connection():
    conn = psycopg2.connect(DATABASE_URL, sslmode='require', cursor_factory=RealDictCursor)
    return conn
