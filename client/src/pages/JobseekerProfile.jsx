import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from "react-redux";
import useAxios from '../hooks/axios';
import { useNavigate } from 'react-router-dom';

function JobseekerProfile() {
  const axios = useAxios();
  const navigate = useNavigate();
const user= useSelector((state)=>state.auth.user);
const [profile,setProfile] =useState(null);
 const [loading, setLoading] = useState(true);
 const BASE_URL = 'http://localhost:4000';
useEffect(()=>{
  const fetchdata=async()=>{
    try{
      const {data} = await axios.get("/jobseeker/getprofile");
       if (data.success){
        setProfile(data.profile);
        console.log(data.profile);
       } 
    }
    catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
     
  }
   fetchdata();
},[]);

  return (
    <div>
      <style>
        {`
        .emp-page {
  background: #0a0a14;
  font-family: 'DM Sans', sans-serif;
  color: #e8e8f0;
  padding: 2.5rem 2rem;
  max-width: 680px;
  margin: 0;
  min-height: 100vh;
}

.emp-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.emp-logo {
  width: 62px;
  height: 62px;
  border-radius: 14px;
  background: rgba(124,106,247,0.15);
  border: 1px solid rgba(124,106,247,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 800;
  color: #a99ff5;
  flex-shrink: 0;
  text-transform: uppercase;
}

.emp-header h1 {
  font-size: 1.15rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 0.2rem;
}

.emp-header p {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.35);
}

.edit-btn {
  margin-left: auto;
  padding: 7px 16px;
  border-radius: 9px;
  background: rgba(124,106,247,0.12);
  color: #a99ff5;
  border: 1px solid rgba(124,106,247,0.25);
  font-size: 0.82rem;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  flex-shrink: 0;
  transition: background 0.2s;
}

.edit-btn:hover {
  background: rgba(124,106,247,0.22);
}

.divider {
  height: 1px;
  background: rgba(255,255,255,0.07);
  margin: 1.5rem 0;
}

.sec-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-item {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 0.9rem 1rem;
  margin-bottom:0.6rem;
}

.info-label {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.3rem;
}

.info-value {
  font-size: 0.88rem;
  color: #fff;
  font-weight: 500;
}

/* Mobile */
@media (max-width: 500px) {
  .emp-page { padding: 1.5rem 1rem; }
  .info-grid { grid-template-columns: 1fr; }
  .emp-logo { width: 50px; height: 50px; font-size: 1.1rem; }
}
     .keywords {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin: 0.8rem;
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
          background: rgba(102, 49, 210, 0.08);
          color: #9c90d4;
          border: 1px solid rgba(123, 47, 228, 0.3);}
        `}
    </style>
      <div className="emp-page">
 {loading && (
        <div className="state-box">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      <div className="emp-header">
        <div className="emp-logo">
          {user?.name?.charAt(0)}
        </div>
        <div>
          <h1>{user?.name}</h1>
          <p>
            {[user?.email,profile?.location]
              .filter(Boolean)
              .join(' · ') || 'No details added yet'}
          </p>
          <p>
            {profile?.totalExperienceYears
             || 'No experience added yet'}
          </p>
        </div>
        <button className="edit-btn"  onClick={() => navigate('/profile/edit')}>Edit profile</button>
      </div>

      <div className="divider" />

      <p className="sec-title">Basic info</p>
      <div className="info-grid">
        <div className="info-item">
          <p className="info-label">Phone</p>
          <p className="info-value">{profile?.phone || '—'}</p>
        </div>
        <div className="info-item">
          <p className="info-label">Location</p>
          <p className="info-value">{profile?.location || '—'}</p>
        </div>
        <div className="info-item">
          <p className="info-label">Experience</p>
          <p className="info-value">
  {profile?.totalExperienceYears
    ? `${profile.totalExperienceYears} years`
    : 'Fresher'}
</p>
        </div>
        <div className="info-item">
          <p className="info-label">Email</p>
          <p className="info-value">{user?.email || '—'}</p>
        </div>
      </div>
      <p className="sec-title">SKILLS</p>
      <div className="keywords">
              
                <div className="job-tags">
                 {profile?.skills?.length > 0
  ? profile.skills.map((skill, i) => (
      <span className="job-tag-found" key={i}>{skill} ✓</span>
    ))
  : <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.82rem' }}>
      No skills added yet
    </p>
}
                </div>

         </div>
         <div className="divider" />
         <p className="sec-title">SOCIAL LINKS</p>
          <div className="info-grid">
        <div className="info-item">
          
           <p className="info-value">{profile?.linkedIn || '__'}</p>
        </div> 
        <div className="info-item">
          
          <p className="info-value">{profile?.gitHub || '__'}</p>
        </div>
        </div>
        <div className="divider" />
          <div className="info-grid">
        <div className="info-item">
          <p className="sec-title">DEFAULT RESUME</p>
         <p className="js-resume-name">{profile?.defaultResume?.originalName}</p>

<button onClick={() => window.open(`${BASE_URL}/${profile.defaultResume?.fileUrl.replace(/\\/g, '/')}`, '_blank')}>
  View
</button>
        </div>
        </div>

    </div>
    </div>
  )
}

export default JobseekerProfile
