import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/axios";
import toast from "react-hot-toast";
import { Container,Table,Button } from "react-bootstrap";




function ManageJobs(){
  const [jobs,setJobs] = useState([]);
  const [error,setError] = useState(null);
  const navigate = useNavigate();
  const axios = useAxios();


  useEffect(()=>{

    const fetchjobs=async()=>{
      try{
        const {data} = await axios.get("/employer/getmyjobs");
        setJobs(data.jobs);
        const count = data.count;
        if(data.success && count>0) toast.success(`successfully fetched ${count} jobs`);
      }
      catch (error) {
        setError(error.response?.data?.message || "Failed to load jobs.");
      } 
    }
    fetchjobs();
    
  },[]);

  const handleDelete=async(jobId)=>{
    try{
      const {data} = await axios.delete(`/job/deletejob/${jobId}`);
      if(data.success)toast.success(data?.message || "job deleted successfully");
      setJobs(jobs.filter((job)=>job._id!==jobId));

    }
    catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete job.");
      } 

  }



  
return(
  <>
  <style>
    {`
    .jobs-count {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.3);
          margin-bottom: 1.2rem;
        }
        .jobs-count span { color: #7c6af7; font-weight: 500; }

         .mj-wrap {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    padding: 2.5rem 1rem 5rem;
  }

  /* Header */
  .mj-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .mj-header h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
  }
  .mj-count {
    font-size: 0.82rem;
    color: #94a3b8;
    margin: 0;
  }
  .mj-count span {
    color: #6366f1;
    font-weight: 700;
  }

  /* Add Job Button */
  .mj-btn-add {
    background: #0f172a;
    color: #fff;
    border: none;
    border-radius: 0.75rem;
    padding: 0.55rem 1.2rem;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
  }
  .mj-btn-add:hover { background: #6366f1; }
  .mj-btn-add:active { transform: scale(0.97); }

  /* Table wrapper */
  .mj-table-wrap {
    border-radius: 1.25rem;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 24px rgba(0,0,0,0.05);
    animation: mjFadeUp 0.5s ease both;
  }
  @keyframes mjFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Table */
  .mj-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
    background: #fff;
  }
  .mj-table thead tr {
    background: #0f172a;
    color: #fff;
  }
  .mj-table thead th {
    padding: 1rem 1.25rem;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border: none;
    white-space: nowrap;
  }
  .mj-table tbody tr {
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.15s;
  }
  .mj-table tbody tr:last-child { border-bottom: none; }
  .mj-table tbody tr:hover { background: #f8fafc; }
  .mj-table tbody td {
    padding: 1rem 1.25rem;
    color: #334155;
    vertical-align: middle;
  }

  /* Job title */
  .mj-job-title {
    font-weight: 700;
    color: #0f172a;
    font-size: 0.9rem;
  }

  /* Badges */
  .mj-badge {
    display: inline-block;
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .mj-badge-level {
    background: #eff6ff;
    color: #3b82f6;
    border: 1px solid #bfdbfe;
  }
  .mj-badge-active {
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  }
  .mj-badge-closed {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  /* Date */
  .mj-date { color: #64748b; font-size: 0.82rem; }

  /* Action buttons */
  .mj-actions { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .mj-btn {
    padding: 0.3rem 0.75rem;
    border-radius: 0.6rem;
    font-size: 0.75rem;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.15s;
  }
  .mj-btn-delete { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
  .mj-btn-delete:hover { background: #dc2626; color: #fff; }
  .mj-btn-edit { background: #eff6ff; color: #3b82f6; border-color: #bfdbfe; }
  .mj-btn-edit:hover { background: #3b82f6; color: #fff; }
  .mj-btn-view { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
  .mj-btn-view:hover { background: #16a34a; color: #fff; }

  /* Empty state */
  .mj-empty {
    text-align: center;
    padding: 3rem;
    color: #94a3b8;
    font-size: 0.9rem;
  }

    `}
  </style>
   {error && (
      <div className="state-box">
        <p className="error-text">{error}</p>
      </div>
    )}
 
  {!error  && (  <Container className="mj-wrap">
      <div className="mj-header">
        <h2>Job List</h2>
        <div className="d-flex align-items-center gap-3">
          <p className="mj-count">Showing <span>{jobs.length}</span> job{jobs.length !== 1 ? 's' : ''}</p>
          <button className="mj-btn-add" onClick={() => navigate("/employer/addjob")}>+ Add New Job</button>
        </div>
      </div>
      
        <div className="mj-table-wrap">
      <Table  className="mj-table">
        <thead>
          <tr >
            <th>No.s</th>
            <th>Name</th>
            <th>Location</th>
            <th>Experience Level</th>
           <th>createdAt</th>
            <th>deadline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job,i) => (
              <tr key={job._id} className="align-middle">
                 <td>{i + 1}</td>
               <td><span className="mj-job-title">{job.title}</span></td>
        <td >{job.location}</td> 
        <td><span className="mj-badge mj-badge-level">{job.experienceLevel}</span></td>
         <td className="mj-date">{new Date(job.createdAt).toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'short', 
  day: 'numeric' 
})}</td>
       
        <td className="mj-date">{new Date(job.deadline).toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'short', 
  day: 'numeric' 
})}</td>  
        
       
               
                <td>
                  <div className="mj-actions">
                    <button className="mj-btn mj-btn-delete" onClick={() => handleDelete(job._id)}>Delete</button>
                    <button className="mj-btn mj-btn-edit" onClick={() => navigate(`/employer/editjob/${job._id}`)}>Edit</button>
                    <button className="mj-btn mj-btn-view" onClick={() => navigate(`/employer/viewapplicants/${job._id}`)}>Applicants</button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No Jobs posted yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      </div>
    </Container>)}
  
  
  
  
  </>
)
}
export default ManageJobs;