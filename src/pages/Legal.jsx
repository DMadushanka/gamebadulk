import React from 'react';
import { Link } from 'react-router-dom';
import breadcrumbImg from '../img/breadcrumb.jpg';

const Legal = ({ type = 'privacy' }) => {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? "Privacy Policy" : "Terms & Conditions";

  return (
    <div style={{ background: '#fdfdfd', minHeight: '100vh' }}>
      <div style={{ 
        backgroundImage: `url(${breadcrumbImg})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        padding: '60px 0', 
        position: 'relative' 
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontFamily: 'Outfit', fontWeight: 800, fontSize: '36px' }}>{title}</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>
            <Link to="/" style={{ color: 'var(--primary)' }}>Home</Link> &nbsp;/&nbsp; {title}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '80px 15px', maxWidth: '800px', lineHeight: 1.8, color: '#444' }}>
        {isPrivacy ? (
          <div className="animate">
            <h3 style={{ fontWeight: 800, marginBottom: '20px' }}>Your Privacy Matters</h3>
            <p>At GAMEBADU.LK, we are committed to protecting your privacy and ensuring a secure experience. This Privacy Policy outlines how we collect, use, and safeguard your personal information.</p>
            
            <h5 style={{ fontWeight: 700, marginTop: '30px' }}>1. Data Collection</h5>
            <p>We collect information you provide during registration, such as your name, email, and location. For farmers, we also collect contact numbers and product details to facilitate direct trade.</p>

            <h5 style={{ fontWeight: 700, marginTop: '30px' }}>2. How We Use Data</h5>
            <p>Your data is used to personalize your marketplace experience, manage your shopping cart, and connect you with village farmers. We do NOT sell your data to third parties.</p>

            <h5 style={{ fontWeight: 700, marginTop: '30px' }}>3. Security</h5>
            <p>We use industry-standard encryption and Cloud Firestore security rules to ensure that only you can access your private data, such as your shopping cart and profile details.</p>
          </div>
        ) : (
          <div className="animate">
            <h3 style={{ fontWeight: 800, marginBottom: '20px' }}>Platform Guidelines</h3>
            <p>Welcome to Gamebadu. By using our platform, you agree to the following terms and conditions designed to support fair trade for village farmers.</p>

            <h5 style={{ fontWeight: 700, marginTop: '30px' }}>1. Marketplace Use</h5>
            <p>Gamebadu is a platform connecting farmers and consumers directly. We facilitate the discovery and order management process, but the final physical transaction and harvest quality are the responsibility of the connecting parties.</p>

            <h5 style={{ fontWeight: 700, marginTop: '30px' }}>2. WhatsApp Trade</h5>
            <p>Orders initiated via WhatsApp represent a direct communication between you and the farmer/logistics partner. Please ensure clear communication regarding delivery times and payment methods.</p>

            <h5 style={{ fontWeight: 700, marginTop: '30px' }}>3. Ethical Sourcing</h5>
            <p>Users agree to respect the village sourcing model. Farmers must ensure all products listed are pesticide-free as per our community guidelines.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Legal;
