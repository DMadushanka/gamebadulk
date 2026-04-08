import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../img/logo.png';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navbar = ({ user, userData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!userData) return '/';
    return `/${userData.role}`;
  };

  return (
    <>
      <div 
        className={`humberger__menu__overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>
      <div className={`humberger__menu__wrapper ${isMenuOpen ? 'show__humberger__menu__wrapper' : ''}`}>
        <div className="humberger__menu__logo">
          <Link to="/"><img src={logoImg} alt="Logo" /></Link>
        </div>
        <div className="humberger__menu__cart">
          <ul>
            <li><a href="#"><i className="fa fa-heart"></i> <span>1</span></a></li>
            <li><a href="#"><i className="fa fa-shopping-bag"></i> <span>3</span></a></li>
          </ul>
          <div className="header__cart__price">item: <span>$150.00</span></div>
        </div>
        <div className="humberger__menu__widget">
          {user && userData ? (
            <div className="header__top__right__language">
              <i className="fa fa-user-circle" style={{ fontSize: '20px', color: 'var(--primary)', marginRight: '5px' }}></i>
              <div style={{ fontWeight: 700 }}>{(userData.name || 'User').split(' ')[0]}</div>
              <span className="arrow_carrot-down"></span>
              <ul style={{ width: '150px', background: '#fff', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                {userData.role !== 'customer' && (
                  <li><Link to={getDashboardLink()} style={{ color: '#333 !important', padding: '5px 15px !important' }}>Dashboard</Link></li>
                )}
                <li><button onClick={handleLogout} style={{ color: '#dc3545 !important', padding: '5px 15px !important', background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <div className="header__top__right__auth">
              <Link to="/auth"><i className="fa fa-user"></i> Login</Link>
            </div>
          )}
        </div>
        <nav className="humberger__menu__nav mobile-menu">
          <ul onClick={() => setIsMenuOpen(false)}>
            <li className={isActive('/')}><Link to="/">Home</Link></li>
            <li className={isActive('/marketplace')}><Link to="/marketplace">Marketplace</Link></li>
            <li className={isActive('/spice-stories')}><Link to="/spice-stories">Spice Stories</Link></li>
            <li className={isActive('/contact')}><Link to="/contact">Contact Us</Link></li>
            {userData?.role === 'farmer' && (
              <li className={isActive('/farmer')}><Link to="/farmer" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sell My Product</Link></li>
            )}
          </ul>
        </nav>
        <div id="mobile-menu-wrap"></div>
        <div className="header__top__right__social">
          <a href="#"><i className="fa fa-facebook"></i></a>
          <a href="#"><i className="fa fa-twitter"></i></a>
          <a href="#"><i className="fa fa-linkedin"></i></a>
          <a href="#"><i className="fa fa-pinterest-p"></i></a>
        </div>
        <div className="humberger__menu__contact">
          <ul>
            <li><i className="fa fa-envelope"></i> hello@gamebadu.lk</li>
            <li>Direct from Villagers to Your Door</li>
          </ul>
        </div>
      </div>

      <header className="header">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="header__logo">
                <Link to="/"><img src={logoImg} alt="" /></Link>
              </div>
            </div>
            <div className="col-lg-6">
              <nav className="header__menu">
                <ul>
                  <li className={isActive('/')}><Link to="/">Home</Link></li>
                  <li className={isActive('/marketplace')}><Link to="/marketplace">Marketplace</Link></li>
                  <li className={isActive('/spice-stories')}><Link to="/spice-stories">Spice Stories</Link></li>
                  <li className={isActive('/contact')}><Link to="/contact">Contact Us</Link></li>
                  {userData?.role === 'farmer' && (
                    <li className={isActive('/farmer')}><Link to="/farmer" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sell My Product</Link></li>
                  )}
                </ul>
              </nav>
            </div>
            <div className="col-lg-3">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: '10px' }}>
                {user && userData ? (
                  <>
                    {userData.role !== 'customer' && (
                      <Link
                        to={getDashboardLink()}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '7px',
                          padding: '10px 18px', borderRadius: '50px', fontWeight: 700,
                          fontSize: '13px', textDecoration: 'none', transition: 'all 0.3s',
                          background: userData.role === 'admin'
                            ? 'linear-gradient(135deg, #0d47a1, #1565C0)'
                            : userData.role === 'transport'
                            ? 'linear-gradient(135deg, #E65100, #F57C00)'
                            : 'linear-gradient(135deg, #1B5E20, #2E7D32)',
                          color: '#fff',
                          boxShadow: userData.role === 'admin'
                            ? '0 4px 15px rgba(13,71,161,0.4)'
                            : '0 4px 15px rgba(46,125,50,0.4)',
                        }}
                      >
                        <i className={`fa ${
                          userData.role === 'admin' ? 'fa-shield' :
                          userData.role === 'transport' ? 'fa-truck' : 'fa-leaf'
                        }`} />
                        {userData.role === 'admin' ? 'Admin Panel' :
                         userData.role === 'transport' ? 'Transport' : 'Sell Product'}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      style={{
                        padding: '10px 14px', borderRadius: '50px', border: '1.5px solid #ddd',
                        background: '#fff', color: '#555', fontWeight: 600, fontSize: '13px',
                        cursor: 'pointer', transition: 'all 0.3s',
                      }}
                      title="Logout"
                    >
                      <i className="fa fa-sign-out" />
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '7px',
                      padding: '10px 20px', borderRadius: '50px', fontWeight: 700,
                      fontSize: '13px', textDecoration: 'none',
                      background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
                      color: '#fff', boxShadow: '0 4px 15px rgba(46,125,50,0.35)',
                    }}
                  >
                    <i className="fa fa-user" /> Login
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="humberger__open" onClick={() => setIsMenuOpen(true)}>
            <i className="fa fa-bars"></i>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
