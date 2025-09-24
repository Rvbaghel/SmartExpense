import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = "postgresql://vishal:lNM5bZ3kBS8WzSIpkYhLpnE7vGvIyP2A@dpg-d39atder433s73850ijg-a.oregon-postgres.render.com/salary_op8c"

def get_connection():
    conn = psycopg2.connect(DATABASE_URL, sslmode='require', cursor_factory=RealDictCursor)
    return conn
