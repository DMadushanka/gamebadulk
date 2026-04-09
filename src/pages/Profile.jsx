import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Profile = ({ user, userData }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (!user || !userData) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Please login to view your profile</h2>
        <Link to="/auth" className="primary-btn" style={{ marginTop: '20px' }}>Login Now</Link>
      </div>
    );
  }

  const roleColors = {
    farmer: { bg: '#e8f5e9', text: '#2E7D32', label: 'Farmer & Supplier' },
    admin: { bg: '#e3f2fd', text: '#0d47a1', label: 'System Administrator' },
    transport: { bg: '#fff3e0', text: '#e65100', label: 'Logistics Partner' },
    customer: { bg: '#f3e5f5', text: '#7b1fa2', label: 'Marketplace Buyer' }
  };

  const currentRole = roleColors[userData.role] || roleColors.customer;

  return (
    <>
      <style>{`
        .profile-container {
          min-height: 80vh;
          background: #f8fbf8;
          padding-bottom: 80px;
        }
        .profile-header {
          height: 250px;
          background: linear-gradient(135deg, #07420b 0%, #1b5e20 100%);
          position: relative;
        }
        .profile-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(to top, #f8fbf8, transparent);
        }
        .profile-content {
          margin-top: -100px;
          position: relative;
          z-index: 10;
        }
        .profile-card {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.06);
          padding: 40px;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .profile-avatar-wrap {
          text-align: center;
          margin-bottom: 30px;
        }
        .profile-avatar {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: #fff;
          padding: 5px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid #fff;
        }
        .profile-avatar-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #f0f7f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2E7D32;
          font-size: 60px;
        }
        .profile-name {
          font-size: 32px;
          font-weight: 800;
          color: #111;
          margin-bottom: 8px;
          text-align: center;
        }
        .profile-role-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 25px;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 30px;
        }
        .info-group {
          padding: 24px;
          background: #fdfdfd;
          border-radius: 16px;
          border: 1px solid #f0f4f0;
          transition: all 0.3s ease;
        }
        .info-group:hover {
          background: #fff;
          box-shadow: 0 5px 15px rgba(0,0,0,0.03);
          border-color: #2E7D32;
        }
        .info-label {
          color: #888;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .info-value {
          color: #222;
          font-size: 18px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .info-icon {
          color: #2E7D32;
          width: 32px;
          height: 32px;
          background: rgba(46, 125, 50, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .stats-row {
          display: flex;
          gap: 20px;
          margin-top: 40px;
          padding-top: 40px;
          border-top: 1px solid #f0f0f0;
        }
        .stat-card {
          flex: 1;
          text-align: center;
          padding: 20px;
          border-radius: 16px;
          background: #fafafa;
        }
        .stat-value {
          font-size: 24px;
          font-weight: 900;
          color: #111;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 12px;
          color: #888;
          font-weight: 700;
          text-transform: uppercase;
        }
        .profile-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 40px;
        }
        .action-btn {
          padding: 12px 30px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .btn-edit {
          background: #fff;
          border: 2px solid #2E7D32;
          color: #2E7D32;
        }
        .btn-edit:hover {
          background: #2E7D32;
          color: #fff;
        }
        .btn-logout {
          background: #fff;
          border: 2px solid #ff5252;
          color: #ff5252;
        }
        .btn-logout:hover {
          background: #ff5252;
          color: #fff;
        }

        @media (max-width: 767px) {
          .profile-card { padding: 25px; }
          .profile-name { font-size: 24px; }
          .profile-header { height: 180px; }
          .profile-content { margin-top: -80px; }
          .profile-avatar { width: 110px; height: 110px; }
          .profile-actions { flex-direction: column; }
          .action-btn { justify-content: center; }
        }
      `}</style>

      <div className="profile-container">
        <div className="profile-header">
          {/* Animated decorative shapes */}
          <div style={{position: 'absolute', top: '20%', left: '10%', width: '100px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'}}></div>
          <div style={{position: 'absolute', top: '40%', right: '15%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%'}}></div>
        </div>

        <div className="container profile-content">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="profile-card">
                <div className="profile-avatar-wrap">
                  <div className="profile-avatar">
                    <div className="profile-avatar-inner">
                      <i className="fa fa-user"></i>
                    </div>
                  </div>
                </div>

                <div style={{textAlign: 'center'}}>
                  <h1 className="profile-name">{userData.name || 'Gamebadu Member'}</h1>
                  <div className="profile-role-badge" style={{ background: currentRole.bg, color: currentRole.text }}>
                    {currentRole.label}
                  </div>
                </div>

                <div className="profile-grid">
                  <div className="info-group">
                    <div className="info-label">Email Address</div>
                    <div className="info-value">
                      <div className="info-icon"><i className="fa fa-envelope"></i></div>
                      {userData.email || 'No email provided'}
                    </div>
                  </div>

                  <div className="info-group">
                    <div className="info-label">Mobile Number</div>
                    <div className="info-value">
                      <div className="info-icon"><i className="fa fa-phone"></i></div>
                      {userData.phone || 'Not linked'}
                    </div>
                  </div>

                  <div className="info-group">
                    <div className="info-label">Home District</div>
                    <div className="info-value">
                      <div className="info-icon"><i className="fa fa-map-marker"></i></div>
                      {userData.district || 'Island Wide'}
                    </div>
                  </div>

                  <div className="info-group">
                    <div className="info-label">Account Status</div>
                    <div className="info-value">
                      <div className="info-icon"><i className="fa fa-check-circle"></i></div>
                      Verified Member
                    </div>
                  </div>
                </div>

                <div className="stats-row">
                  <div className="stat-card">
                    <div className="stat-value">Active</div>
                    <div className="stat-label">Member Status</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">#{userData.role.charAt(0).toUpperCase()}</div>
                    <div className="stat-label">User ID Prefix</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">2026</div>
                    <div className="stat-label">Joined Year</div>
                  </div>
                </div>

                <div className="profile-actions">
                  <Link to={`/${userData.role}`} className="action-btn btn-edit">
                    <i className="fa fa-th-large"></i> Go to Dashboard
                  </Link>
                  <button onClick={handleLogout} className="action-btn btn-logout">
                    <i className="fa fa-sign-out"></i> Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
