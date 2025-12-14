import google.generativeai as genai
from dotenv import load_dotenv
import os
from app.prompts import EXTRACT_CANDIDATE_DETAILS

# Load environment variables from .env file
load_dotenv()

# Initialize Google Generative AI with API key
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

def analyze_resume(text: str) -> str:
    """
    Function to analyze the extracted text from a resume using Google's Gemini API.
    """
    prompt = EXTRACT_CANDIDATE_DETAILS.format(resume_text=text)
    try:
        model = genai.GenerativeModel("gemini-2.0-flash-exp")
        response = model.generate_content(prompt)
        print("Response from Resume Extractor Agent:", response.text)
        
        # Clean the response text to remove markdown formatting if present
        import re
        text = response.text.strip()
        # Try to find JSON block within markdown code blocks
        match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
        if match:
            return match.group(1)
            
        # If no code blocks, look for the first '{' and last '}'
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
             return match.group(0)
             
        return text
    except Exception as e:
        return str(e)