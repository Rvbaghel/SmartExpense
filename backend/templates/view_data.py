# dashboard/page1_data_view.py
import streamlit as st
import pandas as pd
from sqlalchemy import create_engine, text

# ---------- DATABASE CONNECTION ----------
DB_USER = "root"        # your MySQL username
DB_PASSWORD = ""        # your MySQL password
DB_HOST = "localhost"
DB_NAME = "salary_manage"

engine = create_engine(f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}")

# ---------- STREAMLIT APP ----------
st.set_page_config(page_title="Salary Data Viewer", layout="wide")

st.title("📊 Salary Management - Expense Records")

# ---------- Load Data ----------
def load_data():
    query = text("SELECT * FROM expense ORDER BY id DESC LIMIT 31")
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)
    # Ensure date column is datetime
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
    return df

try:
    df = load_data()

    if df.empty:
        st.warning("No records found in the expense table.")
    else:
        # Show summary
        st.subheader("Expense Data (Latest 10–31 Records)")
        st.dataframe(df, use_container_width=True)

        # Optional: Filter by date/month if column exists
        if "date" in df.columns:
            months = df["date"].dt.to_period("M").unique()
            selected_month = st.selectbox("📅 Filter by Month", months)
            filtered_df = df[df["date"].dt.to_period("M") == selected_month]
            st.dataframe(filtered_df, use_container_width=True)

except Exception as e:
    st.error(f"Error fetching data: {e}")

hide_streamlit_style = """
    <style>
    #MainMenu {visibility: hidden;}     /* Hides the 3 dots (hamburger menu) */
    footer {visibility: hidden;}        /* Hides the footer "Made with Streamlit" */
    .stDeployButton {display: none;}    /* Hides the Deploy button */
    </style>
"""
st.markdown(hide_streamlit_style, unsafe_allow_html=True)
if st.button("Go to Dashboard"):
    st.switch_page("pages/dashboardtem.py")
