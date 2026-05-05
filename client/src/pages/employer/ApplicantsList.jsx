import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../../hooks/axios";
import toast from "react-hot-toast";

function getScoreStyle(score) {
  return {
    fontSize: "0.9rem",
    padding: "7px 20px",
    borderRadius: "100px",
    background: score >= 80 ? "rgba(136,220,27,0.12)" : "rgba(199,31,31,0.12)",
    color: score >= 80 ? "#88dc1b" : "#c71f1f",
    border: `1px solid ${score >= 80 ? "#4c7d08" : "#e50707"}`,
    whiteSpace: "nowrap",
    textTransform: "capitalize",
    fontWeight: 500,
  };
}

function getScoreValueColor(score) {
  if (score >= 80) return "#88dc1b";
  if (score >= 60) return "#f5a623";
  return "#c71f1f";
}

function ApplicantsList() {
  const { jobId } = useParams();
  // openId tracks which card's details panel is open (null = none)
  const [openId, setOpenId] = useState(null);
  const [data, setData] = useState({
    jobTitle: "",
    totalApplicants: 0,
    pendingCount: 0,
    scoredApplicants: 0,
    applicants: [],
  });
  const [error, setError] = useState(null);
  const axios = useAxios();

  useEffect(() => {
    const fetchList = async () => {
      try {
        const { data } = await axios.get(`/employer/getrankedlist/${jobId}`);
        if (data.success) {
          setData({
            jobTitle: data.jobTitle,
            totalApplicants: data.totalApplicants,
            pendingCount: data.pendingCount,
            scoredApplicants: data.scoredApplicants,
            applicants: data.applicants,
          });
          toast.success("Applicants list fetched successfully");
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load Applicants list.");
      }
    };
    fetchList();
  }, [jobId]);
  function getStatusColor(status) {
  switch (status) {
    case 'shortlisted': return '#88dc1b';
    case 'reviewed':    return '#a99ff5';
    case 'rejected':    return '#e74c3c';
    default:            return '#f5a623';
  }
}

function getStatusBg(status) {
  switch (status) {
    case 'shortlisted': return 'rgba(136,220,27,0.12)';
    case 'reviewed':    return 'rgba(169,159,245,0.12)';
    case 'rejected':    return 'rgba(231,76,60,0.12)';
    default:            return 'rgba(245,166,35,0.12)';
  }
}
const BASE_URL = "http://localhost:4000";
 const updateStatus = async(applicationId, newStatus)=> {
    try {
      const { data } = await axios.patch(
        `/employer/updatestatus/${applicationId}/status`,
        { status: newStatus }
      );
      if (data.success) {
        setData((prev) => ({
          ...prev,
          applicants: prev.applicants.map((app) =>
            app.applicationId === applicationId
              ? { ...app, status: newStatus }
              : app
          ),
        }));
        toast.success(`Marked as ${newStatus}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  }

  return (
    <>
      <style>{`
        .jobs-page {
          min-height: 100vh;
          background: #0a0a14;
          padding: 2.5rem 2rem;
          font-family: 'DM Sans', sans-serif;
          color: #e8e8f0;
        }
        .page-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.3rem;
          font-family: 'Syne', sans-serif;
        }
        .page-subtitle {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.35);
          margin-bottom: 1.5rem;
        }
        .page-subtitle span { color: #7c6af7; font-weight: 600; }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 900px));
          gap: 1.5rem;
          justify-content: center;
        }

        /* CARD */
        .job-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.4rem;
          transition: border-color 0.22s, background 0.22s;
          position: relative;
        }
        .job-card:hover {
          border-color: rgba(124,106,247,0.25);
          background: rgba(124,106,247,0.04);
        }

        /* CARD TOP */
        .job-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .job-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.2rem;
          text-transform: capitalize;
        }
        .job-company {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.35);
          margin: 0;
        }

        /* PROGRESS BAR */
        .progress-track {
          background: rgba(255,255,255,0.08);
          border-radius: 999px;
          height: 8px;
          margin-bottom: 1rem;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #7c6af7, #88dc1b);
          transition: width 1.2s ease;
        }

        /* KEYWORDS */
        .keywords {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.8rem;
        }
        .job-tags {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .job-tag-found {
          font-size: 0.72rem;
          padding: 3px 10px;
          border-radius: 100px;
          background: rgba(136,220,27,0.08);
          color: #88dc1b;
          border: 1px solid rgba(136,220,27,0.3);
        }
        .job-tag-missing {
          font-size: 0.72rem;
          padding: 3px 10px;
          border-radius: 100px;
          background: rgba(231,76,60,0.08);
          color: #e74c3c;
          border: 1px solid rgba(231,76,60,0.3);
        }
        .job-tag-extra {
          font-size: 0.72rem;
          padding: 3px 10px;
          border-radius: 100px;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.4);
          border: 1px solid rgba(255,255,255,0.1);
        }

        /* FOOTER BUTTONS */
        .job-footer {
          display: flex;
          gap: 0.6rem;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-wrap: wrap;
        }
        .apply-btn {
          font-size: 0.8rem;
          padding: 7px 16px;
          border-radius: 8px;
          background: linear-gradient(135deg, #7c6af7, #9b8df9);
          color: #fff;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          transition: opacity 0.2s;
        }
        .apply-btn:hover { opacity: 0.85; }
        .outline-btn {
          font-size: 0.8rem;
          padding: 7px 16px;
          border-radius: 8px;
          background: transparent;
          color: #a99ff5;
          border: 1px solid rgba(124,106,247,0.35);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          transition: background 0.2s;
        }
        .outline-btn:hover { background: rgba(124,106,247,0.1); }
        .reject-btn {
          font-size: 0.8rem;
          padding: 7px 16px;
          border-radius: 8px;
          background: transparent;
          color: #e74c3c;
          border: 1px solid rgba(231,76,60,0.35);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          transition: background 0.2s, color 0.2s;
          margin-left: auto;
        }
        .reject-btn:hover { background: #e74c3c; color: #fff; }

        /* DETAILS PANEL */
        .details-panel {
          margin-top: 1.2rem;
          padding-top: 1.2rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          animation: slideDown 0.2s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* DETAIL STAT CARDS */
        .detail-cards {
          display: flex;
          gap: 0.8rem;
          margin-bottom: 1.2rem;
          flex-wrap: wrap;
        }
        .detail-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 0.9rem 1.2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          min-width: 100px;
          gap: 4px;
        }
        .detail-label {
          font-size: 10px;
          color: rgba(255,255,255,0.35);
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .detail-value {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
          line-height: 1.1;
          color: #fff;
        }

        /* SUMMARY */
        .summary-card {
          background: rgba(30,58,138,0.2);
          border: 1px solid rgba(96,165,250,0.2);
          border-radius: 10px;
          padding: 1rem 1.2rem;
          margin-bottom: 1rem;
        }
        .summary-card h6 {
          color: #93c5fd;
          font-weight: 700;
          margin: 0 0 0.4rem;
          font-size: 0.85rem;
        }
        .summary-card p {
          color: rgba(147,197,253,0.85);
          font-size: 0.85rem;
          line-height: 1.7;
          margin: 0;
        }

        /* SKILLS GRID */
        .skills-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
          margin-bottom: 1rem;
        }
        @media (max-width: 500px) { .skills-grid { grid-template-columns: 1fr; } }

        .skills-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 1rem;
        }
        .skills-card-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.8rem;
        }
        .skills-card-header h6 {
          font-weight: 700;
          color: rgba(255,255,255,0.7);
          margin: 0;
          font-size: 0.78rem;
          letter-spacing: 0.04em;
        }

        /* TAGS */
        .ar-tag {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 600;
          margin: 2px;
        }
        .ar-tag-green {
          background: rgba(136,220,27,0.1);
          color: #88dc1b;
          border: 1px solid rgba(136,220,27,0.25);
        }
        .ar-tag-red {
          background: rgba(231,76,60,0.1);
          color: #e74c3c;
          border: 1px solid rgba(231,76,60,0.25);
        }

        /* STRENGTHS / IMPROVEMENTS */
        .strengths, .improvements {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 1rem 1.2rem;
          margin-bottom: 0.8rem;
        }
        .strengths h5, .improvements h5 {
          font-size: 0.9rem;
          font-weight: 700;
          color: rgba(255,255,255,0.8);
          margin: 0 0 0.8rem;
        }
        .ar-tip-row {
          display: flex;
          gap: 0.7rem;
          align-items: flex-start;
          margin-bottom: 0.6rem;
        }
        .ar-tip-num {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(124,106,247,0.2);
          color: #a99ff5;
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .ar-tip-text {
          font-size: 0.83rem;
          color: rgba(255,255,255,0.55);
          margin: 0;
          line-height: 1.6;
        }

        .error-text { color: #e74c3c; text-align: center; padding: 2rem; }
      `}</style>

      <div className="jobs-page">
        {error && <p className="error-text">{error}</p>}

        <p className="page-title">{data.jobTitle || "Applicants"}</p>
        <p className="page-subtitle">
          <span>{data.scoredApplicants}</span> scored ·{" "}
          <span>{data.pendingCount}</span> pending ·{" "}
          <span>{data.totalApplicants}</span> total
        </p>

        <div className="jobs-grid">
          {data.applicants.map((app) => (
            <div className="job-card" key={app.applicationId}>

              {/* ── TOP ROW ── */}
              <div className="job-card-top">
                <div>
                  <p className="job-title">{app.applicant?.name}</p>
                  <p className="job-company">
                    {app.applicant?.email} · {app.resume?.totalExperienceYears} yrs exp
                  </p>
                </div>
                {app.aiMatch?.matchScore != null && (
                  <span style={getScoreStyle(app.aiMatch.matchScore)}>
                    {app.aiMatch.matchScore}% match
                  </span>
                )}
              </div>

              {/* ── PROGRESS BAR ── */}
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${app.aiMatch?.matchScore ?? 0}%` }}
                />
              </div>

              {/* ── KEYWORDS ── */}
              <div className="keywords">
                <div className="job-tags">
                  {app.aiMatch?.keywordsFound?.slice(0, 3).map((skill, i) => (
                    <span className="job-tag-found" key={i}>{skill} ✓</span>
                  ))}
                  {app.aiMatch?.keywordsFound?.length > 3 && (
                    <span className="job-tag-extra">+{app.aiMatch.keywordsFound.length - 3}</span>
                  )}
                </div>
                <div className="job-tags">
                  {app.aiMatch?.keywordsMissing?.slice(0, 3).map((skill, i) => (
                    <span className="job-tag-missing" key={i}>{skill} ✗</span>
                  ))}
                  {app.aiMatch?.keywordsMissing?.length > 3 && (
                    <span className="job-tag-extra">+{app.aiMatch.keywordsMissing.length - 3}</span>
                  )}
                </div>
              </div>

              {/* ── FOOTER BUTTONS ── */}
              <div className="job-footer">
                <button
                  className="apply-btn"
                  onClick={() =>
                    setOpenId(openId === app.applicationId ? null : app.applicationId)
                  }
                >
                  {openId === app.applicationId ? "Close" : "View Details"}
                </button>
                <button className="outline-btn" onClick={() => window.open(`${BASE_URL}/${app.resume.fileUrl}`, '_blank')}>View Resume</button>
             

                <button className="reject-btn"
                 onClick={() =>{
    if (window.confirm(`Reject ${app.applicant?.name}?`)) {
      updateStatus(app.applicationId, "rejected");
    }
  }}>Reject</button>
              </div>

              {/* ── DETAILS PANEL ── */}
              {openId === app.applicationId && (
                <div className="details-panel">

                  {/* Stat cards */}
                  <div className="detail-cards">
                    <div className="detail-card">
                      <p className="detail-label">Match score</p>
                      <p className="detail-value" style={{ color: getScoreValueColor(app.aiMatch?.matchScore) }}>
                        {app.aiMatch?.matchScore}%
                      </p>
                    </div>
                    <div className="detail-card">
                      <p className="detail-label">Experience</p>
                      <p className="detail-value">{app.resume?.totalExperienceYears} yrs</p>
                    </div>
                    <div className="detail-card">
                      <p className="detail-label">Status</p>
                      <p className="detail-value" style={{ fontSize: "0.85rem", textTransform: "capitalize", marginTop: 4 }}>
                        {app.status}
                      </p>
                    </div>
                    <div className="detail-card">
                      <p className="detail-label">Applied</p>
                      <p className="detail-value" style={{ fontSize: "0.78rem", marginTop: 4 }}>
                        {new Date(app.appliedAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="summary-card">
                    <h6>Analysis summary</h6>
                    <p>{app.aiMatch?.matchSummary || "No summary available."}</p>
                  </div>

                  {/* Skills grid */}
                  <div className="skills-grid">
                    <div className="skills-card">
                      <div className="skills-card-header">
                        <h6>Keywords found</h6>
                      </div>
                      {app.aiMatch?.keywordsFound?.map((skill, i) => (
                        <span key={i} className="ar-tag ar-tag-green">{skill}</span>
                      ))}
                    </div>
                    <div className="skills-card">
                      <div className="skills-card-header">
                        <h6>Keywords missing</h6>
                      </div>
                      {app.aiMatch?.keywordsMissing?.map((skill, i) => (
                        <span key={i} className="ar-tag ar-tag-red">{skill}</span>
                      ))}
                    </div>
                  </div>

                  {/* Strengths */}
                  {app.aiMatch?.strengths?.length > 0 && (
                    <div className="strengths">
                      <h5>Strengths</h5>
                      {app.aiMatch.strengths.map((s, i) => (
                        <div key={i} className="ar-tip-row">
                          <div className="ar-tip-num">{i + 1}</div>
                          <p className="ar-tip-text">{s}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Improvements */}
                  {app.aiMatch?.improvements?.length > 0 && (
                    <div className="improvements">
                      <h5>Areas to verify</h5>
                      {app.aiMatch.improvements.map((tip, i) => (
                        <div key={i} className="ar-tip-row">
                          <div className="ar-tip-num">{i + 1}</div>
                          <p className="ar-tip-text">{tip}</p>
                        </div>
                      ))}
                    </div>
                  )}
                      <div style={{ marginTop: '1rem' }}>
  <p style={{
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: '0.5rem',
    margin: '0 0 0.5rem',
  }}>
    Change status
  </p>
  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
    {['reviewed', 'shortlisted', 'rejected'].map((s) => (
      <button
        key={s}
        onClick={() => updateStatus(app.applicationId, s)}
        style={{
          padding: '5px 14px',
          borderRadius: '100px',
          fontSize: '0.78rem',
          fontWeight: 500,
          cursor: 'pointer',
          textTransform: 'capitalize',
          fontFamily: 'DM Sans, sans-serif',
          transition: 'all 0.15s',
          background: app.status === s ? getStatusBg(s) : 'transparent',
          color: app.status === s ? getStatusColor(s) : 'rgba(255,255,255,0.4)',
          border: `1px solid ${app.status === s ? getStatusColor(s) : 'rgba(255,255,255,0.12)'}`,
        }}
      >
        {app.status === s ? '● ' : ''}{s}
      </button>
    ))}
  </div>
</div>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ApplicantsList;