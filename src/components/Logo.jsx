import React from 'react';
import './Logo.css';
import logoImg from '../img/logo.png';

const Logo = ({ className = "" }) => {
  return (
    <div className={`logo-container-modern ${className}`}>
      <img src={logoImg} alt="Gamebadu" className="logo-image-premium" />
    </div>
  );
};

export default Logo;
