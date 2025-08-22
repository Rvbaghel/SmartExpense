import streamlit as st
import pandas as pd
from sqlalchemy import create_engine, text
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import warnings

warnings.filterwarnings('ignore')

# ---------- CONFIGURATION ----------
st.set_page_config(
    page_title="Salary Management Dashboard",
    page_icon="💰",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ---------- CUSTOM CSS FOR RESPONSIVE UI ----------
st.markdown("""
<style>
    /* Main container styling */
    .main > div {
        padding: 1rem 2rem;
    }
    
    /* Metric cards styling */
    .metric-container {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1.5rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin: 0.5rem 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .metric-value {
        font-size: 2.5rem;
        font-weight: bold;
        margin: 0;
    }
    
    .metric-label {
        font-size: 1rem;
        opacity: 0.9;
        margin: 0;
    }
    
    /* Chart containers */
    .chart-container {
        background: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin: 1rem 0;
    }
    
    /* Sidebar styling */
    .sidebar .sidebar-content {
        background: #f8f9fa;
    }
    
    /* Hide Streamlit branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    .stDeployButton {display: none;}
    header {visibility: hidden;}
    
    /* Responsive design */
    @media (max-width: 768px) {
        .main > div {
            padding: 1rem;
        }
        .metric-value {
            font-size: 2rem;
        }
    }
</style>
""", unsafe_allow_html=True)

# ---------- DATABASE CONNECTION ----------
@st.cache_resource
def init_connection():
    """Initialize database connection with caching"""
    try:
        DB_USER = "root"
        DB_PASSWORD = ""  # Add your MySQL password here
        DB_HOST = "localhost"
        DB_NAME = "salary_manage"
        
        engine = create_engine(
            f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}",
            pool_pre_ping=True,
            pool_recycle=300
        )
        return engine
    except Exception as e:
        st.error(f"Database connection failed: {e}")
        return None

# ---------- DATA LOADING FUNCTIONS ----------
@st.cache_data(ttl=300)  # Cache for 5 minutes
def load_expense_data():
    """Load expense data with caching"""
    engine = init_connection()
    if engine is None:
        return pd.DataFrame()
    
    try:
        query = text("SELECT * FROM expense ORDER BY date ASC")
        with engine.connect() as conn:
            df = pd.read_sql(query, conn)
        
        # Data cleaning and preprocessing
        if not df.empty and "date" in df.columns:
            df["date"] = pd.to_datetime(df["date"], errors="coerce")
            df = df.dropna(subset=["date", "amount"])
            df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
            df = df.dropna(subset=["amount"])
            
            # Add derived columns
            df["month"] = df["date"].dt.to_period("M")
            df["weekday"] = df["date"].dt.day_name()
            df["week"] = df["date"].dt.isocalendar().week
            
        return df
    except Exception as e:
        st.error(f"Error loading data: {e}")
        return pd.DataFrame()

# ---------- HELPER FUNCTIONS ----------
def create_metric_card(title, value, delta=None):
    """Create a custom metric card"""
    delta_html = ""
    if delta:
        color = "green" if delta > 0 else "red"
        delta_html = f'<p style="color: {color}; margin: 0.5rem 0 0 0; font-size: 0.9rem;">{"↑" if delta > 0 else "↓"} {abs(delta):.1f}% from last period</p>'
    
    st.markdown(f"""
    <div class="metric-container">
        <p class="metric-value">{value}</p>
        <p class="metric-label">{title}</p>
        {delta_html}
    </div>
    """, unsafe_allow_html=True)

def format_currency(amount):
    """Format currency with Indian formatting"""
    return f"₹{amount:,.2f}"

