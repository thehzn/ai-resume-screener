// EditJobseekerProfile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../hooks/axios';
import toast from 'react-hot-toast';

function EditJobseekerProfile() {
  const axios = useAxios();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: '',
    location: '',
    linkedIn: '',
    gitHub: '',
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);

  // prefill existing data
  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get('/jobseeker/getprofile');
      if (data.success) {
        const p = data.profile;
        setForm({
          phone:    p.phone    || '',
          location: p.location || '',
          linkedIn: p.linkedIn || '',
          gitHub:   p.gitHub   || '',
        });
        setSkills(p.skills || []);
      }
    };
    fetch();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addSkill() {
    const val = skillInput.trim();
    if (!val || skills.includes(val)) return;
    setSkills([...skills, val]);
    setSkillInput('');
  }

  function removeSkill(s) {
    setSkills(skills.filter((sk) => sk !== s));
  }

  async function handleSave() {
    try {
      setLoading(true);
      const { data } = await axios.patch('/jobseeker/updateprofile', {
        ...form,
        skills,
      });
      if (data.success) {
        toast.success('Profile updated');
        navigate('/profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .edit-page {
          background: #0a0a14;
          font-family: 'DM Sans', sans-serif;
          color: #e8e8f0;
          padding: 2.5rem 2rem;
          
          margin: 0;
          min-height: 100vh;
        }
        .edit-page-title { font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 0.3rem; }
        .edit-page-sub { font-size: 0.82rem; color: rgba(255,255,255,0.35); margin-bottom: 2rem; }
        .edit-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 1.5rem 0; }
        .edit-sec-title { font-size: 0.72rem; font-weight: 700; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 1rem; }
        .edit-field { margin-bottom: 1rem; }
        .edit-field label { font-size: 0.78rem; color: rgba(255,255,255,0.45); display: block; margin-bottom: 0.4rem; }
        .edit-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; padding: 9px 12px; color: #fff; font-size: 0.88rem; font-family: inherit; outline: none; }
        .edit-input:focus { border-color: #7c6af7; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .skill-row { display: flex; gap: 0.6rem; }
        .skill-row .edit-input { flex: 1; }
        .add-btn { padding: 9px 14px; border-radius: 9px; background: rgba(124,106,247,0.15); color: #a99ff5; border: 1px solid rgba(124,106,247,0.25); font-size: 0.82rem; cursor: pointer; font-family: inherit; }
        .skills-wrap { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.8rem; }
        .skill-pill { font-size: 0.75rem; padding: 4px 10px; border-radius: 100px; background: rgba(124,106,247,0.1); color: #a99ff5; border: 1px solid rgba(124,106,247,0.2); display: flex; align-items: center; gap: 6px; }
        .skill-pill button { background: none; border: none; color: #a99ff5; cursor: pointer; font-size: 1rem; line-height: 1; padding: 0; }
        .save-btn { width: 100%; padding: 11px; border-radius: 10px; background: linear-gradient(135deg,#7c6af7,#9b8df9); color: #fff; border: none; font-size: 0.9rem; font-weight: 600; cursor: pointer; font-family: inherit; margin-top: 1.5rem; }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .cancel-btn { width: 100%; padding: 10px; border-radius: 10px; background: transparent; color: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.08); font-size: 0.88rem; cursor: pointer; font-family: inherit; margin-top: 0.6rem; }
        @media (max-width: 500px) { .two-col { grid-template-columns: 1fr; } }
      `}</style>

      <div className="edit-page">
        <p className="edit-page-title">Edit profile</p>
        <p className="edit-page-sub">Update your personal details and skills</p>

        {/* Basic info */}
        <p className="edit-sec-title">Basic info</p>
        <div className="two-col">
          <div className="edit-field">
            <label>Phone</label>
            <input className="edit-input" name="phone" value={form.phone}
              onChange={handleChange} placeholder="+91 98765 43210" />
          </div>
          <div className="edit-field">
            <label>Location</label>
            <input className="edit-input" name="location" value={form.location}
              onChange={handleChange} placeholder="Kochi, Kerala" />
          </div>
        </div>

        <div className="edit-divider" />

        {/* Social links */}
        <p className="edit-sec-title">Social links</p>
        <div className="edit-field">
          <label>LinkedIn URL</label>
          <input className="edit-input" name="linkedIn" value={form.linkedIn}
            onChange={handleChange} placeholder="https://linkedin.com/in/yourname" />
        </div>
        <div className="edit-field">
          <label>GitHub URL</label>
          <input className="edit-input" name="gitHub" value={form.gitHub}
            onChange={handleChange} placeholder="https://github.com/yourname" />
        </div>

        <div className="edit-divider" />

        {/* Skills */}
        <p className="edit-sec-title">Skills</p>
        <div className="skill-row">
          <input
            className="edit-input"
            placeholder="Type a skill and press Add"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
          />
          <button className="add-btn" onClick={addSkill}>+ Add</button>
        </div>
        <div className="skills-wrap">
          {skills.map((s, i) => (
            <div key={i} className="skill-pill">
              {s}
              <button onClick={() => removeSkill(s)}>×</button>
            </div>
          ))}
        </div>

        <div className="edit-divider" />

        <button className="save-btn" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save changes'}
        </button>
        <button className="cancel-btn" onClick={() => navigate('/profile')}>
          Cancel
        </button>
      </div>
    </>
  );
}

export default EditJobseekerProfile;