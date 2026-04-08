import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../img/logo.png';

const Footer = () => {
  return (
    <footer className="footer animate" style={{ background: '#121212', color: '#fff', padding: '40px 0 20px' }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="footer__about">
              <div className="footer__about__logo">
                <Link to="/"><img src={logoImg} alt="" /></Link>
              </div>
              <ul>
                <li>Address: Community Trade Center, Sri Lanka</li>
                <li>Phone: +94 77 000 0000</li>
                <li>Email: hello@gamebadu.lk</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6 offset-lg-1">
            <div className="footer__widget">
              <h6>Useful Links</h6>
              <ul>
                <li><Link to="#">About Us</Link></li>
                <li><Link to="#">Contact</Link></li>
                <li><Link to="#">Privacy Policy</Link></li>
                <li><Link to="#">Our Sitemap</Link></li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-12">
            <div className="footer__widget">
              <h6>Join Our Newsletter Now</h6>
              <p>Get E-mail updates about our latest arrivals.</p>
              <form action="#">
                <input type="text" placeholder="Enter your mail" />
                <button type="submit" className="site-btn">Subscribe</button>
              </form>
              <div className="footer__widget__social">
                <a href="#"><i className="fa fa-facebook"></i></a>
                <a href="#"><i className="fa fa-instagram"></i></a>
                <a href="#"><i className="fa fa-twitter"></i></a>
                <a href="#"><i className="fa fa-pinterest"></i></a>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="footer__copyright">
              <div className="footer__copyright__text">
                <p>Copyright &copy;{new Date().getFullYear()} GAMEBADU.LK. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
