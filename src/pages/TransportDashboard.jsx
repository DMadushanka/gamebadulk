import React from 'react';
import { Link } from 'react-router-dom';

const TransportDashboard = () => {
  return (
    <div className="transport-wrapper" style={{ padding: '50px 0', background: '#fdfdfd', minHeight: '100vh' }}>
      <div className="container">
        <Link to="/" style={{ color: '#555', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontWeight: 600, fontSize: '14px' }}>
          <i className="fa fa-arrow-left"></i> Back to Home
        </Link>
        <div className="row">
          <div className="col-lg-12 text-center mb-5">
            <h2 className="brand-logo">GAMEBADU<span>.LK</span> TRANSPORT</h2>
            <p className="text-dark">Connect Village Farmers with Urban Communities</p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4">
            <div className="service-card text-center" style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: 'var(--shadow-md)' }}>
              <i className="fa fa-truck mb-3" style={{ fontSize: '40px', color: 'var(--primary)' }}></i>
              <h4>Active Deliveries</h4>
              <p className="text-muted">You have 0 pending delivery requests from local farmers.</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="service-card text-center" style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: 'var(--shadow-md)' }}>
              <i className="fa fa-map-marked-alt mb-3" style={{ fontSize: '40px', color: 'var(--primary)' }}></i>
              <h4>My Routes</h4>
              <p className="text-muted">Manage your transport zones and district coverage.</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="service-card text-center" style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: 'var(--shadow-md)' }}>
              <i className="fa fa-history mb-3" style={{ fontSize: '40px', color: 'var(--primary)' }}></i>
              <h4>Delivery History</h4>
              <p className="text-muted">View your completed successful village-to-door deliveries.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportDashboard;
