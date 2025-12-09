import React, { useEffect, useState } from 'react';
import { Footer, Navbar } from "../components";
import { useNavigate } from 'react-router-dom';
import '../styles/layout.css';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (!raw) return navigate('/login');
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.email) return navigate('/login');
      setEmail(parsed.email);
      setName(parsed.name || '');

      // Fetch current user data from API
      fetch(`/api/auth/user/${encodeURIComponent(parsed.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.email) {
            setName(data.name || '');
          }
        })
        .catch(() => {});
    } catch (err) {
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const updateData = { name };
      if (password && password.trim()) {
        updateData.password = password;
      }
      
      const res = await fetch(`/api/auth/user/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Profile updated successfully');
        // update localStorage name
        const raw = localStorage.getItem('user');
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            parsed.name = name;
            localStorage.setItem('user', JSON.stringify(parsed));
          } catch {}
        }
        setPassword('');
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="container my-3 py-3">
          <h1 className="text-center">My Profile</h1>
          <hr />

          <div className="row my-4 h-100">
            <div className="col-md-6 col-lg-5 col-sm-10 mx-auto">
              <form onSubmit={handleUpdate}>
                <div className="form my-3">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    readOnly
                  />
                </div>
                <div className="form my-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    readOnly
                  />
                </div>
                <div className="form my-3">
                  <label>New Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}
                <div className="text-center">
                  <button className="my-2 mx-auto btn btn-dark" type="submit">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