# ---------- MAIN APPLICATION ----------
def main():
    # Header
    st.title("💰 Salary Management Dashboard")
    st.markdown("---")
    
    # Sidebar filters
    st.sidebar.header("📊 Filters & Controls")
    
    # Load data
    with st.spinner("Loading data..."):
        df = load_expense_data()
    
    if df.empty:
        st.error("❌ No data available. Please check your database connection and ensure the expense table has data.")
        return
    
    # Date range filter
    if not df.empty:
        min_date = df["date"].min().date()
        max_date = df["date"].max().date()
        
        date_range = st.sidebar.date_input(
            "Select Date Range",
            value=(min_date, max_date),
            min_value=min_date,
            max_value=max_date
        )
        
        # Filter data based on date range
        if len(date_range) == 2:
            start_date, end_date = date_range
            df_filtered = df[(df["date"].dt.date >= start_date) & (df["date"].dt.date <= end_date)]
        else:
            df_filtered = df
        
        # Category filter
        if "description" in df_filtered.columns:
            categories = ["All"] + sorted(df_filtered["description"].unique().tolist())
            selected_category = st.sidebar.selectbox("Select Category", categories)
            
            if selected_category != "All":
                df_filtered = df_filtered[df_filtered["description"] == selected_category]
    
    # Key Metrics Row
    st.subheader("📈 Key Metrics")
    
    if not df_filtered.empty:
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            total_expense = df_filtered["amount"].sum()
            create_metric_card("Total Expenses", format_currency(total_expense))
        
        with col2:
            avg_daily = df_filtered.groupby("date")["amount"].sum().mean()
            create_metric_card("Avg Daily Spend", format_currency(avg_daily))
        
        with col3:
            max_expense = df_filtered["amount"].max()
            create_metric_card("Highest Expense", format_currency(max_expense))
        
        with col4:
            transaction_count = len(df_filtered)
            create_metric_card("Total Transactions", str(transaction_count))
    
    st.markdown("---")
    
    # Charts Section
    tab1, tab2, tab3, tab4 = st.tabs(["📊 Overview", "📈 Trends", "🥧 Categories", "📋 Data Table"])
    
    with tab1:
        if not df_filtered.empty:
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("💸 Daily Expense Trend")
                daily_expenses = df_filtered.groupby("date")["amount"].sum().reset_index()
                
                fig = px.line(
                    daily_expenses, 
                    x="date", 
                    y="amount",
                    title="Daily Spending Pattern",
                    labels={"amount": "Amount (₹)", "date": "Date"}
                )
                fig.update_layout(height=400, showlegend=False)
                st.plotly_chart(fig, use_container_width=True)
            
            with col2:
                st.subheader("📊 Monthly Summary")
                monthly_data = df_filtered.groupby("month")["amount"].sum().reset_index()
                monthly_data["month_str"] = monthly_data["month"].astype(str)
                
                fig = px.bar(
                    monthly_data,
                    x="month_str",
                    y="amount",
                    title="Monthly Expenses",
                    labels={"amount": "Amount (₹)", "month_str": "Month"}
                )
                fig.update_layout(height=400, showlegend=False)
                st.plotly_chart(fig, use_container_width=True)
    
    with tab2:
        if not df_filtered.empty:
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("📅 Spending by Day of Week")
                weekday_data = df_filtered.groupby("weekday")["amount"].sum().reset_index()
                weekday_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                weekday_data["weekday"] = pd.Categorical(weekday_data["weekday"], categories=weekday_order, ordered=True)
                weekday_data = weekday_data.sort_values("weekday")
                
                fig = px.bar(
                    weekday_data,
                    x="weekday",
                    y="amount",
                    title="Spending Pattern by Weekday",
                    labels={"amount": "Amount (₹)", "weekday": "Day of Week"}
                )
                fig.update_layout(height=400)
                st.plotly_chart(fig, use_container_width=True)
            
            with col2:
                st.subheader("📈 Cumulative Spending")
                daily_expenses = df_filtered.groupby("date")["amount"].sum().reset_index()
                daily_expenses["cumulative"] = daily_expenses["amount"].cumsum()
                
                fig = px.area(
                    daily_expenses,
                    x="date",
                    y="cumulative",
                    title="Cumulative Expense Growth",
                    labels={"cumulative": "Cumulative Amount (₹)", "date": "Date"}
                )
                fig.update_layout(height=400)
                st.plotly_chart(fig, use_container_width=True)
    
    with tab3:
        if not df_filtered.empty and "description" in df_filtered.columns:
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("🥧 Expense Distribution")
                category_data = df_filtered.groupby("description")["amount"].sum().reset_index()
                
                fig = px.pie(
                    category_data,
                    values="amount",
                    names="description",
                    title="Expense Breakdown by Category"
                )
                fig.update_layout(height=500)
                st.plotly_chart(fig, use_container_width=True)
            
            with col2:
                st.subheader("🏆 Top 10 Categories")
                top_categories = df_filtered.groupby("description")["amount"].sum().nlargest(10).reset_index()
                
                fig = px.bar(
                    top_categories,
                    x="amount",
                    y="description",
                    orientation="h",
                    title="Top Spending Categories",
                    labels={"amount": "Amount (₹)", "description": "Category"}
                )
                fig.update_layout(height=500)
                st.plotly_chart(fig, use_container_width=True)
    
    with tab4:
        st.subheader("📋 Transaction Details")
        
        # Add search functionality
        search_term = st.text_input("🔍 Search transactions", placeholder="Enter description or amount...")
        
        display_df = df_filtered.copy()
        if search_term:
            mask = (
                display_df["description"].str.contains(search_term, case=False, na=False) |
                display_df["amount"].astype(str).str.contains(search_term, na=False)
            )
            display_df = display_df[mask]
        
        # Format the dataframe for display
        if not display_df.empty:
            display_df_formatted = display_df.copy()
            display_df_formatted["amount"] = display_df_formatted["amount"].apply(format_currency)
            display_df_formatted["date"] = display_df_formatted["date"].dt.strftime("%Y-%m-%d")
            
            st.dataframe(
                display_df_formatted[["date", "description", "amount"]],
                use_container_width=True,
                hide_index=True
            )
            
            # Download button
            csv = display_df.to_csv(index=False)
            st.download_button(
                label="📥 Download Data as CSV",
                data=csv,
                file_name=f"expense_data_{datetime.now().strftime('%Y%m%d')}.csv",
                mime="text/csv"
            )
        else:
            st.info("No transactions found matching your search criteria.")
    
    # Footer
    st.markdown("---")
    st.markdown(
        """
        <div style="text-align: center; color: #666; padding: 1rem;">
            💡 <b>Tips:</b> Use the sidebar filters to analyze specific time periods or categories. 
            Track your spending patterns to make better financial decisions!
        </div>
        """,
        unsafe_allow_html=True
    )

if __name__ == "__main__":
    main()