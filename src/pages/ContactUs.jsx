import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import breadcrumbImg from '../img/breadcrumb.jpg';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build a mailto link as a fallback (no backend needed)
    const mailtoLink = `mailto:hello@gamebadu.lk?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailtoLink;
    setSent(true);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div
        style={{
          backgroundImage: `url(${breadcrumbImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '80px 0',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontFamily: 'Outfit', fontWeight: 800, fontSize: '42px', marginBottom: '10px' }}>
            Contact Us
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
            <Link to="/" style={{ color: 'var(--primary)' }}>Home</Link>&nbsp;/&nbsp;Contact Us
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <section style={{ padding: '70px 0 40px', background: '#fdfdfd' }}>
        <div className="container">
          <div className="section-title" style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2>Get In Touch</h2>
            <p style={{ color: '#666', maxWidth: '550px', margin: '0 auto', fontSize: '16px' }}>
              Have a question about buying or selling village produce? We're here to help.
            </p>
          </div>

          <div className="row mb-5">
            {[
              { icon: 'fa-map-marker', title: 'Our Location', value: 'Matale District, Central Province, Sri Lanka', color: '#2E7D32' },
              { icon: 'fa-envelope', title: 'Email Us', value: 'hello@gamebadu.lk', color: '#1565C0' },
              { icon: 'fa-whatsapp', title: 'WhatsApp', value: '+94 77 000 0000', color: '#25D366' },
              { icon: 'fa-clock-o', title: 'Working Hours', value: 'Mon – Sat: 6:00 AM – 8:00 PM', color: '#E65100' },
            ].map((info, i) => (
              <div className="col-lg-3 col-md-6 mb-4" key={i}>
                <div
                  className="glass-card"
                  style={{
                    borderRadius: '20px',
                    padding: '35px 25px',
                    textAlign: 'center',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.07)',
                    transition: 'transform 0.3s',
                    height: '100%',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '50%',
                    background: info.color, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 18px',
                    boxShadow: `0 8px 20px ${info.color}44`,
                  }}>
                    <i className={`fa ${info.icon}`} style={{ fontSize: '24px', color: '#fff' }} />
                  </div>
                  <h6 style={{ fontWeight: 700, marginBottom: '8px', color: '#222' }}>{info.title}</h6>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: 0, lineHeight: 1.6 }}>{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section style={{ padding: '20px 0 80px', background: '#fdfdfd' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div
                className="glass-card"
                style={{ borderRadius: '24px', padding: '50px 45px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
              >
                {sent ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{
                      width: '80px', height: '80px', borderRadius: '50%',
                      background: 'var(--primary)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', margin: '0 auto 20px',
                      boxShadow: '0 8px 25px rgba(46,125,50,0.4)',
                    }}>
                      <i className="fa fa-check" style={{ fontSize: '36px', color: '#fff' }} />
                    </div>
                    <h4 style={{ fontWeight: 700, marginBottom: '10px' }}>Message Sent!</h4>
                    <p style={{ color: '#666' }}>Your email client should have opened. We'll get back to you soon.</p>
                    <button
                      onClick={() => setSent(false)}
                      className="primary-btn"
                      style={{ marginTop: '20px' }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h4 style={{ fontWeight: 800, marginBottom: '8px', fontFamily: 'Outfit' }}>
                      Send Us a Message
                    </h4>
                    <p style={{ color: '#888', marginBottom: '35px', fontSize: '14px' }}>
                      Fill in the form below and we'll respond within 24 hours.
                    </p>
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', display: 'block', color: '#333' }}>
                              Your Name
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Sunil Perera"
                              value={form.name}
                              onChange={e => setForm({ ...form, name: e.target.value })}
                              style={{
                                width: '100%', padding: '13px 18px',
                                border: '2px solid #eee', borderRadius: '12px',
                                fontSize: '15px', outline: 'none', transition: 'border 0.3s',
                              }}
                              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                              onBlur={e => e.target.style.borderColor = '#eee'}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', display: 'block', color: '#333' }}>
                              Email Address
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="your@email.com"
                              value={form.email}
                              onChange={e => setForm({ ...form, email: e.target.value })}
                              style={{
                                width: '100%', padding: '13px 18px',
                                border: '2px solid #eee', borderRadius: '12px',
                                fontSize: '15px', outline: 'none', transition: 'border 0.3s',
                              }}
                              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                              onBlur={e => e.target.style.borderColor = '#eee'}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', display: 'block', color: '#333' }}>
                          Subject
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="How can we help?"
                          value={form.subject}
                          onChange={e => setForm({ ...form, subject: e.target.value })}
                          style={{
                            width: '100%', padding: '13px 18px',
                            border: '2px solid #eee', borderRadius: '12px',
                            fontSize: '15px', outline: 'none', transition: 'border 0.3s',
                          }}
                          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                          onBlur={e => e.target.style.borderColor = '#eee'}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: '30px' }}>
                        <label style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', display: 'block', color: '#333' }}>
                          Message
                        </label>
                        <textarea
                          required
                          rows={5}
                          placeholder="Tell us more about your inquiry..."
                          value={form.message}
                          onChange={e => setForm({ ...form, message: e.target.value })}
                          style={{
                            width: '100%', padding: '13px 18px',
                            border: '2px solid #eee', borderRadius: '12px',
                            fontSize: '15px', outline: 'none', transition: 'border 0.3s',
                            resize: 'vertical', fontFamily: 'inherit',
                          }}
                          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                          onBlur={e => e.target.style.borderColor = '#eee'}
                        />
                      </div>
                      <button type="submit" className="primary-btn" style={{ padding: '14px 40px', fontSize: '16px' }}>
                        <i className="fa fa-paper-plane" style={{ marginRight: '8px' }} />
                        Send Message
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
