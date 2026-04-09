import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:hello@gamebadu.lk?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailtoLink;
    setSent(true);
  };

  const faqs = [
    { q: 'How do I list my farm produce?', a: 'Register as a Farmer, then go to your Farmer Dashboard and click "Add New Product". It will be reviewed within 24 hours.' },
    { q: 'How do I track my order?', a: 'After placing an order via WhatsApp or Cart checkout, the farmer will confirm delivery details directly. You can also check your Cart history.' },
    { q: 'Is there a delivery service?', a: 'Yes! We partner with local transport providers. Ask the farmer or use the Transport section to arrange pickup/delivery.' },
    { q: 'Can I sell from outside Central Province?', a: 'Absolutely. Gamebadu.lk welcomes farmers from all districts across Sri Lanka.' },
  ];

  const inputStyle = (field) => ({
    width: '100%',
    padding: '16px 20px 16px 50px',
    border: `2px solid ${focused === field ? '#2E7D32' : '#e8edf1'}`,
    borderRadius: '14px',
    fontSize: '15px',
    outline: 'none',
    background: focused === field ? '#f0f7f0' : '#f9fafb',
    transition: 'all 0.3s ease',
    color: '#222',
    fontFamily: 'Outfit, sans-serif',
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap');

        .contact-hero {
          background: linear-gradient(135deg, #0a2e0a 0%, #1B5E20 50%, #2E7D32 100%);
          padding: 100px 0 80px;
          position: relative;
          overflow: hidden;
        }
        .contact-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: floatOrb 6s ease-in-out infinite;
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .contact-info-card {
          background: #fff;
          border-radius: 20px;
          padding: 28px 24px;
          text-align: center;
          box-shadow: 0 8px 40px rgba(0,0,0,0.08);
          transition: all 0.4s ease;
          border: 1px solid transparent;
          cursor: default;
          height: 100%;
        }
        .contact-info-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(46,125,50,0.15);
          border-color: rgba(46,125,50,0.2);
        }
        .icon-ring {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
          position: relative;
        }
        .icon-ring::after {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px dashed currentColor;
          opacity: 0.3;
          animation: rotateDash 10s linear infinite;
        }
        @keyframes rotateDash {
          to { transform: rotate(360deg); }
        }
        .form-section {
          background: #fff;
          border-radius: 28px;
          padding: 50px 50px;
          box-shadow: 0 25px 80px rgba(0,0,0,0.1);
          position: relative;
          overflow: hidden;
        }
        .form-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 5px;
          background: linear-gradient(90deg, #2E7D32, #66BB6A, #2E7D32);
          background-size: 200% 100%;
          animation: shimmer 2s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .input-wrapper {
          position: relative;
          margin-bottom: 22px;
        }
        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #aaa;
          font-size: 16px;
          transition: color 0.3s;
          pointer-events: none;
          z-index: 1;
        }
        .input-icon.active { color: #2E7D32; }
        .textarea-icon {
          top: 22px;
          transform: none;
        }
        .submit-btn {
          background: linear-gradient(135deg, #2E7D32, #43A047);
          color: #fff;
          border: none;
          padding: 16px 40px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(46,125,50,0.4);
          width: 100%;
          justify-content: center;
          letter-spacing: 0.5px;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 35px rgba(46,125,50,0.5);
        }
        .submit-btn:active { transform: translateY(0); }
        .faq-item {
          border: 1px solid #eef2ef;
          border-radius: 16px;
          margin-bottom: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .faq-item.open {
          border-color: #2E7D32;
          box-shadow: 0 4px 20px rgba(46,125,50,0.1);
        }
        .faq-q {
          padding: 18px 22px;
          font-weight: 700;
          font-size: 15px;
          color: #222;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          background: #fafafa;
          transition: background 0.3s;
        }
        .faq-q:hover { background: #f0f7f0; }
        .faq-item.open .faq-q { background: #f0f7f0; color: #2E7D32; }
        .faq-a {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, padding 0.3s ease;
          padding: 0 22px;
          font-size: 14px;
          color: #555;
          line-height: 1.8;
        }
        .faq-item.open .faq-a {
          max-height: 200px;
          padding: 16px 22px 18px;
        }
        .faq-chevron {
          transition: transform 0.3s;
          font-size: 12px;
          color: #aaa;
        }
        .faq-item.open .faq-chevron {
          transform: rotate(180deg);
          color: #2E7D32;
        }
        .success-check {
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .side-info-panel {
          background: linear-gradient(160deg, #1B5E20, #2E7D32);
          border-radius: 28px;
          padding: 40px 35px;
          color: #fff;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        .side-info-panel::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
        }
        .side-info-panel::after {
          content: '';
          position: absolute;
          bottom: -60px; left: -30px;
          width: 220px; height: 220px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }
        .side-contact-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 28px;
          position: relative;
          z-index: 2;
        }
        .side-icon-box {
          width: 46px; height: 46px;
          border-radius: 12px;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-size: 18px;
        }
        .social-btn {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          display: inline-flex; align-items: center; justify-content: center;
          color: #fff;
          font-size: 18px;
          transition: all 0.3s;
          text-decoration: none;
          margin-right: 10px;
        }
        .social-btn:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-3px);
          color: #fff;
        }
        @media (max-width: 768px) {
          .form-section { padding: 32px 22px; }
          .side-info-panel { margin-bottom: 30px; }
        }
      `}</style>

      {/* ── Hero Banner ── */}
      <div className="contact-hero">
        <div className="hero-orb" style={{ width: 400, height: 400, background: '#66BB6A', top: -100, right: -100 }} />
        <div className="hero-orb" style={{ width: 300, height: 300, background: '#A5D6A7', bottom: -80, left: -80, animationDelay: '2s' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span style={{
            display: 'inline-block', background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)', color: '#A5D6A7',
            padding: '6px 20px', borderRadius: '50px',
            fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px',
            textTransform: 'uppercase', marginBottom: '18px',
            border: '1px solid rgba(165,214,167,0.3)'
          }}>
            📬 &nbsp;We're Here to Help
          </span>
          <h1 style={{
            color: '#fff', fontFamily: 'Outfit', fontWeight: 900,
            fontSize: 'clamp(36px, 6vw, 62px)', marginBottom: '16px',
            lineHeight: 1.1, letterSpacing: '-1px'
          }}>
            Contact <span style={{ color: '#A5D6A7' }}>Gamebadu</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '17px', maxWidth: '500px', margin: '0 auto 20px' }}>
            Questions about village produce, orders, or partnerships? Let's talk.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
            <Link to="/" style={{ color: '#A5D6A7', textDecoration: 'none' }}>Home</Link>
            &nbsp;&nbsp;›&nbsp;&nbsp;Contact Us
          </p>
        </div>
      </div>

      {/* ── Info Cards Row ── */}
      <section style={{ padding: '60px 0 20px', background: '#f5f8f5' }}>
        <div className="container">
          <div className="row g-4">
            {[
              { icon: 'fa-map-marker', title: 'Location', value: 'Matale District, Central Province, Sri Lanka', color: '#2E7D32', bg: '#e8f5e9' },
              { icon: 'fa-envelope-o', title: 'Email Us', value: 'hello@gamebadu.lk', color: '#1565C0', bg: '#e3f2fd' },
              { icon: 'fa-whatsapp', title: 'WhatsApp', value: '+94 77 000 0000', color: '#25D366', bg: '#e8f8ed' },
              { icon: 'fa-clock-o', title: 'Working Hours', value: 'Mon – Sat: 6:00 AM – 8:00 PM', color: '#E65100', bg: '#fff3e0' },
            ].map((info, i) => (
              <div className="col-lg-3 col-md-6" key={i}>
                <div className="contact-info-card">
                  <div className="icon-ring" style={{ background: info.bg, color: info.color }}>
                    <i className={`fa ${info.icon}`} style={{ fontSize: '26px', color: info.color }} />
                  </div>
                  <h6 style={{ fontWeight: 800, fontSize: '15px', color: '#111', marginBottom: '8px', fontFamily: 'Outfit' }}>
                    {info.title}
                  </h6>
                  <p style={{ color: '#666', fontSize: '13.5px', lineHeight: 1.6, marginBottom: 0 }}>{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content: Form + Side Info ── */}
      <section style={{ padding: '50px 0 80px', background: '#f5f8f5' }}>
        <div className="container">
          <div className="row g-4 align-items-start">

            {/* Side Info Panel */}
            <div className="col-lg-4">
              <div className="side-info-panel">
                <h4 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '22px', marginBottom: '8px', position: 'relative', zIndex: 2 }}>
                  Let's Connect 🌿
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '35px', position: 'relative', zIndex: 2, lineHeight: 1.7 }}>
                  Whether you're a farmer, buyer, or partner — we love hearing from you.
                </p>

                {[
                  { icon: 'fa-map-marker', label: 'Visit Us', val: 'Matale, Central Province, Sri Lanka' },
                  { icon: 'fa-envelope', label: 'Write to Us', val: 'hello@gamebadu.lk' },
                  { icon: 'fa-phone', label: 'Call / WhatsApp', val: '+94 77 000 0000' },
                  { icon: 'fa-clock-o', label: 'Open Hours', val: 'Mon – Sat, 6 AM – 8 PM' },
                ].map((item, i) => (
                  <div className="side-contact-row" key={i}>
                    <div className="side-icon-box">
                      <i className={`fa ${item.icon}`} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '3px' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>{item.val}</div>
                    </div>
                  </div>
                ))}

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '25px', position: 'relative', zIndex: 2 }}>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
                    Follow Us
                  </p>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn"><i className="fa fa-facebook" /></a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn"><i className="fa fa-instagram" /></a>
                  <a href="https://wa.me/94770000000" target="_blank" rel="noreferrer" className="social-btn"><i className="fa fa-whatsapp" /></a>
                  <a href="mailto:hello@gamebadu.lk" className="social-btn"><i className="fa fa-envelope" /></a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-8">
              <div className="form-section">
                {sent ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div className="success-check" style={{
                      width: '90px', height: '90px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2E7D32, #66BB6A)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 28px',
                      boxShadow: '0 12px 40px rgba(46,125,50,0.4)',
                    }}>
                      <i className="fa fa-check" style={{ fontSize: '40px', color: '#fff' }} />
                    </div>
                    <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, color: '#111', marginBottom: '10px' }}>
                      Message Sent! 🎉
                    </h3>
                    <p style={{ color: '#777', maxWidth: '360px', margin: '0 auto 30px', lineHeight: 1.7 }}>
                      Thank you for reaching out. Your email client should have opened. We'll reply within 24 hours.
                    </p>
                    <button onClick={() => setSent(false)} className="submit-btn" style={{ width: 'auto', padding: '14px 36px' }}>
                      <i className="fa fa-refresh" /> Send Another
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: '35px' }}>
                      <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '26px', color: '#111', marginBottom: '8px' }}>
                        Send Us a Message ✉️
                      </h3>
                      <p style={{ color: '#888', fontSize: '14.5px', marginBottom: 0 }}>
                        Fill in the details below and we'll get back to you within 24 hours.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6">
                          <label style={{ fontWeight: 700, fontSize: '13px', color: '#444', display: 'block', marginBottom: '8px', letterSpacing: '0.3px' }}>
                            Full Name <span style={{ color: '#e53935' }}>*</span>
                          </label>
                          <div className="input-wrapper">
                            <i className={`fa fa-user input-icon ${focused === 'name' ? 'active' : ''}`} />
                            <input
                              type="text" required
                              placeholder="Sunil Perera"
                              value={form.name}
                              onChange={e => setForm({ ...form, name: e.target.value })}
                              onFocus={() => setFocused('name')}
                              onBlur={() => setFocused('')}
                              style={inputStyle('name')}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontWeight: 700, fontSize: '13px', color: '#444', display: 'block', marginBottom: '8px', letterSpacing: '0.3px' }}>
                            Email Address <span style={{ color: '#e53935' }}>*</span>
                          </label>
                          <div className="input-wrapper">
                            <i className={`fa fa-envelope input-icon ${focused === 'email' ? 'active' : ''}`} />
                            <input
                              type="email" required
                              placeholder="your@email.com"
                              value={form.email}
                              onChange={e => setForm({ ...form, email: e.target.value })}
                              onFocus={() => setFocused('email')}
                              onBlur={() => setFocused('')}
                              style={inputStyle('email')}
                            />
                          </div>
                        </div>
                      </div>

                      <label style={{ fontWeight: 700, fontSize: '13px', color: '#444', display: 'block', marginBottom: '8px', letterSpacing: '0.3px' }}>
                        Subject <span style={{ color: '#e53935' }}>*</span>
                      </label>
                      <div className="input-wrapper">
                        <i className={`fa fa-tag input-icon ${focused === 'subject' ? 'active' : ''}`} />
                        <input
                          type="text" required
                          placeholder="How can we help you?"
                          value={form.subject}
                          onChange={e => setForm({ ...form, subject: e.target.value })}
                          onFocus={() => setFocused('subject')}
                          onBlur={() => setFocused('')}
                          style={inputStyle('subject')}
                        />
                      </div>

                      <label style={{ fontWeight: 700, fontSize: '13px', color: '#444', display: 'block', marginBottom: '8px', letterSpacing: '0.3px' }}>
                        Your Message <span style={{ color: '#e53935' }}>*</span>
                      </label>
                      <div className="input-wrapper">
                        <i className={`fa fa-comment input-icon textarea-icon ${focused === 'message' ? 'active' : ''}`} />
                        <textarea
                          required rows={5}
                          placeholder="Tell us more about your inquiry..."
                          value={form.message}
                          onChange={e => setForm({ ...form, message: e.target.value })}
                          onFocus={() => setFocused('message')}
                          onBlur={() => setFocused('')}
                          style={{
                            ...inputStyle('message'),
                            paddingTop: '16px',
                            resize: 'vertical',
                            fontFamily: 'Outfit, sans-serif',
                            minHeight: '140px',
                          }}
                        />
                      </div>

                      <button type="submit" className="submit-btn" style={{ marginTop: '10px' }}>
                        <i className="fa fa-paper-plane" />
                        Send Your Message
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section style={{ padding: '60px 0 40px', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '45px' }}>
            <span style={{
              display: 'inline-block', background: '#e8f5e9', color: '#2E7D32',
              padding: '5px 16px', borderRadius: '50px',
              fontSize: '12px', fontWeight: 700, letterSpacing: '1px',
              textTransform: 'uppercase', marginBottom: '14px'
            }}>
              💬 FAQ
            </span>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '32px', color: '#111', marginBottom: '10px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: '#888', maxWidth: '500px', margin: '0 auto', fontSize: '15px' }}>
              Can't find what you're looking for? Ask us directly above.
            </p>
          </div>

          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item ${openFaq === i ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="faq-q">
                  <span><i className="fa fa-leaf" style={{ color: '#2E7D32', marginRight: '10px', fontSize: '13px' }} />{faq.q}</span>
                  <i className={`fa fa-chevron-down faq-chevron`} />
                </div>
                <div className="faq-a">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Map ── */}
      <section style={{ padding: '0 0 80px', background: '#fff' }}>
        <div className="container">
          <div style={{
            borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            border: '1px solid #e8f5e9'
          }}>
            <iframe
              title="Gamebadu Location - Matale, Sri Lanka"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63246.67126948085!2d80.5866!3d7.4700!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae333b89f0a9d7f%3A0xf8e5f5a5c5d5e5e5!2sMatale%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="380"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
