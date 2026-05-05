import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAxios from '../hooks/axios';
import { updateProfile } from "../redux/authSlice";



function ResumeUpload(){
    const axios=useAxios();
    const [file,setFile] = useState(null);
    const [loading, setLoading] =useState(false);
    const [error,setError] =useState('');
    const navigate =useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state)=>state.auth.user);

    const handleFileChange= (e)=>{
        const selected = e.target.files[0];
        if(!selected) return;
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        if(!allowedTypes.includes(selected.type)){
            setError('Only PDF and DOCX files are allowed');
           setFile(null);
           return;
        }
        if(selected.size >5 *1024*1024){
             setError('File size must be under 5MB');
            setFile(null);
            return;
        }
        setError('');
        setFile(selected);
    }

    const handleUpload = async(e)=>{
        e.preventDefault();
            if (!file) { setError('Please select a file'); return; }

            try{
                setLoading(true);
                setError('');

                const formData = new FormData();
                formData.append('resume',file);

                const res = await axios.post('/resume/upload',formData , {
                     withCredentials: true,
                     headers: { 'Content-Type': 'multipart/form-data' }
                       });
                dispatch(updateProfile(res.data.user));
                navigate('/browse-jobs');

            }
            catch(err){
                setError(err.response?.data?.message || 'Upload failed');

            }
            finally{
                setLoading(false);
            }

    }

    return(
        <>
        
        <style>{`
        .resume-page {
          min-height: 100vh;
          background: #0a0a14;
          display:flex;
          flex-direction:column;
           align-items: center;
          justify-content:flex-start;
        }
        .resume-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          color: #fff;
          font-size: clamp(2rem, 5vw, 3.5rem);
          padding:40px;
        }
        .resume-title span {
          background: linear-gradient(135deg, #7c6af7, #f76a8c);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .resume-sub { color: rgba(255,255,255,0.45); font-size: 1rem; }
        .search-input {
          background: rgba(255,255,255,0.07) !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          border-right: none !important;
          color: #fff !important;
          border-radius: 10px 0 0 10px !important;
          padding: 0.75rem 1.2rem !important;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.3) !important; }
        .search-input:focus { 
          border-color: rgba(124,106,247,0.5) !important; 
          box-shadow: none !important;
          background: rgba(255,255,255,0.09) !important;
        }
        .browse-btn {
          background: linear-gradient(135deg, #7c6af7, #9b8df9) !important;
          border: none !important;
          border-radius: 0 10px 10px 0 !important;
          padding: 1rem 1.4rem !important;
          font-weight: 500 !important;
        }
          .hint{
          margin-top:5px;
          color:white!important;
          font-weight:200;
          font-size:0.68rem;
          }
          .error-msg{
          color: #d5f149 !important;
          font-size:0.78rem; 
          }
        .upload-btn {
          color: #282441;
           background: linear-gradient(135deg, #7c6af7, #9b8df9) !important;
          border: none !important;
          border-radius:  10px  !important;
          padding: 0.85rem 1.4rem !important;
          font-weight: 500 !important;
        }
          .skip-btn{
          color:white;
          background:none;
           border: none !important;
           
          }
        .browse-link:hover { color: #7c6af7; }
      `}</style>
        
        <div className="resume-page">

          <h1 className="resume-title">Upload Your <span> Resume</span></h1>
          <p className="resume-sub">
            Hi {user?.name?.split(' ')[0]}!Upload your resume to start applying for jobs.
          </p>

          <form onSubmit={handleUpload}>

            {/* Browse jobs    */}

            {/* <input  className="search-input" type="file" accept=".pdf , .docx" onChange={handleFileChange}
            />
            <span>Browse</span> */}
            <label style={{ cursor: 'pointer' }}>
  <input
  className="search-input"
    type="file"
    accept=".pdf,.docx"
    onChange={handleFileChange}
   
  />
  <span className="browse-btn">Browse</span>
</label>
             <p className="hint">PDF or DOCX (Max 5MB)</p>
             
            {error && <p className="error-msg">⚠️ {error}</p>}

             <button type="submit" className="upload-btn" disabled={loading || !file}>
              {loading ? 'Uploading...' : 'Upload Resume'}
            </button>
            <button type="button" className="skip-btn" onClick={() => navigate('/browse-jobs')}>

                 Skip for now
            </button>
          </form>

        </div>
        
        
        
        </>
    );
    




} 
export default ResumeUpload