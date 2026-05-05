import { useEffect, useState } from "react";
import useAxios from '../../hooks/axios'
import toast from "react-hot-toast";
import { useSelector } from "react-redux";


function EmployerDashboard(){
const axios = useAxios();
const user = useSelector((state)=>state.auth.user);
const [loading,setLoading]= useState(false);
 const [data,setData] = useState({
    totalJobs:0,
    totalApplicants:0,
    shortlisted:0,
    pending:0,

    
 });
 useEffect(()=>{

      const fetchdata=async()=>{
        try{
            setLoading(true);
            const {data} = await axios.get("/employer/dashboardstatus");
            setData({
                totalJobs:data.totalJobs,
                totalApplicants:data.totalApplicants,
                shortlisted:data.shortlisted,
                pending:data.pending
            });

        }
        catch(error){
            toast.error(error.response?.data?.message ||"failed to load status");

        }
        finally{
            setLoading(false);
        }
      }
      fetchdata();
 },[]);

return(
    <>
    <style>
        {`
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
          .page-title span {
          background: linear-gradient(135deg, #7c6af7, #f76a8c);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        // .page-subtitle {
        //   font-size: 0.82rem;
        //   color: rgba(255,255,255,0.35);
        //   margin-bottom: 1.5rem;
        // }
        // .page-subtitle span { color: #7c6af7; font-weight: 600; }
        /* DETAIL STAT CARDS */
        .detail-cards {
          display: grid;
          grid-template-columns:1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.2rem;
          flex-wrap: wrap;
        }
          @media (max-width: 600px) {
  .detail-cards {
    grid-template-columns: 1fr;
  }
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
          padding:40px 10px;
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
        }`}
    </style>
     {loading && (
        <div className="state-box">
          <div className="spinner"></div>
          <p>Loading...</p>
        
        </div>

      )}
      {!loading && (
        <div className="jobs-page">
           <h1 className="page-title mb-3">
            Hi, <span> {user?.name}</span>
          </h1>
         
            <div className="detail-cards">
                    <div className="detail-card">
                      <p className="detail-label">Active Jobs</p>
                      <p className="detail-value" >
                        {data.totalJobs}
                      </p>
                    </div>
                    <div className="detail-card">
                      <p className="detail-label">Total Applicants</p>
                      <p className="detail-value">{data.totalApplicants}</p>
                    </div>
                    <div className="detail-card">
                      <p className="detail-label">Shortlisted</p>
                      <p className="detail-value">
                        {data.shortlisted}
                      </p>
                    </div>
                    <div className="detail-card">
                      <p className="detail-label">Pending</p>
                      <p className="detail-value" >
                        {data.pending}
                      </p>
                    </div>
                  </div>
        </div>
        
      )}
     
                  
    
    
    </>
)


}
export default EmployerDashboard;