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
    page_title="💰 Personal Salary Manager - Dashboard",
    page_icon="💰",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ---------- THEME-MATCHING CSS ----------
st.markdown("""
<style>
    /* Import Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    /* CSS Variables for Theme */
    :root {
        --primary-color: #238be6;
        --secondary-color: #21d4a7;
        --dark-bg: #0d1117;
        --dark-card-bg: #161b22;
        --dark-border: #30363d;
        --dark-text: #f0f6fc;
        --dark-muted: #8b949e;
        --light-bg: #ffffff;
        --light-card-bg: #f8f9fa;
        --light-border: #dee2e6;
        --light-text: #212529;
        --light-muted: #6c757d;
    }

    /* Dark Theme (Default) */
    .stApp {
        background-color: var(--dark-bg);
        color: var(--dark-text);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Light Theme */
    .light-theme .stApp {
        background-color: var(--light-bg);
        color: var(--light-text);
    }

    /* Header Styling */
    .main-header {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        padding: 2rem 0;
        margin: -1rem -2rem 2rem -2rem;
        text-align: center;
        border-radius: 0 0 20px 20px;
        box-shadow: 0 4px 20px rgba(35, 139, 230, 0.2);
    }

    .main-header h1 {
        color: white;
        margin: 0;
        font-weight: 800;
        font-size: 2.5rem;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .main-header p {
        color: rgba(255, 255, 255, 0.9);
        margin: 0.5rem 0 0 0;
        font-size: 1.1rem;
        font-weight: 400;
    }

    /* Navigation Bar */
    .nav-bar {
        background: var(--dark-card-bg);
        border: 1px solid var(--dark-border);
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .nav-links {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .nav-link {
        background: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }

    .nav-link:hover {
        background: var(--secondary-color);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(35, 139, 230, 0.3);
    }

    .theme-toggle {
        background: var(--dark-card-bg);
        border: 2px solid var(--dark-border);
        color: var(--dark-text);
        padding: 0.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1.1rem;
    }

    /* Enhanced Metric Cards */
    .metric-card {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        padding: 1.5rem;
        border-radius: 12px;
        color: white;
        text-align: center;
        margin: 0.5rem 0;
        box-shadow: 0 8px 24px rgba(35, 139, 230, 0.15);
        position: relative;
        overflow: hidden;
    }

    .metric-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        transition: left 0.5s ease;
    }

    .metric-card:hover::before {
        left: 100%;
    }

    .metric-value {
        font-size: 2.2rem;
        font-weight: 700;
        margin: 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .metric-label {
        font-size: 0.9rem;
        opacity: 0.9;
        margin: 0.5rem 0 0 0;
        font-weight: 500;
    }

    .metric-delta {
        font-size: 0.8rem;
        margin-top: 0.5rem;
        font-weight: 600;
    }

    /* Chart Containers */
    .chart-container {
        background: var(--dark-card-bg);
        border: 1px solid var(--dark-border);
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin: 1rem 0;
        position: relative;
    }

    .chart-title {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--dark-text);
    }

    .chart-description {
        background: rgba(35, 139, 230, 0.1);
        border-left: 4px solid var(--primary-color);
        padding: 0.8rem;
        border-radius: 0 8px 8px 0;
        margin-bottom: 1rem;
        font-size: 0.9rem;
        line-height: 1.5;
        color: var(--dark-muted);
    }

    /* Sidebar Styling */
    .stSidebar > div {
        background: var(--dark-card-bg);
        border-right: 1px solid var(--dark-border);
    }

    .sidebar-content {
        padding: 1rem;
    }

    .filter-section {
        background: rgba(35, 139, 230, 0.05);
        border: 1px solid var(--dark-border);
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
    }

    .filter-title {
        font-weight: 600;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
    }

    /* Info Cards */
    .info-card {
        background: linear-gradient(135deg, rgba(33, 212, 167, 0.1) 0%, rgba(35, 139, 230, 0.1) 100%);
        border-left: 4px solid var(--secondary-color);
        padding: 1rem;
        border-radius: 0 8px 8px 0;
        margin: 1rem 0;
    }

    .info-card h4 {
        color: var(--secondary-color);
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
        font-weight: 600;
    }

    .info-card p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.4;
        color: var(--dark-muted);
    }

    /* Tab Styling */
    .stTabs [data-baseweb="tab-list"] {
        background: var(--dark-card-bg);
        border-radius: 8px;
        padding: 0.2rem;
        border: 1px solid var(--dark-border);
    }

    .stTabs [data-baseweb="tab"] {
        background: transparent;
        color: var(--dark-muted);
        border-radius: 6px;
        font-weight: 500;
    }

    .stTabs [data-baseweb="tab"][aria-selected="true"] {
        background: var(--primary-color);
        color: white;
    }

    /* Loading States */
    .loading-container {
        text-align: center;
        padding: 2rem;
        color: var(--dark-muted);
    }

    .loading-spinner {
        border: 3px solid rgba(35, 139, 230, 0.2);
        border-top: 3px solid var(--primary-color);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .main-header h1 {
            font-size: 2rem;
        }
        
        .metric-value {
            font-size: 1.8rem;
        }

        .nav-bar {
            flex-direction: column;
            gap: 1rem;
        }

        .nav-links {
            justify-content: center;
        }
    }

    /* Plotly Chart Styling */
    .js-plotly-plot {
        border-radius: 8px;
        overflow: hidden;
    }

    /* Success/Error States */
    .success-message {
        background: linear-gradient(135deg, rgba(33, 212, 167, 0.1) 0%, rgba(40, 167, 69, 0.1) 100%);
        border: 1px solid var(--secondary-color);
        color: var(--secondary-color);
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        font-weight: 500;
    }

    .error-message {
        background: linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(255, 107, 107, 0.1) 100%);
        border: 1px solid #dc3545;
        color: #dc3545;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        font-weight: 500;
    }

    /* Hide Streamlit Elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    .stDeployButton {display: none;}
    header {visibility: hidden;}
</style>
""", unsafe_allow_html=True)

