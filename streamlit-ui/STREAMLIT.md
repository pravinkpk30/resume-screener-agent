# Streamlit UI - Resume Screener Agent

This directory contains the user interface for the Resume Screener Agent, built with [Streamlit](https://streamlit.io/).

## Overview

The `app.py` file provides a web interface to:

1.  **Upload a Resume** (PDF format).
2.  **Upload a Job Description** (PDF format).
3.  **Process** the documents to receive feedback, candidate status, and skill match percentage from the backend.

## Prerequisites

Ensure you have the dependencies installed. If you haven't already:

```bash
# From the project root
pip install -r requirements.txt
```

## How to Run

You can run the application using either the standard Streamlit command or via `uv`.

### 1. Standard Method

If you have installed the dependencies in your active environment:

```bash
# From project root
streamlit run streamlit-ui/app.py
```

Or if you are already inside the `streamlit-ui` directory:

```bash
cd streamlit-ui
streamlit run app.py
```

### 2. Using `uv`

If you are using `uv` for dependency and environment management, you can run the app directly without manually activating a virtual environment.

```bash
# From project root
uv run streamlit run streamlit-ui/app.py
```

## Troubleshooting

- **Connection Error**: If you see a connection error when clicking "Process Resume", ensure your backend Fast API server is running (`localhost:8000`).
- **File Upload Issues**: The app currently only supports PDF files. Ensure your resume and JD are in valid PDF format.
