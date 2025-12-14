# FastAPI Backend - Resume Screener Agent

This directory contains the backend logic for the Resume Screener Agent, built with [FastAPI](https://fastapi.tiangolo.com/).

## Overview

The backend exposes a single endpoint `/screening/` which:

1.  Accepts a **Resume** (PDF) and a **Job Description** (PDF).
2.  Uses AI Agents to parse and extract structured data from both documents.
3.  Evaluates the candidate against the job requirements.
4.  Returns a JSON response with the decision (selected/rejected), reasoning, and skill match percentage.

## Prerequisites

Ensure you have the dependencies installed.

```bash
# From the project root
pip install -r requirements.txt
```

### Environment Configuration

You must have a `.env` file in the project root with your Google Gemini API key:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

## How to Run

Navigate to the project root directory and run the following command:

```bash
uvicorn app.main:app --reload
```

- `app.main:app`: Refers to the `app` object inside `app/main.py`.
- `--reload`: Enables auto-reload on code changes (useful for development).

The server will start at `http://127.0.0.1:8000`.

## Architecture & Agents

The system is composed of three specialized AI agents, powered by Google's Gemini models (`gemini-2.0-flash`).

### 1. Resume Extractor Agent

**File:** `app/agents/resume_extractor.py`

- **Role**: Reads the raw text from the uploaded Resume PDF.
- **Function**: `analyze_resume(text)`
- **Output**: Structured JSON containing Name, Email, Phone, Education, Work Experience, Skills, etc.

### 2. JD Extractor Agent

**File:** `app/agents/jd_extractor.py`

- **Role**: Reads the raw text from the uploaded Job Description PDF.
- **Function**: `analyze_jd(text)`
- **Output**: Structured JSON containing Minimum/Maximum Experience required and a list of Required Skills.

### 3. Candidate Evaluation Agent

**File:** `app/agents/candidate_evaluation.py`

- **Role**: Takes the structured outputs from the Resume and JD agents.
- **Function**: `evaluate_candidate(candidate_details, jd)`
- **Logic**:
  - Checks if the candidate's experience falls within the required range (with a +/- 2 year tolerance).
  - Calculates the percentage of matched skills (requiring at least 50% match).
- **Output**: JSON containing `candidate_status` (Selected/Rejected), `reason`, `matched_skills`, and `skill_match_percentage`.

## API Usage Example

**Endpoint:** `POST /screening/`

**Request:** `multipart/form-data`

- `resume`: [File]
- `jd`: [File]

**Response:**

```json
{
  "candidate_status": "Selected",
  "reason": "The candidate matches 80% of the required skills and has the relevant experience.",
  "matched_skills": ["Python", "FastAPI"],
  "skill_match_percentage": 80,
  "experience": 5
}
```
