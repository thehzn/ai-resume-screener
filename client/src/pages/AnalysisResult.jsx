// import React, { useEffect, useState } from 'react'
// import {useParams} from 'react-router-dom';
// import useAxios from '../hooks/axios';

// function AnalysisResult() {
//     const {id} =useParams();
//   const axios= useAxios();
//    const [aiResult,setAiResult] = useState();
//     const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//  useEffect(()=>{
//   const fetchData = async(id)=>{
//     try{
//       setLoading(true);
//       setError("");
//       const {data} = await axios.get(`/application/getresult/${id}`);
//       setAiResult(data.aiMatch);
     
//       // Still processing — poll again after 3 seconds
//       if (data.aiMatch?.matchStatus === "processing") {
//         setTimeout(() => fetchData(id), 3000);
//       }

//     }
//     catch(error){
//        setError(error.response?.data?.message || "Failed to load result.");

//     }
//      finally {
//       setLoading(false); // ✅ always runs
//     }
//   }
//   if(id)fetchData(id);

//  },[id]);


//   return (
// <>

// <style>{`

//   .state-box {
//           display: flex; flex-direction: column;
//           align-items: center; justify-content: center;
//           padding: 5rem 2rem; text-align: center;
//           color: rgba(255,255,255,0.25);
//           gap: 0.8rem;
//         }
//         .state-box i { font-size: 2.2rem; }
//         .state-box p { font-size: 0.9rem; margin: 0; }
//         .error-text { color: rgba(247,106,140,0.7) !important; }

//         .spinner {
//           width: 28px; height: 28px;
//           border: 2px solid rgba(124,106,247,0.2);
//           border-top-color: #7c6af7;
//           border-radius: 50%;
//           animation: spin 0.7s linear infinite;
//         }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         .modal-content {
//   background: #1a1a2e !important;
//   color: #e8e8f0 !important;
//   border: 1px solid rgba(255,255,255,0.1);
// }


// .hero{
//   background: #0d1117; border-radius: var(--ar-hero-radius);
//     padding: 3rem; color: #fff; position: relative;
//     overflow: hidden; margin-bottom: 1.75rem;
//     animation: arFadeUp .6s ease both;
// }
//       .hero::before {
//     content: ''; position: absolute; top: -60px; right: -60px;
//     width: 260px; height: 260px; background: #3b82f6;
//     border-radius: 50%; filter: blur(90px); opacity: .18;
//   }
//   .hero::after {
//     content: ''; position: absolute; bottom: -40px; left: 30%;
//     width: 180px; height: 180px; background: #6366f1;
//     border-radius: 50%; filter: blur(80px); opacity: .12;
//   }
//     .score-label{
//      color:  #3b82f6; font-size: .7rem; font-weight: 800;
//     letter-spacing: .18em; text-transform: uppercase; margin-bottom: .4rem;
//     }
//       .score-number {
//     font-family: 'Syne', sans-serif; font-size: 6.5rem;
//     font-weight: 900; line-height: 1;
//   }
//   .score-tag { color: #94a3b8; font-weight: 500; margin-top: .4rem; }
 
//   .progress-labels {
//     display: flex; justify-content: space-between;
//     font-size: .7rem; font-weight: 800;
//     text-transform: uppercase; letter-spacing: .08em; margin-bottom: .5rem;
//   }
//   .progress-labels left { color: #94a3b8; }
//   .progress-labels right { color:#3b82f6; }
//   .progress-track {
//     background: rgba(255,255,255,.1); border-radius: 999px;
//     padding: 4px; border: 1px solid rgba(255,255,255,.05); height: 22px;
//   }
//   .progress-fill {
//     height: 100%; border-radius: 999px;
//     background: linear-gradient(90deg, var(--ar-blue), var(--ar-indigo));
//     box-shadow: 0 0 20px rgba(99,102,241,.35);
//     transition: width 1.5s ease;
//   }





// `}

// </style>
//       {loading && !aiResult&& (
        
//           <div className="state-box">
//             <div className="spinner"></div>
//             <p>Loading ...</p>
//           </div>
//        ) }

//        {aiResult?.matchStatus==="failed" &&(
//         <p className="text-danger">❌ AI screening failed. Please try again.</p>
//        )}

