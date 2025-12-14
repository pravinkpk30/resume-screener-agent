import streamlit as st
import requests

st.title("Resume Screening App")

resume_file = st.file_uploader("Upload a resume (PDF)", type="pdf")
jd_file = st.file_uploader("Upload Job Description (PDF)", type="pdf")

if resume_file is not None and jd_file is not None:
    st.write("Files uploaded successfully!")
    # print("Files uploaded successfully:", resume_file.name, jd_file.name)

    if st.button("Process Resume"):
        files = {
            "resume": ("resume.pdf", resume_file, "application/pdf"),
            "jd": ("jd.pdf", jd_file, "application/pdf")
        }
        response = requests.post(
            "http://localhost:8000/screening/",
            files=files
        )
        if response.status_code == 200:
            st.write("Resume processed successfully!")
            response_data = response.json()
            st.write("Candidate Status: ",response_data.get("candidate_status"))
            st.write("Feedback: ", response_data.get("reason"))
            st.write("Skills Matched: ", response_data.get("skill_match_percentage"), "%")
            
        else:
            st.write("Error processing resume:", response.text)
            print("Error processing resume:", response.text)

    # Here you would add logic to process the uploaded file, such as extracting text and analyzing it with OpenAI's API 

