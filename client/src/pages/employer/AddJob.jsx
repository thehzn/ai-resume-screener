
import useAxios from "../../hooks/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";



function AddJob(){
    const axios = useAxios();

   
    const navigate = useNavigate();

    const [form , setForm] = useState({
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

    const [loading ,setLoading] = useState(false);
    const [error,setError]= useState(null);

     const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };
  const addSkill = ()=>{
    setForm({...form,skills:[...form.skills,'']})
  };

  const removeSkill = (index)=>{
    setForm({...form,skills:form.skills.filter((_,i)=>i!==index)});
  };

  const handleSkillChange = (index, value) => {
  const updated = [...form.skills];
  updated[index] = value;
  setForm({ ...form, skills: updated });
};



    const handleSubmit = async(e)=>{
       e.preventDefault();
       setLoading(true);
       setError(null);
       try{
        const {data} = await axios.post('/job/createjob',form);
        if(data.success){
            
            navigate('/employer/joblist');

        }

       }catch(err){
            setError(err.response?.data?.message || 'Something went wrong');
       }finally {
      setLoading(false);
    }


    };



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
            Add new <span> Job</span>
          </h1>
          <p className="profile-sub mb-4">
            Fill in the job details below.
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
                  value={form.title}
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
    value={form.description}
    onChange={handleChange}  // ← same handleChange works fine
  />
</div>
              <div className="search-input mb-3">
  <label>Skills</label>
  {form.skills.map((skill, index) => (
    <div key={index} className="d-flex gap-2 mb-2">
      <input
        type="text"
        className="form-control"
        placeholder="e.g. React, Node.js"
        value={skill}
        onChange={(e) => handleSkillChange(index, e.target.value)}
      />
      {form.skills.length > 1 && (
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
                  value={form.location}
                  onChange={handleChange}
             />
            </div>
            <div className="search-input mb-3">
  <label htmlFor="jobType">Job Type</label>
  <select
    id="jobType"           // ← must match the key in form state
    className="form-control"
    value={form.jobType}
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
    value={form.experienceLevel}
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
      value={form.salaryRange.min}
      onChange={(e) =>
        setForm({ ...form, salaryRange: { ...form.salaryRange, min: e.target.value } })
      }
    />
    <input
      type="number"
      className="form-control"
      placeholder="Max e.g. 60000"
      value={form.salaryRange.max}
      onChange={(e) =>
        setForm({ ...form, salaryRange: { ...form.salaryRange, max: e.target.value } })
      }
    />
    <select
      className="form-control"
      value={form.salaryRange.currency}
      onChange={(e) =>
        setForm({ ...form, salaryRange: { ...form.salaryRange, currency: e.target.value } })
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
                 
                  value={form.deadline}
                  onChange={handleChange}
                />
                
              </div>
            
             <button
                type="submit"
                className="btn btn-primary w-100 create-btn"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Job'}
              </button>
            </div>
          </form>

         
        </div>
      </section>
</>
)


}
export default AddJob;