//         {/* Error */}
//         {error && (
//           <div className="state-box">
//             <i className="bi bi-exclamation-circle error-text"></i>
//             <p className="error-text">{error}</p>
//           </div>
//         )}


//     <div className='container-bg'>
//       <div className='hero'>
//         <div className="row align-items-center g-4" style={{ position: "relative", zIndex: 1 }}>
//         <div class="col-md-5 text-center text-md-start">
//         <p className="score-label">Resume Match Score</p>
//         <div class="score-number" id="scoreDisplay">{aiResult?.matchScore}</div>
//         <p class="score-tag">🛠 Needs Optimization</p>
//       </div>
//       <div className='progress'>
//         <div className='progress-labels'>
//           <span className='left'>Current Level</span>
//           <span className='right'>Target : 85%+</span>
//         </div>
//         <div className='progress-track'>
//          <div className='progress-fill' style={{ width: `${aiResult?.matchScore}%` }}></div>
//         </div>
//       </div>
//      </div>
//       </div>
//   {/* skills grid */}
//       <div className='skills-grid'>
//         {/* Matched */}
//         <div className='skills-card'>
//           <div className='skills-card-header'>
//             <div className='skill-icon green'>✅</div>
//             <h6>Matched Keywords</h6>
//           </div>
//           <div>
//             {aiResult?.keywordsFound.map((skill,i)=>(
//               <span key={i} className="ar-tag ar-tag-green">{skill}</span>
//             ))}
//           </div>

//         </div>

//         {/* Missing */}
//         <div className='skills-card'>
//           <div className='skills-card-header'>
//             <div className='skill-icon red'>❌</div>
//             <h6>Missing Keywords</h6>
//           </div>
//           <div>
//             {aiResult?.keywordsMissing.map((skill,i)=>(
//               <span key={i} className="ar-tag ar-tag-red">{skill}</span>
//             ))}
//           </div>

//         </div>


//       </div>

//       {/* strengths */}

//       <div className='strengths'>
//         <h5>Strengths</h5>
//         {aiResult?.strengths.map((s,i)=>(
//           <div key={i} className='ar-tip-row'>
//             <div className='ar-tip-num'>{i+1}</div>
//             <p className='ar-tip-text'>{s}</p>
//           </div>
//         ))}
//       </div>

// {/* improvements */}

//         <div className='improvements'>
//         <h5>Strengths</h5>
//         {aiResult?.improvements.map((tip,i)=>(
//           <div key={i} className='ar-tip-row'>
//             <div className='ar-tip-num'>{i+1}</div>
//             <p className='ar-tip-text'>{tip}</p>
//           </div>
//         ))}
//       </div>

      
//     </div>
//     </>
//   )
// }

// export default AnalysisResult



import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxios from '../hooks/axios';

