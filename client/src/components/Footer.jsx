// Footer.jsx
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Footer() {
     const user = useSelector((state) => state.auth.user);
  const role = user?.role; // "employer" | "jobseeker" | null (not logged in)

  return (
    <>
    <style>
        {`
        /* Footer.css */
.footer {
  background: #0a0a14;
  font-family: 'DM Sans', sans-serif;
  border-top: 1px solid rgba(255,255,255,0.07);
  padding: 3rem 3rem 1.5rem;
}
.footer-top {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2.5rem;
}
  .brand {
        font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.35rem;
        background: linear-gradient(135deg, #fff 40%, #7c6af7);
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent;
        text-decoration: none;
    }
.brand-text { font-size: 0.82rem; color: rgba(255,255,255,0.35); line-height: 1.8; max-width: 220px; }
.col-title { font-size: 0.75rem; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 1rem; }
.col-links { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
.col-links a { font-size: 0.83rem; color: rgba(255,255,255,0.4); text-decoration: none; }
.col-links a:hover { color: #fff; }
.footer-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 1.2rem; }
.footer-bottom { display: flex; justify-content: space-between; align-items: center; }
.copy { font-size: 0.78rem; color: rgba(255,255,255,0.25); }

/* Mobile */
@media (max-width: 600px) {
  .footer-top { grid-template-columns: 1fr 1fr; }
}
        `}
    </style>
     <footer className="footer">
      <div className="footer-top">
        <div>
          <p className="brand">
            <i className="bi bi-briefcase-fill me-2" style={{ WebkitTextFillColor: "#7c6af7" }}></i>hire<span>Flow</span></p>
          <p className="brand-text">
            AI-powered hiring platform connecting the right candidates
            with the right jobs — faster and fairer.
          </p>
        </div>
        <div>
          <p className="col-title">Company</p>
          <ul className="col-links">
            <li><Link to="/about">About us</Link></li>
           
            <li><Link to="/contact">Contact</Link></li>
            
          </ul>
        </div>
        {role === 'employer' && (
          <div>
            <p className="col-title">Employer</p>
            <ul className="col-links">
              <li><Link to="/employer/dashboard">Dashboard</Link></li>
              <li><Link to="/employer/addjob">Post a job</Link></li>
              <li><Link to="/employer/joblist">My jobs</Link></li>
              <li><Link to="/employer/profile">Profile</Link></li>
            </ul>
          </div>
        )}
         {role === 'jobseeker' && (
          <div>
            <p className="col-title">Jobseeker</p>
            <ul className="col-links">
              <li><Link to="/browse-jobs">Browse jobs</Link></li>
              <li><Link to="/my-applications">My applications</Link></li>
              <li><Link to="/profile">My profile</Link></li>
              
            </ul>
          </div>
        )}
         {!role && (
          <div>
            <p className="col-title">Get started</p>
            <ul className="col-links">
              <li><Link to="/register">Sign up</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/jobs">Browse jobs</Link></li>
            </ul>
          </div>
        )}
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <p className="copy">© 2026 hireFlow. All rights reserved.</p>
      </div>
    </footer></>
   
  );
}

export default Footer;