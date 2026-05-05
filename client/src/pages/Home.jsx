import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${search}`);
  };

  return (
    <>
      <style>{`
        .home-section {
          min-height: 100vh;
          background: #0a0a14;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .home-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          color: #fff;
          font-size: clamp(2rem, 5vw, 3.5rem);
        }
        .home-title span {
          background: linear-gradient(135deg, #7c6af7, #f76a8c);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .home-sub { color: rgba(255,255,255,0.45); font-size: 1rem; }
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
        .search-btn {
          background: linear-gradient(135deg, #7c6af7, #9b8df9) !important;
          border: none !important;
          border-radius: 0 10px 10px 0 !important;
          padding: 0.75rem 1.4rem !important;
          font-weight: 500 !important;
        }
        .browse-link {
          color: rgba(255,255,255,0.4);
          font-size: 0.88rem;
          text-decoration: none;
          transition: color 0.2s;
        }
        .browse-link:hover { color: #7c6af7; }
      `}</style>

      <section className="home-section">
        <div className="container text-center">
          <h1 className="home-title mb-3">
            Find Your <span>Dream Job</span>
          </h1>
          <p className="home-sub mb-4">
            Browse thousands of listings from top companies. Your next opportunity is one search away.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="row justify-content-center mb-3">
            <div className="col-md-7 col-lg-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="🔍  Search jobs, skills, companies..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button className="btn btn-primary search-btn" type="submit">
                  Search
                </button>
              </div>
            </div>
          </form>

          <Link to="/jobs" className="browse-link">
            Browse all jobs →
          </Link>
        </div>
      </section>
    </>
  );
}