function AnalysisResult() {
  const { id } = useParams();
  console.log("ID:", id); 
  const navigate = useNavigate();
  const axios = useAxios();

  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        console.log("fetchData called with:", id);
        setLoading(true);
        setError("");
        const { data } = await axios.get(`/application/getresult/${id}`);
            console.log("Full response:", data);           // 👈 see full response
      console.log("aiMatch:", data.aiMatch);         // 👈 see aiMatch object
      console.log("matchStatus:", data.aiMatch?.matchStatus);
        setAiResult(data.aiMatch);

        // Still processing — poll again after 3 seconds
        if (data.aiMatch?.matchStatus === "processing") {
          setTimeout(() => fetchData(id), 3000);
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load result.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData(id);
  }, [id]);

 

  return (
    <>
      <style>{`
        :root {
          --ar-blue: #3b82f6;
          --ar-indigo: #6366f1;
          --ar-red: #ef4444;
          --ar-hero-radius: 2.5rem;
          --ar-card-radius: 2rem;
        }

        .state-box {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 5rem 2rem; text-align: center;
          color: rgba(255,255,255,0.25); gap: 0.8rem;
        }
        .state-box i { font-size: 2.2rem; }
        .state-box p { font-size: 0.9rem; margin: 0; }
        .error-text { color: rgba(247,106,140,0.7) !important; }

        .spinner {
          width: 28px; height: 28px;
          border: 2px solid rgba(124,106,247,0.2);
          border-top-color: #7c6af7; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes arFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .btn-back {
          display: inline-flex; align-items: center; gap: .5rem;
          background: none; border: none; color: #64748b;
          font-weight: 600; font-size: .95rem; cursor: pointer;
          padding: 0; margin-bottom: 1.75rem; transition: color .2s;
        }
        .btn-back:hover { color: var(--ar-blue); }
        .btn-back:hover .ar-arrow { transform: translateX(-4px); }
        .ar-arrow { transition: transform .2s; display: inline-block; }

        /* Hero */
        .hero {
          background: #0d1117; border-radius: var(--ar-hero-radius);
          padding: 3rem; color: #fff; position: relative;
          overflow: hidden; margin-bottom: 1.75rem;
          animation: arFadeUp .6s ease both;
        }
        
        .score-label {
          color: var(--ar-blue); font-size: .7rem; font-weight: 800;
          letter-spacing: .18em; text-transform: uppercase; margin-bottom: .4rem;
        }
        .score-number { font-size: 6.5rem; font-weight: 900; line-height: 1; }
        .score-tag { color: #94a3b8; font-weight: 500; margin-top: .4rem; }

        /* Progress */
        .progress-labels {
          display: flex; justify-content: space-between;
          font-size: .7rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: .08em; margin-bottom: .5rem;
        }
        .progress-labels .left { color: #94a3b8; }
        .progress-labels .right { color: var(--ar-blue); }
        .progress-track {
          background: rgba(255,255,255,.1); border-radius: 999px;
          padding: 4px; border: 1px solid rgba(255,255,255,.05); height: 22px;
        }
        .progress-fill {
          height: 100%; border-radius: 999px;
          background: linear-gradient(90deg, var(--ar-blue), var(--ar-indigo));
          box-shadow: 0 0 20px rgba(99,102,241,.35);
          transition: width 1.5s ease;
        }

        /* Summary */
        .summary-card {
          background: #eff6ff; border: 1px solid #bfdbfe;
          border-radius: var(--ar-card-radius); padding: 1.6rem 2rem;
          margin-bottom: 1.75rem; animation: arFadeUp .6s .1s ease both;
        }
        .summary-card h6 { color: #1e3a8a; font-weight: 800; margin-bottom: .6rem; }
        .summary-card p { color: #1d4ed8; opacity: .8; font-size: .9rem; line-height: 1.7; margin: 0; }

        /* Skills Grid */
        .skills-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 1.25rem; margin-bottom: 1.75rem;
          animation: arFadeUp .6s .2s ease both;
        }
        @media (max-width: 640px) { .skills-grid { grid-template-columns: 1fr; } }

        .skills-card {
          background: #fff; border-radius: var(--ar-card-radius);
          padding: 2rem; border: 1px solid #f1f5f9; transition: border-color .2s;
        }
        .skills-card:hover { border-color: #bfdbfe; }
        .skills-card.red-card:hover { border-color: #fecaca; }
        .skills-card-header { display: flex; align-items: center; gap: .8rem; margin-bottom: 1.4rem; }
        .skill-icon {
          width: 38px; height: 38px; border-radius: .75rem;
          display: flex; align-items: center; justify-content: center; font-size: 1rem;
        }
        .skill-icon.green { background: #f0fdf4; }
        .skill-icon.red   { background: #fef2f2; }
        .skills-card-header h6 { font-weight: 800; color: #1e293b; margin: 0; font-size: .95rem; }

        /* Tags */
        .ar-tag {
          display: inline-block; padding: .3rem .8rem; border-radius: .75rem;
          font-size: .68rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: .05em; margin: .2rem;
        }
        .ar-tag-green { background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; }
        .ar-tag-red {
          background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2;
          cursor: pointer; transition: background .15s, color .15s, transform .1s;
        }
        .ar-tag-red:hover { background: var(--ar-red); color: #fff; }
        

        /* Strengths & Improvements */
        .strengths, .improvements {
          background: #fff; border-radius: var(--ar-hero-radius);
          padding: 2.8rem; border: 1px solid #f1f5f9;
          margin-bottom: 1.75rem; animation: arFadeUp .6s .3s ease both;
        }
        .strengths h5, .improvements h5 {
          font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 2rem;
        }
        .ar-tip-row {
          display: flex; gap: 1.2rem; padding: 1.3rem 1.5rem;
          border-radius: 1.2rem; background: #f8fafc;
          border: 1px solid transparent; transition: background .2s, border-color .2s;
          margin-bottom: .75rem;
        }
        .ar-tip-row:last-child { margin-bottom: 0; }
        .ar-tip-row:hover { background: #eff6ff; border-color: #bfdbfe; }
        .ar-tip-num {
          flex-shrink: 0; width: 38px; height: 38px;
          background: #fff; border: 1px solid #e2e8f0; border-radius: .75rem;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: .8rem; color: #1e293b;
          transition: background .2s, color .2s, border-color .2s;
        }
        .ar-tip-row:hover .ar-tip-num { background: var(--ar-blue); color: #fff; border-color: var(--ar-blue); }
        .ar-tip-text { font-size: .875rem; color: #64748b; line-height: 1.7; font-weight: 500; align-self: center; margin: 0; }

        /* Toast */
        .ar-toast {
          position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
          background: #1e293b; color: #fff; padding: .6rem 1.4rem;
          border-radius: 999px; font-size: .82rem; font-weight: 600;
          opacity: 0; pointer-events: none; transition: opacity .3s; z-index: 9999;
        }
        .ar-toast.show { opacity: 1; }
      `}</style>

      {/* Loading — first fetch not done */}
      {loading && !aiResult && (
        <div className="state-box">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Processing — AI still running */}
      {!loading && aiResult?.matchStatus === "processing" && (
        <div className="state-box">
          <div className="spinner"></div>
          <p>⏳ AI is analyzing your resume, please wait...</p>
        </div>
      )}

      {/* Failed */}
      {aiResult?.matchStatus === "failed" && (
        <div className="state-box">
          <i className="bi bi-exclamation-circle error-text"></i>
          <p className="error-text">❌ AI screening failed. Please try again.</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="state-box">
          <i className="bi bi-exclamation-circle error-text"></i>
          <p className="error-text">{error}</p>
        </div>
      )}

      {/* Main content — only when completed */}
      {aiResult?.matchStatus === "completed" && (
        <div className="container-bg">

          <button className="btn-back" onClick={() => navigate('/browse-jobs/')}>
            <span className="ar-arrow">←</span> Back
          </button>

          {/* Hero Score */}
          <div className="hero">
            <div className="row align-items-center g-4" style={{ position: "relative", zIndex: 1 }}>
              <div className="col-md-5 text-center text-md-start">
                <p className="score-label">Resume Match Score</p>
                <div className="score-number">{aiResult.matchScore}%</div>
                <p className="score-tag">
                  {aiResult.matchScore >= 80 ? "🔥 Highly Compatible" : "🛠 Needs Optimization"}
                </p>
              </div>
              <div className="col-md-7">
                <div className="progress-labels">
                  <span className="left">Current Level</span>
                  <span className="right">Target: 85%+</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${aiResult.matchScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="summary-card">
            <h6>💡 Analysis Summary</h6>
            <p>{aiResult.matchSummary || "No summary available."}</p>
          </div>

          {/* Skills Grid */}
          <div className="skills-grid">
            <div className="skills-card">
              <div className="skills-card-header">
                <div className="skill-icon green">✅</div>
                <h6>Matched Keywords</h6>
              </div>
              <div>
                {aiResult.keywordsFound?.map((skill, i) => (
                  <span key={i} className="ar-tag ar-tag-green">{skill}</span>
                ))}
              </div>
            </div>

            <div className="skills-card red-card">
              <div className="skills-card-header">
                <div className="skill-icon red">❌</div>
                <h6>Missing Keywords</h6>
              </div>
              <div>
                {aiResult.keywordsMissing?.map((skill, i) => (
                   <span key={i} className="ar-tag ar-tag-red">{skill}</span>
                 

                ))}
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="strengths">
            <h5>💪 Strengths</h5>
            {aiResult.strengths?.map((s, i) => (
              <div key={i} className="ar-tip-row">
                <div className="ar-tip-num">{i + 1}</div>
                <p className="ar-tip-text">{s}</p>
              </div>
            ))}
          </div>

          {/* Improvements */}
          <div className="improvements">
            <h5>🛠 How to Improve Your Score</h5>
            {aiResult.improvements?.map((tip, i) => (
              <div key={i} className="ar-tip-row">
                <div className="ar-tip-num">{i + 1}</div>
                <p className="ar-tip-text">{tip}</p>
              </div>
            ))}
          </div>

        </div>
      )}


    </>
  );
}

export default AnalysisResult;
