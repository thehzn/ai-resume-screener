// AboutUs.jsx

function About() {
  return (
    <>
      <style>{`
        .about-page {
          background: #0a0a14;
          font-family: 'DM Sans', sans-serif;
          color: #e8e8f0;
          padding: 3rem 2rem;
          width: 100%;
          margin: 0;
          text-align:center;
        }
        .about-tag {
          font-size: 0.72rem;
          font-weight: 600;
          color: #7c6af7;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.8rem;
        }
        .about-title {
          font-size: 2rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .about-title span { color: #7c6af7; }
        .about-lead {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.9;
          margin-bottom: 2.5rem;
        }
        .about-divider {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 2.5rem 0;
        }
        .about-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .about-stat {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 1.2rem;
          text-align: center;
        }
        .about-stat-num {
          font-size: 1.8rem;
          font-weight: 800;
          color: #7c6af7;
        }
        .about-stat-lbl {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.35);
          margin-top: 0.3rem;
        }
        .about-section-title {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 1rem;
        }
        .about-item {
          display: flex;
          gap: 0.8rem;
          margin-bottom: 1rem;
          justify-content:flex-start;
        }
        .about-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 6px;
        }
        .about-item-text {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          text-align:left;
        }
        .about-item-text strong {
          color: #fff;
          display: block;
          margin-bottom: 0.1rem;
        }
        .about-cta {
          margin-top: 2.5rem;
          display: flex;
          gap: 0.8rem;
        }
        .btn-primary {
          padding: 9px 22px;
          border-radius: 9px;
          background: linear-gradient(135deg, #7c6af7, #9b8df9);
          color: #fff;
          border: none;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
        }
        .btn-outline {
          padding: 9px 22px;
          border-radius: 9px;
          background: transparent;
          color: #a99ff5;
          border: 1px solid rgba(124,106,247,0.3);
          font-size: 0.85rem;
          cursor: pointer;
          font-family: inherit;
        }
      `}</style>

      <div className="about-page">

        {/* Hero */}
        <p className="about-tag">About us</p>
        <h1 className="about-title">Hiring smarter with <span>AI</span></h1>
        <p className="about-lead">
          hireai uses artificial intelligence to match the right candidates
          to the right jobs — faster and fairer than traditional hiring.
          We built this to remove the guesswork for both employers and jobseekers.
        </p>

       

        <div className="about-divider" />

        {/* What we do */}
        <p className="about-section-title">What we do</p>
        <div className="about-item">
          <div className="about-dot" style={{ background: '#7c6af7' }} />
          <div className="about-item-text">
            <strong>AI resume matching</strong>
            Every application is scored against job requirements instantly —
            with a clear summary and keyword breakdown.
          </div>
        </div>
        <div className="about-item">
          <div className="about-dot" style={{ background: '#7c6af7' }} />
          <div className="about-item-text">
            <strong>For employers</strong>
            See ranked applicants,
            Shortlist, review, or reject with one click.
          </div>
        </div>
        <div className="about-item">
          <div className="about-dot" style={{ background: '#7c6af7' }} />
          <div className="about-item-text">
            <strong>For jobseekers</strong>
            Know exactly how well your profile matches a job.
          </div>
        </div>

        <div className="about-divider" />

        {/* Values */}
        <p className="about-section-title">Our values</p>
        <div className="about-item">
          <div className="about-dot" style={{ background: '#88dc1b' }} />
          <div className="about-item-text">
            <strong>Fairness</strong>
            Scores are based on skills — not background or appearance.
          </div>
        </div>
        <div className="about-item">
          <div className="about-dot" style={{ background: '#f5a623' }} />
          <div className="about-item-text">
            <strong>Transparency</strong>
            Every AI decision is explained in plain language.
          </div>
        </div>
        <div className="about-item">
          <div className="about-dot" style={{ background: '#f76a8c' }} />
          <div className="about-item-text">
            <strong>Privacy</strong>
            Your data is never sold. Resumes are only visible to employers you applied to.
          </div>
        </div>

       

      </div>
    </>
  );
}

export default About;