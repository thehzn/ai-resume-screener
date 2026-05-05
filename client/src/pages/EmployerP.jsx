import { useSelector } from "react-redux";




function EmployerP() {
  const user = useSelector((state) => state.auth.user);
  const employerProfile = useSelector((state) => state.auth.employerProfile);
 

  return (
    <>
    <style>
        {`
        .emp-page {
  background: #0a0a14;
  font-family: 'DM Sans', sans-serif;
  color: #e8e8f0;
  padding: 2.5rem 2rem;
  max-width: 680px;
  margin: 0 auto;
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
        `}
    </style>
    <div className="emp-page">

      <div className="emp-header">
        <div className="emp-logo">
          {employerProfile?.companyName?.charAt(0) || user?.name?.charAt(0)}
        </div>
        <div>
          <h1>{employerProfile?.companyName || user?.name}</h1>
          <p>
            {[employerProfile?.location, employerProfile?.website]
              .filter(Boolean)
              .join(' · ') || 'No details added yet'}
          </p>
        </div>
        <button className="edit-btn">Edit profile</button>
      </div>

      <div className="divider" />

      <p className="sec-title">Company info</p>
      <div className="info-grid">
        <div className="info-item">
          <p className="info-label">Company name</p>
          <p className="info-value">{employerProfile?.companyName || '—'}</p>
        </div>
        <div className="info-item">
          <p className="info-label">Location</p>
          <p className="info-value">{employerProfile?.location || '—'}</p>
        </div>
        <div className="info-item">
          <p className="info-label">Website</p>
          <p className="info-value" style={{ color: '#a99ff5' }}>
            {employerProfile?.website || '—'}
          </p>
        </div>
        <div className="info-item">
          <p className="info-label">Email</p>
          <p className="info-value">{user?.email || '—'}</p>
        </div>
      </div>

    </div></>
    
  );
}
export default EmployerP;