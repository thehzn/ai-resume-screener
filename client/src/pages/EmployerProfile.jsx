import { useDispatch } from "react-redux";
import useAxios from "../hooks/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { setEmployerProfile, updateProfile } from "../redux/authSlice";


function EmployerProfile(){
    const axios = useAxios();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form , setForm] = useState({
       companyName: '',
       location: '',
       website: '', 
    });

    const [loading ,setLoading] = useState(false);
    const [error,setError]= useState(null);

     const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

    const handleSubmit = async(e)=>{
       e.preventDefault();
       setLoading(true);
       setError(null);
       try{
        const {data} = await axios.post('/employer/createemployerprofile',form);
        if(data.success){
            dispatch(setEmployerProfile(data.employer));
            
            dispatch(updateProfile(data.user));
            navigate('/dashboard');

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
            Create your <span> Employer Profile</span>
          </h1>
          <p className="profile-sub mb-4">
            Fill in your company details to start posting jobs and screening candidates using AI.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="row justify-content-center mb-3">
            <div className="col-md-7 col-lg-6">
                 {error && <div className="alert alert-danger">{error}</div>}
              <div className=" search-input mb-3 ">
                <label htmlFor="companyName" >Company name</label>
                <input
                id="companyName"
                  type="text"
                  className="form-control "
                  placeholder="e.g. Acme Technologies"
                  value={form.companyName}
                  onChange={handleChange}
                />
                
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
            <div className=" search-input mb-3">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              className="form-control"
              placeholder="https://yourcompany.org"
              value={form.website}
              onChange={handleChange}
             />
            </div>
             <button
                type="submit"
                className="btn btn-primary w-100 create-btn"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create profile'}
              </button>
            </div>
          </form>

         
        </div>
      </section>
</>
)


}
export default EmployerProfile