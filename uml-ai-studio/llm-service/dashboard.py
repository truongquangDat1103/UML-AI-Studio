import streamlit as st
import pandas as pd
import plotly.express as px
from pathlib import Path

st.set_page_config(page_title="PBL5 Observability", layout="wide")

st.title("AI System Monitoring Dashboard")

inference_path = Path("logs/inference_history.jsonl")
eval_path = Path("logs/evaluation_history.jsonl")

tab1, tab2 = st.tabs(["Inference", "Evaluation"])

with tab1:
    if not inference_path.exists():
        st.warning("Chua co inference log. Hay chay pipeline truoc.")
    else:
        try:
            df = pd.read_json(inference_path, lines=True)
            if df.empty:
                st.info("Inference log rong.")
            else:
                df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")

                col1, col2, col3, col4 = st.columns(4)
                col1.metric("Tong request", len(df))
                col2.metric("Latency TB", f"{df['latency_seconds'].mean():.2f}s")
                col3.metric("Success rate", f"{(df['status'] == 'SUCCESS').mean() * 100:.1f}%")
                col4.metric("Model active", str(df["model"].iloc[-1]))

                st.subheader("Latency Over Time")
                fig_lat = px.line(df, x="timestamp", y="latency_seconds", color="model", markers=True)
                st.plotly_chart(fig_lat, use_container_width=True)

                st.subheader("Domain Distribution")
                fig_pie = px.pie(df, names="domain", hole=0.4)
                st.plotly_chart(fig_pie, use_container_width=True)

                st.subheader("Latest Inference Logs")
                st.dataframe(df.tail(20), use_container_width=True)
        except Exception as e:
            st.error(f"Khong the doc inference log: {e}")

with tab2:
    if not eval_path.exists():
        st.warning("Chua co evaluation log. Hay chay evaluator.py truoc.")
    else:
        try:
            ev = pd.read_json(eval_path, lines=True)
            if ev.empty:
                st.info("Evaluation log rong.")
            else:
                ev["timestamp"] = pd.to_datetime(ev["timestamp"], errors="coerce")

                col1, col2, col3 = st.columns(3)
                col1.metric("So lan evaluate", len(ev))
                col2.metric("F1 TB gan nhat", f"{ev['avg_f1'].iloc[-1]:.3f}")
                col3.metric("Pass rate gan nhat", f"{ev['pass_rate'].iloc[-1]:.1f}%")

                st.subheader("Average F1 Over Time")
                fig_f1 = px.line(ev, x="timestamp", y="avg_f1", color="domain", markers=True)
                st.plotly_chart(fig_f1, use_container_width=True)

                st.subheader("Evaluation History")
                st.dataframe(ev.tail(20), use_container_width=True)
        except Exception as e:
            st.error(f"Khong the doc evaluation log: {e}")