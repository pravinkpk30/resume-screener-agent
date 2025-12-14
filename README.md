# Resume Screener Agent

An end-to-end application to screen a candidate’s resume against a job description using AI agents. It parses PDFs, extracts structured data, compares skills and experience, and returns a decision: Selected or Rejected, with reasoning.

## Overview

- **Backend (FastAPI)** in `app/` provides the `/screening/` API to accept a Resume PDF and a JD PDF and returns a JSON decision.
- **Agents (Gemini)** in `app/agents/` perform resume extraction, JD extraction, and candidate evaluation using Google Generative AI.
- **UI (React + Vite + Tailwind)** in `ui/` is a modern web frontend to upload PDFs and visualize the result.
- **Streamlit UI** in `streamlit-ui/` is an alternate lightweight UI for demos.

## Prerequisites

- Python 3.11+
- Node.js 20.19+ or 22.12+ (UI uses Vite 7)
- Google Gemini API key

### Environment Variables

Create a `.env` file at the project root:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

You can also copy `env.local` as a template.

## Architecture & Agents

- **Resume Extractor (`app/agents/resume_extractor.py`)**
  - Extracts: name, email, phone, education, total experience, skills, certifications.
  - Output: JSON.

- **JD Extractor (`app/agents/jd_extractor.py`)**
  - Extracts: min/max experience range and required skills from the JD.
  - Output: JSON.

- **Candidate Evaluation (`app/agents/candidate_evaluation.py`)**
  - Compares candidate vs JD.
  - Rules: at least 50% skill match AND experience within JD range (±2 years tolerance).
  - Output JSON fields: `candidate_status`, `reason`, `matched_skills`, `skill_match_percentage`, `experience`.

## Backend (FastAPI)

Location: `app/`

Key endpoint:

- `POST /screening/` (multipart/form-data)
  - Fields: `resume` (PDF), `jd` (PDF)
  - Response: JSON decision

Utility endpoints:

- `GET /health` → `{ "status": "ok" }`

### Install & Run

```bash
# From project root
pip install -r requirements.txt

# Start the server (auto-reload)
uvicorn app.main:app --reload

# Server runs at
# http://localhost:8000
# Health check: http://localhost:8000/health
```

## Frontend (React + Vite + Tailwind)

Location: `ui/`

The UI posts to `http://localhost:8000/screening/` by default.

### Node Version

Vite 7 requires Node 20.19+ or 22.12+. This repo includes `.nvmrc` with `22.12.0`.

```bash
# Recommended with nvm
nvm install 22.12.0
nvm use
node -v  # should be v22.12.0
```

### Install & Run

```bash
cd ui
npm install
npm run dev

# UI runs at:
# http://localhost:5173
```

Optional: make API base URL configurable via `VITE_API_URL` (can be added on request).

## Streamlit UI (Optional)

Location: `streamlit-ui/`

```bash
# From project root
streamlit run streamlit-ui/app.py

# Or using uv
uv run streamlit run streamlit-ui/app.py
```

## Troubleshooting

- **CORS errors from UI**: Backend enables CORS for `http://localhost:5173`. Ensure the backend is running and reachable at `http://localhost:8000`.
- **Vite fails to start with crypto/hash error**: Upgrade Node to 20.19+ or 22.12+ (`nvm install 22.12.0 && nvm use`). Reinstall `ui` deps after switching Node.
- **Gemini API failures**: Ensure `GOOGLE_API_KEY` is set and valid. Some prompts can respond with markdown-wrapped JSON; the agents attempt to clean that.

## Example Request/Response

```http
POST /screening/
Content-Type: multipart/form-data

resume: <resume.pdf>
jd: <jd.pdf>
```

```json
{
  "candidate_status": "Selected",
  "reason": "The candidate matches 80% of the required skills and has the relevant experience.",
  "matched_skills": ["Python", "FastAPI"],
  "skill_match_percentage": 80,
  "experience": 5
}
```