# ---------- DATABASE CONNECTION ----------
@st.cache_resource
def init_connection():
    """Initialize database connection with caching"""
    try:
        DB_USER = "root"
        DB_PASSWORD = "3872"  # Add your MySQL password here
        DB_HOST = "localhost"
        DB_NAME = "salary"
        
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
            df["day_of_month"] = df["date"].dt.day
            df["hour"] = df["date"].dt.hour if 'time' in df.columns else 12
            
        return df
    except Exception as e:
        st.error(f"Error loading data: {e}")
        return pd.DataFrame()

# ---------- HELPER FUNCTIONS ----------
def create_metric_card(title, value, delta=None, icon="📊"):
    """Create an enhanced metric card with theme matching"""
    delta_html = ""
    if delta:
        color = "#21d4a7" if delta > 0 else "#ff6b6b"
        arrow = "↗" if delta > 0 else "↘"
        delta_html = f'<div class="metric-delta" style="color: {color};">{arrow} {abs(delta):.1f}% from last period</div>'
    
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-value">{icon} {value}</div>
        <div class="metric-label">{title}</div>
        {delta_html}
    </div>
    """, unsafe_allow_html=True)

def format_currency(amount):
    """Format currency with Indian formatting"""
    if amount >= 10000000:  # 1 crore
        return f"₹{amount/10000000:.2f}Cr"
    elif amount >= 100000:  # 1 lakh
        return f"₹{amount/100000:.2f}L"
    elif amount >= 1000:  # 1 thousand
        return f"₹{amount/1000:.1f}K"
    else:
        return f"₹{amount:,.0f}"

def create_chart_explanation(chart_type, description, use_case):
    """Create informative chart descriptions"""
    st.markdown(f"""
    <div class="chart-description">
        <strong>📊 {chart_type}:</strong> {description}<br>
        <strong>💡 Use Case:</strong> {use_case}
    </div>
    """, unsafe_allow_html=True)

def create_info_card(title, content):
    """Create an information card"""
    st.markdown(f"""
    <div class="info-card">
        <h4>{title}</h4>
        <p>{content}</p>
    </div>
    """, unsafe_allow_html=True)

# ---------- MAIN APPLICATION ----------
def main():
    # Header with matching theme
    st.markdown("""
    <div class="main-header">
        <h1>💰 Personal Salary Manager</h1>
        <p>Smart Financial Dashboard - Track, Analyze, Optimize</p>
    </div>
    """, unsafe_allow_html=True)

    # Navigation Bar
    st.markdown("""
    <div class="nav-bar">
        <div class="nav-links">
            <a href="/" class="nav-link">🏠 Home</a>
            <a href="/salary-input" class="nav-link">💰 Salary</a>
            <a href="/expenses" class="nav-link">📋 Expenses</a>
            <a href="/dashboard" class="nav-link">📊 Dashboard</a>
            <a href="/about" class="nav-link">ℹ️ About</a>
        </div>
        <div class="theme-toggle">🌙/☀️</div>
    </div>
    """, unsafe_allow_html=True)
    
    # Sidebar with enhanced styling
    with st.sidebar:
        st.markdown('<div class="sidebar-content">', unsafe_allow_html=True)
        st.markdown("## 🎛️ Dashboard Controls")
        
        # Load data with loading indicator
        with st.spinner("🔄 Loading your financial data..."):
            df = load_expense_data()
        
        if df.empty:
            st.markdown("""
            <div class="error-message">
                ❌ <strong>No Data Available</strong><br>
                Please check your database connection and ensure the expense table has data.
            </div>
            """, unsafe_allow_html=True)
            return

        # Enhanced Date Range Filter
        st.markdown('<div class="filter-section">', unsafe_allow_html=True)
        st.markdown('<div class="filter-title">📅 Date Range Filter</div>', unsafe_allow_html=True)
        
        min_date = df["date"].min().date()
        max_date = df["date"].max().date()
        
        date_range = st.date_input(
            "Select Analysis Period",
            value=(min_date, max_date),
            min_value=min_date,
            max_value=max_date,
            help="Choose the time period for your financial analysis"
        )
        st.markdown('</div>', unsafe_allow_html=True)

        # Filter data based on date range
        if len(date_range) == 2:
            start_date, end_date = date_range
            df_filtered = df[(df["date"].dt.date >= start_date) & (df["date"].dt.date <= end_date)]
        else:
            df_filtered = df

        # Enhanced Category Filter
        if "description" in df_filtered.columns:
            st.markdown('<div class="filter-section">', unsafe_allow_html=True)
            st.markdown('<div class="filter-title">🏷️ Category Filter</div>', unsafe_allow_html=True)
            
            categories = ["All Categories"] + sorted(df_filtered["description"].unique().tolist())
            selected_category = st.selectbox(
                "Select Expense Category",
                categories,
                help="Filter expenses by specific categories"
            )
            
            if selected_category != "All Categories":
                df_filtered = df_filtered[df_filtered["description"] == selected_category]
            
            st.markdown('</div>', unsafe_allow_html=True)

        # Data Summary
        if not df_filtered.empty:
            total_records = len(df_filtered)
            date_span = (df_filtered["date"].max() - df_filtered["date"].min()).days
            
            create_info_card(
                "📈 Data Summary",
                f"Analyzing {total_records:,} transactions over {date_span} days. "
                f"Average of {total_records/max(date_span, 1):.1f} transactions per day."
            )
        
        st.markdown('</div>', unsafe_allow_html=True)

    # Main Dashboard Content
    if not df_filtered.empty:
        # Key Metrics Section
        st.markdown("## 📊 Financial Overview")
        
        col1, col2, col3, col4 = st.columns(4)
        
        # Calculate metrics
        total_expense = df_filtered["amount"].sum()
        avg_daily = df_filtered.groupby("date")["amount"].sum().mean()
        max_expense = df_filtered["amount"].max()
        transaction_count = len(df_filtered)
        
        # Calculate trends (if we have enough data)
        trend_data = None
        if len(df_filtered) > 30:  # Need sufficient data for trends
            recent_data = df_filtered.tail(15)
            older_data = df_filtered.iloc[-30:-15] if len(df_filtered) >= 30 else df_filtered.iloc[:-15]
            
            if not older_data.empty:
                recent_avg = recent_data["amount"].mean()
                older_avg = older_data["amount"].mean()
                trend_data = ((recent_avg - older_avg) / older_avg * 100) if older_avg > 0 else 0

        with col1:
            create_metric_card("Total Expenses", format_currency(total_expense), trend_data, "💸")
        
        with col2:
            create_metric_card("Daily Average", format_currency(avg_daily), None, "📅")
        
        with col3:
            create_metric_card("Highest Expense", format_currency(max_expense), None, "🏆")
        
        with col4:
            create_metric_card("Transactions", f"{transaction_count:,}", None, "🧾")

        st.markdown("---")

        # Enhanced Charts Section
        tab1, tab2, tab3, tab4, tab5 = st.tabs([
            "📊 Overview", "📈 Trends", "🥧 Categories", "📊 Advanced Analytics", "📋 Data Explorer"
        ])

        with tab1:
            st.markdown("### 📊 Financial Overview Dashboard")
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                st.markdown('<div class="chart-title">💸 Daily Expense Trend</div>', unsafe_allow_html=True)
                
                create_chart_explanation(
                    "Line Chart",
                    "Shows your daily spending patterns over time",
                    "Identify spending spikes, track daily habits, and spot unusual expenses"
                )
                
                daily_expenses = df_filtered.groupby("date")["amount"].sum().reset_index()
                
                fig = px.line(
                    daily_expenses, 
                    x="date", 
                    y="amount",
                    title="",
                    labels={"amount": "Amount (₹)", "date": "Date"}
                )
                fig.update_layout(
                    height=400, 
                    showlegend=False,
                    paper_bgcolor="rgba(0,0,0,0)",
                    plot_bgcolor="rgba(0,0,0,0)",
                    font=dict(color="#f0f6fc"),
                    xaxis=dict(gridcolor="rgba(48,54,61,0.5)"),
                    yaxis=dict(gridcolor="rgba(48,54,61,0.5)")
                )
                fig.update_traces(line_color="#238be6", line_width=3)
                st.plotly_chart(fig, use_container_width=True)
                st.markdown('</div>', unsafe_allow_html=True)
            
            with col2:
                st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                st.markdown('<div class="chart-title">📊 Monthly Expense Summary</div>', unsafe_allow_html=True)
                
                create_chart_explanation(
                    "Bar Chart",
                    "Compares your monthly spending totals",
                    "Track monthly budgets, identify high-spending months, and plan future expenses"
                )
                
                monthly_data = df_filtered.groupby("month")["amount"].sum().reset_index()
                monthly_data["month_str"] = monthly_data["month"].astype(str)
                
                fig = px.bar(
                    monthly_data,
                    x="month_str",
                    y="amount",
                    title="",
                    labels={"amount": "Amount (₹)", "month_str": "Month"}
                )
                fig.update_layout(
                    height=400, 
                    showlegend=False,
                    paper_bgcolor="rgba(0,0,0,0)",
                    plot_bgcolor="rgba(0,0,0,0)",
                    font=dict(color="#f0f6fc"),
                    xaxis=dict(gridcolor="rgba(48,54,61,0.5)"),
                    yaxis=dict(gridcolor="rgba(48,54,61,0.5)")
                )
                fig.update_traces(marker_color="#21d4a7")
                st.plotly_chart(fig, use_container_width=True)
                st.markdown('</div>', unsafe_allow_html=True)

        with tab2:
            st.markdown("### 📈 Advanced Trend Analysis")
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                st.markdown('<div class="chart-title">📅 Weekly Spending Pattern</div>', unsafe_allow_html=True)
                
                create_chart_explanation(
                    "Bar Chart by Weekday",
                    "Shows which days of the week you spend the most",
                    "Optimize weekly budgets, identify weekend vs weekday patterns"
                )
                
                weekday_data = df_filtered.groupby("weekday")["amount"].sum().reset_index()
                weekday_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                weekday_data["weekday"] = pd.Categorical(weekday_data["weekday"], categories=weekday_order, ordered=True)
                weekday_data = weekday_data.sort_values("weekday")
                
                fig = px.bar(
                    weekday_data,
                    x="weekday",
                    y="amount",
                    title="",
                    labels={"amount": "Amount (₹)", "weekday": "Day of Week"}
                )
                fig.update_layout(
                    height=400,
                    paper_bgcolor="rgba(0,0,0,0)",
                    plot_bgcolor="rgba(0,0,0,0)",
                    font=dict(color="#f0f6fc")
                )
                fig.update_traces(marker_color="#238be6")
                st.plotly_chart(fig, use_container_width=True)
                st.markdown('</div>', unsafe_allow_html=True)
            
            with col2:
                st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                st.markdown('<div class="chart-title">📈 Cumulative Expense Growth</div>', unsafe_allow_html=True)
                
                create_chart_explanation(
                    "Area Chart",
                    "Shows how your expenses accumulate over time",
                    "Track total spending progress, identify acceleration periods"
                )
                
                daily_expenses = df_filtered.groupby("date")["amount"].sum().reset_index()
                daily_expenses["cumulative"] = daily_expenses["amount"].cumsum()
                
                fig = px.area(
                    daily_expenses,
                    x="date",
                    y="cumulative",
                    title="",
                    labels={"cumulative": "Cumulative Amount (₹)", "date": "Date"}
                )
                fig.update_layout(
                    height=400,
                    paper_bgcolor="rgba(0,0,0,0)",
                    plot_bgcolor="rgba(0,0,0,0)",
                    font=dict(color="#f0f6fc")
                )
                fig.update_traces(fill="tozeroy", fillcolor="rgba(33, 212, 167, 0.3)", line_color="#21d4a7")
                st.plotly_chart(fig, use_container_width=True)
                st.markdown('</div>', unsafe_allow_html=True)

        with tab3:
            st.markdown("### 🥧 Category-wise Analysis")
            
            if "description" in df_filtered.columns:
                col1, col2 = st.columns(2)
                
                with col1:
                    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                    st.markdown('<div class="chart-title">🥧 Expense Distribution</div>', unsafe_allow_html=True)
                    
                    create_chart_explanation(
                        "Pie Chart",
                        "Shows the percentage breakdown of your expenses by category",
                        "Identify major spending categories, balance your expense portfolio"
                    )
                    
                    category_data = df_filtered.groupby("description")["amount"].sum().reset_index()
                    
                    fig = px.pie(
                        category_data,
                        values="amount",
                        names="description",
                        title=""
                    )
                    fig.update_layout(
                        height=500,
                        paper_bgcolor="rgba(0,0,0,0)",
                        font=dict(color="#f0f6fc")
                    )
                    st.plotly_chart(fig, use_container_width=True)
                    st.markdown('</div>', unsafe_allow_html=True)
                
                with col2:
                    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                    st.markdown('<div class="chart-title">🏆 Top Spending Categories</div>', unsafe_allow_html=True)
                    
                    create_chart_explanation(
                        "Horizontal Bar Chart",
                        "Ranks your expense categories from highest to lowest spending",
                        "Focus on top categories for maximum savings impact"
                    )
                    
                    top_categories = df_filtered.groupby("description")["amount"].sum().nlargest(10).reset_index()
                    
                    fig = px.bar(
                        top_categories,
                        x="amount",
                        y="description",
                        orientation="h",
                        title="",
                        labels={"amount": "Amount (₹)", "description": "Category"}
                    )
                    fig.update_layout(
                        height=500,
                        paper_bgcolor="rgba(0,0,0,0)",
                        plot_bgcolor="rgba(0,0,0,0)",
                        font=dict(color="#f0f6fc")
                    )
                    fig.update_traces(marker_color="#21d4a7")
                    st.plotly_chart(fig, use_container_width=True)
                    st.markdown('</div>', unsafe_allow_html=True)

        with tab4:
            st.markdown("### 📊 Advanced Analytics")
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                st.markdown('<div class="chart-title">📊 Spending Distribution Analysis</div>', unsafe_allow_html=True)
                
                create_chart_explanation(
                    "Box Plot",
                    "Shows the statistical distribution of your daily expenses",
                    "Identify outliers, understand spending consistency, detect unusual patterns"
                )
                
                daily_expenses = df_filtered.groupby("date")["amount"].sum().reset_index()
                
                fig = px.box(
                    daily_expenses,
                    y="amount",
                    title="",
                    labels={"amount": "Daily Amount (₹)"}
                )
                fig.update_layout(
                    height=400,
                    paper_bgcolor="rgba(0,0,0,0)",
                    plot_bgcolor="rgba(0,0,0,0)",
                    font=dict(color="#f0f6fc"),
                    xaxis=dict(showgrid=False),
                    yaxis=dict(gridcolor="rgba(48,54,61,0.5)")
                )
                fig.update_traces(marker_color="#238be6", fillcolor="rgba(35, 139, 230, 0.3)")
                st.plotly_chart(fig, use_container_width=True)
                st.markdown('</div>', unsafe_allow_html=True)
            
            with col2:
                st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                st.markdown('<div class="chart-title">📈 Monthly Growth Rate</div>', unsafe_allow_html=True)
                
                create_chart_explanation(
                    "Line Chart with Growth Rate",
                    "Shows month-over-month percentage change in spending",
                    "Track spending trends, identify seasonal patterns, monitor financial discipline"
                )
                
                monthly_data = df_filtered.groupby("month")["amount"].sum().reset_index()
                monthly_data["growth_rate"] = monthly_data["amount"].pct_change() * 100
                monthly_data["month_str"] = monthly_data["month"].astype(str)
                
                fig = px.line(
                    monthly_data.dropna(),
                    x="month_str",
                    y="growth_rate",
                    title="",
                    labels={"growth_rate": "Growth Rate (%)", "month_str": "Month"},
                    markers=True
                )
                fig.update_layout(
                    height=400,
                    paper_bgcolor="rgba(0,0,0,0)",
                    plot_bgcolor="rgba(0,0,0,0)",
                    font=dict(color="#f0f6fc"),
                    xaxis=dict(gridcolor="rgba(48,54,61,0.5)"),
                    yaxis=dict(gridcolor="rgba(48,54,61,0.5)")
                )
                fig.update_traces(line_color="#21d4a7", marker_color="#21d4a7")
                fig.add_hline(y=0, line_dash="dash", line_color="rgba(255,255,255,0.5)")
                st.plotly_chart(fig, use_container_width=True)
                st.markdown('</div>', unsafe_allow_html=True)
            
            # Heatmap for spending patterns
            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
            st.markdown('<div class="chart-title">🔥 Spending Intensity Heatmap</div>', unsafe_allow_html=True)
            
            create_chart_explanation(
                "Heatmap",
                "Shows spending intensity by day of month and weekday",
                "Identify peak spending periods, optimize budget allocation timing"
            )
            
            # Create heatmap data
            df_filtered["weekday_num"] = df_filtered["date"].dt.dayofweek
            heatmap_data = df_filtered.groupby(["day_of_month", "weekday_num"])["amount"].sum().reset_index()
            heatmap_pivot = heatmap_data.pivot(index="day_of_month", columns="weekday_num", values="amount").fillna(0)
            
            # Map weekday numbers to names
            weekday_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            heatmap_pivot.columns = [weekday_names[i] for i in heatmap_pivot.columns]
            
            fig = px.imshow(
                heatmap_pivot,
                title="",
                labels=dict(x="Day of Week", y="Day of Month", color="Amount (₹)"),
                color_continuous_scale="Viridis"
            )
            fig.update_layout(
                height=500,
                paper_bgcolor="rgba(0,0,0,0)",
                font=dict(color="#f0f6fc")
            )
            st.plotly_chart(fig, use_container_width=True)
            st.markdown('</div>', unsafe_allow_html=True)

        with tab5:
            st.markdown("### 📋 Data Explorer & Insights")
            
            # Smart Insights Section
            st.markdown("#### 🧠 Smart Financial Insights")
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                # Highest spending day
                daily_totals = df_filtered.groupby("date")["amount"].sum()
                highest_day = daily_totals.idxmax()
                highest_amount = daily_totals.max()
                
                create_info_card(
                    "📅 Highest Spending Day",
                    f"You spent {format_currency(highest_amount)} on {highest_day.strftime('%B %d, %Y')}. "
                    f"This was {((highest_amount / daily_totals.mean() - 1) * 100):.0f}% above your daily average."
                )
            
            with col2:
                # Most frequent category
                if "description" in df_filtered.columns:
                    most_frequent = df_filtered["description"].mode().iloc[0]
                    frequency = (df_filtered["description"] == most_frequent).sum()
                    
                    create_info_card(
                        "🏷️ Most Frequent Category",
                        f"'{most_frequent}' appears {frequency} times ({(frequency/len(df_filtered)*100):.1f}% of transactions). "
                        f"This suggests it's a regular part of your spending routine."
                    )
            
            with col3:
                # Spending consistency
                daily_std = daily_totals.std()
                daily_mean = daily_totals.mean()
                consistency_score = (1 - (daily_std / daily_mean)) * 100
                
                create_info_card(
                    "📊 Spending Consistency",
                    f"Your spending consistency score is {consistency_score:.0f}%. "
                    f"{'High consistency indicates predictable spending patterns.' if consistency_score > 70 else 'Variable spending suggests opportunities for better budgeting.'}"
                )
            
            # Advanced Search and Filter
            st.markdown("#### 🔍 Advanced Data Explorer")
            
            col1, col2 = st.columns([2, 1])
            
            with col1:
                search_term = st.text_input(
                    "🔍 Search transactions",
                    placeholder="Search by description, amount, or date...",
                    help="Search across all transaction fields"
                )
            
            with col2:
                amount_filter = st.selectbox(
                    "💰 Amount Range",
                    ["All Amounts", "< ₹100", "₹100 - ₹500", "₹500 - ₹1000", "> ₹1000"],
                    help="Filter by transaction amount"
                )
            
            # Apply filters
            display_df = df_filtered.copy()
            
            if search_term:
                mask = (
                    display_df["description"].str.contains(search_term, case=False, na=False) |
                    display_df["amount"].astype(str).str.contains(search_term, na=False) |
                    display_df["date"].astype(str).str.contains(search_term, na=False)
                )
                display_df = display_df[mask]
            
            if amount_filter != "All Amounts":
                if amount_filter == "< ₹100":
                    display_df = display_df[display_df["amount"] < 100]
                elif amount_filter == "₹100 - ₹500":
                    display_df = display_df[(display_df["amount"] >= 100) & (display_df["amount"] <= 500)]
                elif amount_filter == "₹500 - ₹1000":
                    display_df = display_df[(display_df["amount"] >= 500) & (display_df["amount"] <= 1000)]
                elif amount_filter == "> ₹1000":
                    display_df = display_df[display_df["amount"] > 1000]
            
            # Display results with enhanced formatting
            if not display_df.empty:
                st.markdown(f"**📊 Showing {len(display_df):,} of {len(df_filtered):,} transactions**")
                
                # Format the dataframe for display
                display_df_formatted = display_df.copy()
                display_df_formatted["amount"] = display_df_formatted["amount"].apply(format_currency)
                display_df_formatted["date"] = display_df_formatted["date"].dt.strftime("%Y-%m-%d")
                
                # Add row coloring based on amount
                def highlight_amounts(row):
                    amount = float(row["amount"].replace("₹", "").replace(",", "").replace("K", "000").replace("L", "00000").replace("Cr", "0000000"))
                    if amount > 1000:
                        return ['background-color: rgba(255, 107, 107, 0.1)'] * len(row)  # Red for high amounts
                    elif amount > 500:
                        return ['background-color: rgba(255, 193, 7, 0.1)'] * len(row)   # Yellow for medium
                    else:
                        return ['background-color: rgba(40, 167, 69, 0.1)'] * len(row)   # Green for low
                
                styled_df = display_df_formatted[["date", "description", "amount"]].style.apply(highlight_amounts, axis=1)
                st.dataframe(styled_df, use_container_width=True, hide_index=True)
                
                # Quick Statistics
                col1, col2, col3, col4 = st.columns(4)
                
                with col1:
                    st.metric("Total", format_currency(display_df["amount"].sum()))
                
                with col2:
                    st.metric("Average", format_currency(display_df["amount"].mean()))
                
                with col3:
                    st.metric("Median", format_currency(display_df["amount"].median()))
                
                with col4:
                    st.metric("Transactions", f"{len(display_df):,}")
                
                # Download options
                st.markdown("#### 📥 Export Options")
                
                col1, col2 = st.columns(2)
                
                with col1:
                    csv = display_df.to_csv(index=False)
                    st.download_button(
                        label="📥 Download as CSV",
                        data=csv,
                        file_name=f"expense_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                        mime="text/csv",
                        help="Download filtered data as CSV file"
                    )
                
                with col2:
                    # Create a summary report
                    summary = f"""
