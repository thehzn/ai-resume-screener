import React, { useState, useEffect } from 'react';

import{Button, Modal} from "react-bootstrap";



import useAxios from '../hooks/axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';




export default function Browsejobs() {
  const axios=useAxios();
  const navigate = useNavigate();
  const {user} =useSelector((state)=>state.auth);
  const [jobs,setJobs]= useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [search, setSearch] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');
  const [show, setShow] = useState(false);
const [selectedJob, setSelectedJob] = useState(null);

const handleShowDetails = (job) => {
    setSelectedJob(job);
    setShow(true);
};

const handleClose = () => setShow(false);

  

  // Read search query from homepage navigation
 

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (search) params.search = search;
      if (experienceLevel) params.experienceLevel = experienceLevel;
      if (jobType) params.jobType = jobType;
      if (location) params.location = location;

      const {data} = await axios.get("/job/getalljobs", { params, withCredentials: true });
      setJobs(data.data);
      setAppliedJobIds(data.appliedJobs || []);
      console.log("Applied Jobs from Server:", data.appliedJobs); // Check this!
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  // Single useEffect — handles mount + all filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, experienceLevel, jobType, location]);

  const clearFilters = () => {
    setSearch('');
    setExperienceLevel('');
    setJobType('');
    setLocation('');
  };

  const hasFilters = search || location || experienceLevel || jobType;


  const handleApply= async(jobId)=>{

     if(!user || !user.resume){
        toast.error("Please upload a resume in your profile");
        return
      }
    try{
      const {data} = await axios.post(`/application/applytojob/${jobId}`,
        {resumeId : user.resume},
        {withCredentials:true}
      );
      if (data.success) {
                toast.success(data.message);
                setAppliedJobIds((prev) => [...prev, jobId]);
                const newId = data.applicationId;
                navigate(`/analysis/${newId}`);
            }

    }
    catch (error) {
            const errorMsg = error.response?.data?.message || "Something went wrong";
            toast.error(errorMsg);
            if (errorMsg.toLowerCase().includes("already applied")) {
       setAppliedJobIds((prev) => [...prev, jobId]);
    }
            console.error("Apply Error:", error);
            
        }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .jobs-page {
          min-height: 100vh;
          background: #0a0a14;
          padding: 2.5rem 2rem;
          font-family: 'DM Sans', sans-serif;
          color: #e8e8f0;
        }

        .jobs-header { margin-bottom: 1.8rem; }
        .jobs-header h1 {
          font-family: 'Syne', sans-serif;
          font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 0.2rem;
        }
        .jobs-header p { color: rgba(255,255,255,0.35); font-size: 0.88rem; }

        /* FILTERS */
        .filter-input {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 10px !important;
          color: #e8e8f0 !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 0.88rem !important;
          outline: none !important;
        }
        .filter-input:focus {
          border-color: rgba(124,106,247,0.5) !important;
          box-shadow: none !important;
          background: rgba(255,255,255,0.07) !important;
        }
        .filter-input::placeholder { color: rgba(255,255,255,0.25) !important; }
        select.filter-input option { background: #1a1a2e; color: #e8e8f0; }

        /* COUNT */
        .jobs-count {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.3);
          margin-bottom: 1.2rem;
        }
        .jobs-count span { color: #7c6af7; font-weight: 500; }

        /* GRID */
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }

        /* JOB CARD */
        .job-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.4rem;
          transition: all 0.22s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .job-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(135deg, #7c6af7, #f76a8c);
          opacity: 0; transition: opacity 0.25s;
        }
        .job-card:hover {
          border-color: rgba(124,106,247,0.25);
          background: rgba(124,106,247,0.04);
          transform: translateY(-3px);
        }
        // .job-card:hover::before { opacity: 1; }

        .job-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.8rem;
        }
        .job-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 0.2rem;
        }
        .job-company { font-size: 0.8rem; color: rgba(255,255,255,0.35); }

        .job-type-badge {
          font-size: 0.7rem;
          padding: 3px 10px;
          border-radius: 100px;
          background: rgba(124,106,247,0.12);
          color: #a99ff5;
          border: 1px solid rgba(124,106,247,0.2);
          white-space: nowrap;
          text-transform: capitalize;
        }

        .job-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.8rem; }
        .job-tag {
          font-size: 0.72rem;
          padding: 3px 10px;
          border-radius: 100px;
          background: rgba(255,255,255,0.05);
          color: rgba(232,232,240,0.5);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .job-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.2rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .job-meta-info { display: flex; flex-direction: column; gap: 3px; }
        .job-location { font-size: 0.78rem; color: rgba(255,255,255,0.3); }
        .job-salary { font-size: 0.78rem; color: rgba(124,106,247,0.8); }

        .apply-btn {
          font-size: 0.8rem;
          padding: 6px 16px;
          border-radius: 8px;
          background: linear-gradient(135deg, #7c6af7, #9b8df9);
          color: #fff;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          transition: opacity 0.2s;
          white-space: nowrap;
        }
        .apply-btn:hover { opacity: 0.85; }

        /* STATES */
        .state-box {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 5rem 2rem; text-align: center;
          color: rgba(255,255,255,0.25);
          gap: 0.8rem;
        }
        .state-box i { font-size: 2.2rem; }
        .state-box p { font-size: 0.9rem; margin: 0; }
        .error-text { color: rgba(247,106,140,0.7) !important; }

        .spinner {
          width: 28px; height: 28px;
          border: 2px solid rgba(124,106,247,0.2);
          border-top-color: #7c6af7;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .modal-content {
  background: #1a1a2e !important;
  color: #e8e8f0 !important;
  border: 1px solid rgba(255,255,255,0.1);
}
.modal-header, .modal-footer {
  border-color: rgba(255,255,255,0.1) !important;
}
.btn-close {
  filter: invert(1) grayscale(100%) brightness(200%);
}
  .modal{
  font-family: 'DM Sans', sans-serif;
  }
      `}</style>

      <div className="jobs-page">

        {/* Header */}
        <div className="jobs-header">
          <h1>Browse Jobs</h1>
          <p>Find the right opportunity for you</p>
        </div>

        {/* Filters */}
        <div className="row g-2 mb-3">
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control filter-input"
              placeholder="🔍 Search title, skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            <input
              type="text"
              className="form-control filter-input"
              placeholder="📍 Location"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            <select
              className="form-select filter-input"
              value={experienceLevel}
              onChange={e => setExperienceLevel(e.target.value)}
            >
              <option value="">Experience</option>
              <option value="fresher">Fresher</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div className="col-6 col-md-2">
            <select
              className="form-select filter-input"
              value={jobType}
              onChange={e => setJobType(e.target.value)}
            >
              <option value="">Job Type</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          {hasFilters && (
            <div className="col-6 col-md-2">
              <button
                className="btn w-100"
                onClick={clearFilters}
                style={{ border: '1px solid rgba(247,106,140,0.3)', color: 'rgba(247,106,140,0.8)', background: 'transparent', borderRadius: '10px', fontSize: '0.85rem' }}
              >
                ✕ Clear
              </button>
            </div>
          )}
        </div>

        {/* Count */}
        {!loading && !error && jobs.length>0 &&(
          <p className="jobs-count">
            Showing <span>{jobs.length}</span> job{jobs.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="state-box">
            <div className="spinner"></div>
            <p>Loading jobs...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="state-box">
            <i className="bi bi-exclamation-circle error-text"></i>
            <p className="error-text">{error}</p>
          </div>
        )}

        {/* No Results */}
        { jobs.length ===0 &&!loading && !error &&(
          <div className="state-box">
            <i className="bi bi-briefcase"></i>
            <p>No jobs found. Try adjusting your filters.</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && jobs.length > 0 && (
          <div className="jobs-grid">
            {jobs.map(job => (
              <div className="job-card" key={job._id}>
                <div className="job-card-top">
                  <div>
                    <p className="job-title">{job.title}</p>
                    <p className="job-company">
                      {job.employerprofile?.companyName || job.employer?.name || 'Company'}
                    </p>
                  </div>
                  {job.jobType && (
                    <span className="job-type-badge">{job.jobType}</span>
                  )}
                </div>

                {job.skills?.length > 0 && (
                  <div className="job-tags">
                    {job.skills.slice(0, 3).map((skill, i) => (
                      <span className="job-tag" key={i}>{skill}</span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="job-tag">+{job.skills.length - 3}</span>
                    )}
                  </div>
                )}

                <div className="job-footer">
                  <div className="job-meta-info">
                    {job.location && (
                      <span className="job-location">
                        <i className="bi bi-geo-alt me-1"></i>{job.location}
                      </span>
                    )}
                    {job.salaryRange && (
                      <span className="job-salary">
                        💰 {job.salaryRange.currency} {job.salaryRange.min?.toLocaleString()} - {job.salaryRange.max?.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Button  className="apply-btn" onClick={() => handleShowDetails(job)}>
    View Details
</Button>
                  <button className="apply-btn" onClick={()=>handleApply(job._id)}
                    disabled={appliedJobIds.includes(job._id)}
                    style={{ 
    background: appliedJobIds.includes(job._id) ? '#333' : '', 
    cursor: appliedJobIds.includes(job._id) ? 'not-allowed' : 'pointer' 
  }}
                    >
                      
                      {appliedJobIds.includes(job._id) ? "Applied" : "Apply"}
                      </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Modal show={show} onHide={handleClose} size="lg" centered className='modal'>
    <Modal.Header closeButton>
        <Modal.Title>{selectedJob?.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body >
        <h5 >{selectedJob?.employerprofile?.companyName}</h5>
        <p className="text-light">{selectedJob?.location} | {selectedJob?.salaryRange.currency} {selectedJob?.salaryRange.min} | {selectedJob?.employerprofile?.website} </p>
        <hr />
        <h6>Job Description</h6>
        <p >{selectedJob?.description}</p>
        
        <h6>Requirements</h6>
        <ul>
            {selectedJob?.skills?.map((req, index) => (
                <li key={index}>{req}</li>
            ))}
        </ul>
    </Modal.Body>
    <Modal.Footer>
        <Button   className='apply-btn' onClick={handleClose}>
            Close
        </Button>
        <Button 
        className='apply-btn'
          
            onClick={() => {
                handleApply(selectedJob._id);
                handleClose();
            }}
        >
            Apply Now
        </Button>
    </Modal.Footer>
</Modal>

      </div>
    </>
  );
}