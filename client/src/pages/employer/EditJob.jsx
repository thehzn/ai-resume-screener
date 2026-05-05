import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxios from "../../hooks/axios";
import toast from "react-hot-toast";


function EditJob(){
    const {id} = useParams();
    const navigate = useNavigate();
    const [jobDetails,setJobDetails] = useState({
          title: '',
        description: '',
          skills:[''],
          location: '',
        jobType: '',
       experienceLevel:'',
        salaryRange: {      
    min: '',
    max: '',
    currency: 'INR',  
  },
  deadline:'',
    });
    const axios = useAxios();
    const [error,setError]= useState("");
    const [loading,setLoading] = useState(false);



    useEffect(()=>{
        const fetchjob=async(id)=>{
           try{
            setError("");
            setLoading(true);
              const {data} = await axios.get(`/job/getjobdetails/${id}`);
            console.log(data.job);
            
              setJobDetails({
                 title: data.job.title,
  description: data.job.description,
  jobType: data.job.jobType,
  location: data.job.location,
  experienceLevel: data.job.experienceLevel,
  deadline: data.job.deadline.split('T')[0],
  salaryRange: {
    min: data.job.salaryRange.min,
    max: data.job.salaryRange.max,
    currency: data.job.salaryRange.currency,
  },
  skills: data.job.skills,
             } );

           }
           catch(error){
              setError(error.response?.data?.message || "Failed to load result.");
           }
           finally{
            setLoading(false);
           }

        }
        fetchjob(id);
    },[]);

      const handleChange = (e) => {
    setJobDetails({ ...jobDetails, [e.target.id]: e.target.value });
  };
  const addSkill = ()=>{
    setJobDetails({...jobDetails,skills:[...jobDetails.skills,'']})
  };

  const removeSkill = (index)=>{
    setJobDetails({...jobDetails,skills:jobDetails.skills.filter((_,i)=>i!==index)});
  };

  const handleSkillChange = (index, value) => {
  const updated = [...jobDetails.skills];
  updated[index] = value;
  setJobDetails({ ...jobDetails, skills: updated });
};
const handleSubmit= async(e)=>{
    e.preventDefault();
    try{
 setLoading(true);
 setError("");
 const {data} = await axios.patch(`/job/updatejob/${id}`,jobDetails);
 if(data.success){
    setLoading(false);
    setJobDetails(data.job);
   navigate('/employer/joblist');
    toast.success("job details updated successfully");
 }


    }
    catch(error){
         setError(error.response?.data?.message || "Failed to update job details.");
    }
    

}


    return(
        <>
        <style>{`
        .profile-section {
          min-height: 100vh;
          background: #0a0a14;
          display:flex;
          flex-direction:column;
           align-items: center;
          justify-content:flex-start;
        }
        .profile-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          color: #fff;
          font-size: clamp(2rem, 5vw, 3.5rem);
          padding:40px;
        }
        .profile-title span {
          background: linear-gradient(135deg, #7c6af7, #f76a8c);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .profile-sub { color: rgba(255,255,255,0.45); font-size: 1rem; }
       
        .search-input {
          background: rgba(255,255,255,0.07) !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          border-right: none !important;
          color: #fff !important;
          border-radius: 10px 0 0 10px !important;
          padding: 0.75rem  !important;
          display:flex;
          justify-content:space-around;
          gap:50px
        }
          .search-input .options{  color: rgba(255,255,255,0.3) !important;
          }
        .search-input::placeholder { color: rgba(255,255,255,0.3) !important; }
        .search-input:focus { 
          border-color: rgba(124,106,247,0.5) !important; 
          box-shadow: none !important;
          background: rgba(255,255,255,0.09) !important;
        }
        
         
          .error-msg{
          color: #d5f149 !important;
          font-size:0.78rem; 
          }
        .create-btn {
          color: #282441;
           background: linear-gradient(135deg, #7c6af7, #9b8df9) !important;
          border: none !important;
          border-radius:  10px  !important;
          padding: 0.85rem 1.4rem !important;
          font-weight: 500 !important;
        }
         
        
      `}</style>
<section className="profile-section">
        <div className="container text-center">
          <h1 className="profile-title mb-3">
            Edit your<span> Job</span>
          </h1>
          <p className="profile-sub mb-4">
            Update the job details below.
          </p>
          

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="row justify-content-center mb-3">
            <div className="col-md-7 col-lg-6">
                 {error && <div className="alert alert-danger">{error}</div>}
              <div className=" search-input mb-3 ">
                <label htmlFor="title" >Title</label>
                <input
                id="title"
                  type="text"
                  className="form-control "
                  placeholder="e.g. Frontend developer"
                  value={jobDetails.title}
                  onChange={handleChange}
                />
                
              </div>
              <div className="search-input mb-3">
  <label htmlFor="description">Description</label>
  <textarea
    id="description"        // ← must match the key in form state
    className="form-control"
    placeholder="e.g. We are looking for..."
    rows={4}
    value={jobDetails.description}
    onChange={handleChange}  // ← same handleChange works fine
  />
</div>
              <div className="search-input mb-3">
  <label>Skills</label>
  {jobDetails.skills.map((skill, index) => (
    <div key={index} className="d-flex gap-2 mb-2">
      <input
        type="text"
        className="form-control"
        placeholder="e.g. React, Node.js"
        value={skill}
        onChange={(e) => handleSkillChange(index, e.target.value)}
      />
      {jobDetails.skills.length > 1 && (
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => removeSkill(index)}
        >
          ✕
        </button>
      )}
    </div>
  ))}
  <button
    type="button"
    className="btn btn-outline-secondary btn-sm"
    onClick={addSkill}
  >
    + Add skill
  </button>
</div>
              <div className=" search-input mb-3">
             <label htmlFor="location">Location</label>
             <input
                  id="location"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Bangalore,India"
                  value={jobDetails.location}
                  onChange={handleChange}
             />
            </div>
            <div className="search-input mb-3">
  <label htmlFor="jobType">Job Type</label>
  <select
    id="jobType"           // ← must match the key in form state
    className="form-control"
    value={jobDetails.jobType}
    onChange={handleChange} // ← same handleChange works fine
  >
    <option className="options" value="">Select job type</option>
    <option value="full-time">Full Time</option>
    <option value="part-time">Part Time</option>
    <option value="internship">Internship</option>
    <option value="remote">Remote</option>
    <option value="hybrid">Hybrid</option>
  </select>
</div>
 <div className="search-input mb-3">
  <label htmlFor="experienceLevel">Experience Level</label>
  <select
    id="experienceLevel"           // ← must match the key in form state
    className="form-control"
    value={jobDetails.experienceLevel}
    onChange={handleChange} // ← same handleChange works fine
  >
    <option className="options"  value="">Select Experience Level</option>
    <option value="fresher">Fresher</option>
    <option value="junior">Junior</option>
    <option value="mid">Mid</option>
    <option value="senior">Senior</option>
  </select>
</div>
<div className="search-input mb-3">
  <label>Salary Range</label>
  <div className="d-flex gap-2">
    <input
      type="number"
      className="form-control"
      placeholder="Min e.g. 30000"
      value={jobDetails.salaryRange.min}
      onChange={(e) =>
       setJobDetails({ ...jobDetails, salaryRange: { ...jobDetails.salaryRange, min: e.target.value } })
      }
    />
    <input
      type="number"
      className="form-control"
      placeholder="Max e.g. 60000"
      value={jobDetails.salaryRange.max}
      onChange={(e) =>
        setJobDetails({ ...jobDetails, salaryRange: { ...jobDetails.salaryRange, max: e.target.value } })
      }
    />
    <select
      className="form-control"
      value={jobDetails.salaryRange.currency}
      onChange={(e) =>
        setJobDetails({ ...jobDetails, salaryRange: { ...jobDetails.salaryRange, currency: e.target.value } })
      }
    >
      <option value="INR">INR</option>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
    </select>
  </div>
</div>
<div className=" search-input mb-3 ">
                <label htmlFor="deadline" >Deadline</label>
                <input
                id="deadline"
                  type="date"
                  className="form-control "
                 
                  value={jobDetails.deadline}
                  onChange={handleChange}
                />
                
              </div>
            
             <button
                type="submit"
                className="btn btn-primary w-100 create-btn"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>

         
        </div>
      </section>
        
        
        </>
    )


}
export default EditJob;