# Financial Summary Report
Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Key Metrics
- Total Expenses: {format_currency(display_df['amount'].sum())}
- Number of Transactions: {len(display_df):,}
- Date Range: {display_df['date'].min()} to {display_df['date'].max()}
- Average Transaction: {format_currency(display_df['amount'].mean())}

## Top 5 Categories
{display_df.groupby('description')['amount'].sum().nlargest(5).to_string()}
                    """
                    
                    st.download_button(
                        label="📄 Download Summary Report",
                        data=summary,
                        file_name=f"financial_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md",
                        mime="text/markdown",
                        help="Download summary report as Markdown file"
                    )
            
            else:
                st.markdown("""
                <div class="info-card">
                    <h4>🔍 No Results Found</h4>
                    <p>No transactions match your search criteria. Try adjusting your filters or search terms.</p>
                </div>
                """, unsafe_allow_html=True)

    else:
        st.markdown("""
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <h3>No Data Available</h3>
            <p>Please add some expense data to see your financial dashboard.</p>
        </div>
        """, unsafe_allow_html=True)

    # Footer with tips and insights
    st.markdown("---")
    st.markdown("""
    <div class="info-card">
        <h4>💡 Dashboard Tips</h4>
        <p>
            <strong>📊 Chart Insights:</strong> Each chart tells a story about your spending habits. Look for patterns, spikes, and trends.<br>
            <strong>🎯 Action Items:</strong> Use the insights to set budgets, reduce unnecessary expenses, and optimize your financial health.<br>
            <strong>📱 Mobile Friendly:</strong> This dashboard works on all devices - check your finances anywhere, anytime.<br>
            <strong>🔄 Real-time Updates:</strong> Data refreshes automatically as you add new transactions.
        </p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()