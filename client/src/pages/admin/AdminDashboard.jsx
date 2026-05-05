import { useEffect, useState } from "react";
import useAxios from "../../hooks/axios";
import toast from 'react-hot-toast';


function AdminDashboard(){

    const [stats,setStats] = useState({});
    const axios = useAxios();

    const fetchStats = async()=>{
        try{
        const {data} = await axios.get('/admin/dashboardstats');
             
             setStats(data);


        }
        catch(error){
            console.log("error fetfching status");
             toast.error(error?.response?.data?.message || error.message);
            
        }
    }
            

    useEffect(()=>{
       fetchStats();

    },[]);
    const statCards = [
  { label: "Total Users", value: stats.totalUsers, icon: "👥" },
  { label: "Pending Approvals", value: stats.approvalCount, icon: "⏳" },
  { label: "Active Job Listings", value: stats.totalJobs, icon: "💼" },
];
   
    return(
        <>
        <style>{`
        .dashboard-section {
          min-height: 100vh;
          background: #0a0a14;
          display: flex;
          flex-direction:column;
           gap:40px;
          align-items: center;
          justify-content: center;
          
        }
        .dashboard-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          color: #fff;
          margin-top:0;
          padding-top:0px;
          font-size: clamp(2rem, 5vw, 3.5rem);
        }
          .dashboard-title span {
          background: linear-gradient(135deg, #7c6af7, #f76a8c);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
          .cards{
          display:flex;
          gap:20px;
          padding:20px;
          flex-wrap:wrap;
          justify-content:center;
         
          

          }
          `}
          </style>

         <div className="dashboard-section">
            
      <h2 className="dashboard-title">Admin <span> Dashboard</span></h2>
 
      <div className="cards">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "24px 32px",
              minWidth: "180px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px" }}>{stat.icon}</div>
            <div style={{ fontSize: "36px", fontWeight: "700", margin: "8px 0" }}>
              {stat.value}
            </div>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>{stat.label}</div>
          </div>
        ))}
      </div>
     
    </div>
        
        
        </>
    )


}
export default AdminDashboard;