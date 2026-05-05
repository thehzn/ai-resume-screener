import { useEffect, useState } from "react";
import useAxios from "../hooks/axios";
import toast, { ToastBar, Toaster } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";


function ApplicationList(){
 const axios = useAxios();
 const navigate= useNavigate();
  const [result,setResult] =useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    setLoading(true);
   const fetchlist=async()=>{
   try{
         const {data}= await axios.get("/application/getapplications");
         setResult(data.applications);
         console.log(data);
         
        
         
    }
   catch(error){
     const errorMessage = error?.response?.data?.message || "failed to fetch the application list";
    toast.error(errorMessage);
   }
   finally{
    setLoading(false);
   }

   }
   fetchlist();
    
  },[]);
const handleDelete=async(id)=>{
    
    try{
        const {data} = await axios.get(`/application/deleteone/${id}`);

        if(data.success){
            toast.success(data.message ||"Deleted Successfully");
        }

    }
   catch (error) {
        toast.error(error.response?.data?.message || "Failed to load result.");
      } 
}
const handleClick= async(id)=>{
    navigate(`/analysis/${id}`);
}

  return(
    <>
    <style>
      {`
      .bg{
         background: #0d1117; border-radius: var(--ar-hero-radius);
//     padding: 3rem; color: #fff; position: relative;
//      margin-bottom:0;padding:20px;align-items:center;height:100vh;
.apply-btn {
          font-size: 0.8rem;
          padding: 6px 16px;
          border-radius: 8px;
          border: 1px solid rgba(124,106,247,0.2);
          color: #a99ff5;;
         
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          transition: opacity 0.2s;
          white-space: nowrap;
        }
          .jobs-header { margin-bottom: 1.8rem;text-align:center }
        .jobs-header h4 {
        text-align:center;
          font-family: 'Syne', sans-serif;
          font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 0.9rem;
        }
        .apply-btn:hover { opacity: 0.85; }
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
        //   .delete-badge {
        //   font-size: 0.7rem;
        //   padding: 3px 10px;
        //   border-radius: 100px;
        //   background: rgba(124,106,247,0.12);
        //   color: #a99ff5;
        //   border: 1px solid rgba(124,106,247,0.2);
        //   white-space: nowrap;
        //   text-transform: capitalize;
        // }
           .list-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.4rem;
          transition: all 0.22s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .list-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(135deg, #7c6af7, #f76a8c);
          opacity: 0; transition: opacity 0.25s;
        }
        .list-card:hover {
          border-color: rgba(124,106,247,0.25);
          background: rgba(124,106,247,0.04);
          transform: translateY(-3px);
        }
       

        .list-card-top {
          display: flex;
          flex-direction:row;
          gap:20px;
        justify-content:space-around;
          align-items:center;
          margin-bottom: 0.8rem;
        }
        .title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 0.2rem;
          background:#a99ff5;padding:10px;border-radius:50px
        }
        .list-summary { font-size: 0.9rem; color: rgba(255,255,255,0.35); }

.btn-group{
display:flex;
justify-content:flex-end;
gap:20px;

}
      }
      `}
    </style>
       {/* Loading — first fetch not done */}
      {loading && (
        <div className="state-box">
          <div className="spinner"></div>
          <p>Loading...</p>
        
        </div>

      )}
      {!loading && result.length==0 &&(
        <p>No Results found</p>
      )}


      {!loading &&(
        <div className="bg">
            <div className="jobs-header">
                <h4>Application List</h4>
         {result?.map((item)=>(
            <div className="list-card">
                
                <div className="list-card-top">
                    <h5 className="title">{item?.aiMatch?.matchScore}%</h5>
                    <p className="list-summary">{item?.aiMatch?.matchSummary}</p>
                </div>
                <div className="btn-group">
                   
                    <p className="apply-btn">{item.aiMatch?.generatedAt ? new Date(item.aiMatch.generatedAt).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
}) : "N/A"}</p>
                   <button className="apply-btn" onClick={()=>handleClick(item._id)}>View full details</button>
                <button className="apply-btn" onClick={()=>handleDelete(item._id)}><i className="bi bi-trash"></i></button>
                </div>
               
                </div>
         ))}
          


</div>
        </div>
      )}
    
    
    
    
    </>
  )




}
export default ApplicationList;