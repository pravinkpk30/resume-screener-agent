"""
Create a FastAPI application that integrates with OpenAI's API to process resumes.
This application will read resumes from a specified directory, extract text from PDF files,
and use OpenAI's API to analyze the content of the resumes.

The application will also handle file uploads and provide endpoints for resume processing.

- Create an API endpoint to upload resumes.
- Create a function that reads the pdf files using the PyPDF2 library and extracts text.
- Use OpenAI's API to analyze the extracted text.
"""

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.parsepdf import parse_pdf
from app.agents.resume_extractor import analyze_resume
from app.agents.jd_extractor import analyze_jd
from app.agents.candidate_evaluation import evaluate_candidate
import json

app = FastAPI()

# Enable CORS for local development (Vite default port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/screening/")
async def upload_resume(resume: UploadFile = File(...), jd: UploadFile = File(...)):
    """
    Endpoint to upload a resume file and jd file.
    """
    print("Received resume file:", resume.filename)
    print("Received jd file:", jd.filename)

    resume_text = parse_pdf(resume.file)

    candidate_details = analyze_resume(resume_text)

    print("Candidate Details:", candidate_details)
    
    jd_text = parse_pdf(jd.file)

    jd_details = analyze_jd(jd_text)
    print("JD Details:", jd_details)

    evaluation = evaluate_candidate(candidate_details, jd_details)

    print("Evaluation result raw:", evaluation)

    result_json = json.loads(evaluation)
    return JSONResponse(content=result_json)
    
    