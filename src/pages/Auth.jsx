import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import authBg from '../img/auth-bg.jpeg';
import '../css/auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'customer', locationLat: null, locationLng: null, addressText: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    const moveX = (e.pageX * -1) / 60;
    const moveY = (e.pageY * -1) / 60;
    const container = document.querySelector('.auth-container');
    if (container) {
      container.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    }
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          setFormData(prev => ({
            ...prev,
            locationLat: lat,
            locationLng: lng,
            addressText: data.display_name || 'Location saved successfully.'
          }));
        } catch (e) {
          setFormData(prev => ({
            ...prev, locationLat: lat, locationLng: lng, addressText: 'Coordinates saved.'
          }));
        }
        setGettingLocation(false);
      },
      (error) => {
        alert("Unable to retrieve your location. Please ensure location permissions are granted.");
        setGettingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isLogin && !formData.locationLat) {
      setError("Please detect your real-time location to create an account. This keeps our marketplace secure.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        navigate('/');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          locationLat: formData.locationLat,
          locationLng: formData.locationLng,
          addressText: formData.addressText
        });
        setSuccess('Account Created Successfully!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" onMouseMove={handleMouseMove} style={{ backgroundImage: `url(${authBg})` }}>
      <Link to="/" className="back-to-site"><i className="fa fa-arrow-left"></i> Back to Home</Link>
      
      {success && (
        <div id="success-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff' }}>
            <div style={{ background: 'var(--primary)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', marginBottom: '20px', boxShadow: '0 0 30px rgba(46,125,50,0.5)' }}>
                <i className="fa fa-check"></i>
            </div>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, marginBottom: '10px' }}>Welcome to the Village!</h2>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)' }}>{success}</p>
            <p style={{ fontSize: '14px', marginTop: '20px', opacity: 0.6 }}>Redirecting to your dashboard...</p>
        </div>
      )}

      <div className="auth-container animate revealed">
        <div className="auth-logo">
          <div className="brand-logo">GAMEBADU<span>.LK</span></div>
          <p>Community Driven Marketplace</p>
        </div>

        {error && <div className="alert alert-danger" style={{ borderRadius: '12px', fontSize: '14px' }}>{error}</div>}

        <div className="auth-tabs">
          <div className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</div>
          <div className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Sign Up</div>
        </div>

        {isLogin ? (
          <div id="login-form">
            <h2>Welcome Back</h2>
            <p>Enter your credentials to access your account.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="hello@example.com" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="••••••••" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <button type="submit" className="primary-btn auth-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Secure Login'}
              </button>
            </form>
          </div>
        ) : (
          <div id="signup-form">
            <h2>Join the Community</h2>
            <p>Connect directly with local farmers.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Your Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="example@email.com" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="form-group">
                 <label>Join As</label>
                 <select style={{ width: '100%', height: '50px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '12px', padding: '0 15px', outline: 'none' }} value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                    <option value="customer" style={{ color: '#000' }}>Customer / Shopper</option>
                    <option value="farmer" style={{ color: '#000' }}>Farmer / Grower</option>
                    <option value="transport" style={{ color: '#000' }}>Transport Service</option>
                    <option value="admin" style={{ color: '#000' }}>Site Administrator</option>
                 </select>
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Real-Time Location (Required)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button 
                    type="button" 
                    onClick={fetchLocation} 
                    disabled={gettingLocation}
                    style={{ 
                      flex: 1, padding: '12px', background: formData.locationLat ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,255,255,0.08)', 
                      border: formData.locationLat ? '1px solid #4CAF50' : '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 600
                    }}
                  >
                    {gettingLocation ? '⏳ Locating...' : (formData.locationLat ? '📍 Location Fetched ✓' : '📍 Detect My Location')}
                  </button>
                </div>
                {formData.addressText && (
                  <p style={{ fontSize: '11px', color: '#A5D6A7', marginTop: '8px', lineHeight: 1.4, opacity: 0.9 }}>
                    {formData.addressText}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label>Create Password</label>
                <input type="password" placeholder="Min. 8 characters" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <button type="submit" className="primary-btn auth-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Free Account'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
