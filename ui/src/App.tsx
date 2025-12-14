
import { useState } from 'react';
import axios from 'axios';

interface EvaluationResult {
  candidate_status: string;
  reason: string;
  matched_skills: string[];
  skill_match_percentage: number;
  experience: number;
}

function App() {
  const [resume, setResume] = useState<File | null>(null);
  const [jd, setJd] = useState<File | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    if (!resume || !jd) {
      setError("Please upload both Resume and Job Description.");
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jd', jd);

    try {
      const response = await axios.post('http://localhost:8000/screening/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to process. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-slate-800 font-sans selection:bg-blue-100">
       {/* Header */}
       <nav className="flex justify-between items-center px-8 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 text-lg">
                R
             </div>
             <span className="text-xl font-bold tracking-tight text-slate-900">
                Resume<span className="text-blue-600">Screener</span>
             </span>
          </div>
       </nav>

       <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
             {/* Left Column: Instructions & Inputs */}
             <div className="lg:col-span-7 space-y-8">
                <div className="space-y-4">
                   <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                      Hire smarter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">AI Precision</span>
                   </h1>
                   <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                      Upload a candidate's resume and your job description. Our advanced agent analyzes skills, experience, and compatibility instantly.
                   </p>
                </div>
                
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Resume Upload */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-slate-700 ml-1">Candidate Resume (PDF)</label>
                            <div className="relative group">
                                <input 
                                  type="file" 
                                  accept=".pdf"
                                  onChange={(e) => setResume(e.target.files ? e.target.files[0] : null)}
                                  className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2.5 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                    cursor-pointer border border-slate-200 rounded-xl bg-slate-50/50 p-1"
                                />
                            </div>
                        </div>

                        {/* JD Upload */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-slate-700 ml-1">Job Description (PDF)</label>
                            <div className="relative group">
                                <input 
                                  type="file" 
                                  accept=".pdf"
                                  onChange={(e) => setJd(e.target.files ? e.target.files[0] : null)}
                                  className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2.5 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-violet-50 file:text-violet-700
                                    hover:file:bg-violet-100
                                    cursor-pointer border border-slate-200 rounded-xl bg-slate-50/50 p-1"
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleProcess}
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0
                            ${loading 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/25 ring-4 ring-transparent hover:ring-blue-100'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing Documents...
                            </span>
                        ) : 'Process Evaluation'}
                    </button>
                    
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                             <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                             {error}
                        </div>
                    )}
                </div>
             </div>

             {/* Right Column: Hero Element */}
             <div className="lg:col-span-5 relative hidden lg:block">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2.5rem] -rotate-1 transform transition-transform hover:rotate-0"></div>
                <div className="relative bg-white border border-slate-100 rounded-[2rem] p-8 shadow-2xl shadow-blue-100/50 h-full flex flex-col justify-between">
                     <div className="space-y-6">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
                            AI Powered Analysis
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800">
                            Unlock potential, <br/>
                            Eliminate guess work.
                        </h3>
                        <div className="space-y-4">
                            {[
                                { title: "Skill Matching", desc: "Precise extraction and comparison of technical capabilities." },
                                { title: "Experience Check", desc: "Automated validation of years of relevant experience." },
                                { title: "Instant Reasoning", desc: "Clear, explained decision making for every candidate." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 hover:bg-blue-50/50 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 font-bold border border-slate-100 shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                                        <p className="text-sm text-slate-500 leading-snug">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
             </div>
          </div>

          {/* Results Section */}
          {result && (
             <div className="animate-fade-in-up bg-white rounded-3xl shadow-xl shadow-slate-200 overflow-hidden border border-slate-100 ring-1 ring-slate-100">
                 <div className={`p-1.5 ${result.candidate_status === 'Selected' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-pink-500'}`}></div>
                 
                 <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                     
                     {/* Status Column */}
                     <div className="md:col-span-1 space-y-6 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-100 pb-8 md:pb-0 md:pr-8">
                         <div className="uppercase tracking-widest text-xs font-bold text-slate-400">Decision</div>
                         {result.candidate_status === 'Selected' ? (
                             <div className="inline-flex flex-col items-center md:items-start gap-2">
                                 <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Selected</span>
                                 <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm">Recommended</div>
                             </div>
                         ) : (
                             <div className="inline-flex flex-col items-center md:items-start gap-2">
                                 <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600">Rejected</span>
                                 <div className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-sm">Not Suitable</div>
                             </div>
                         )}
                         
                         <div className="pt-6">
                            <div className="uppercase tracking-widest text-xs font-bold text-slate-400 mb-2">Match Score</div>
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <span className="text-3xl font-bold text-slate-800">{result.skill_match_percentage}%</span>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100">
                                    <div style={{ width: `${result.skill_match_percentage}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${result.skill_match_percentage > 50 ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                                </div>
                            </div>
                         </div>
                     </div>

                     {/* Details Column */}
                     <div className="md:col-span-2 space-y-8">
                         <div>
                             <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Evaluation Feedback
                             </h3>
                             <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                {result.reason}
                             </p>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Matched Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.matched_skills.map((skill, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100">
                                            {skill}
                                        </span>
                                    ))}
                                    {result.matched_skills.length === 0 && <span className="text-slate-400 text-sm italic">No skills matched directly.</span>}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Years of Experience</h3>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-violet-50 rounded-xl text-violet-600">
                                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <span className="block text-2xl font-bold text-slate-900">{result.experience}</span>
                                        <span className="text-xs text-slate-500 font-medium">Verified Years</span>
                                    </div>
                                </div>
                            </div>
                         </div>
                     </div>
                 </div>
             </div>
          )}
       </main>
    </div>
  );
}

export default App;
