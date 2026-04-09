import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import blog1 from '../img/blog/blog-1.jpg';
import blog2 from '../img/blog/blog-2.jpg';
import blog3 from '../img/blog/blog-3.jpg';
import blog4 from '../img/blog/blog-4.jpg';
import blog5 from '../img/blog/blog-5.jpg';
import blog6 from '../img/blog/blog-6.jpg';

const STORIES = [
  {
    id: 1,
    title: 'The Black Pepper Legacy of Matale',
    excerpt: 'For generations, the hill-country villages of Matale have nurtured premium-grade black pepper vines. Discover how these farming families are keeping an ancient tradition alive in modern markets.',
    category: 'Heritage Spices',
    date: 'April 2026',
    readTime: '5 min read',
    image: blog1,
    accent: '#2E7D32',
    tag: '🌿',
    featured: true,
  },
  {
    id: 2,
    title: "Turmeric: Sri Lanka's Golden Root",
    excerpt: 'From village gardens to global kitchens — the farmers of Kurunegala share their secrets for cultivating the most potent organic turmeric on the island.',
    category: 'Healing Spices',
    date: 'March 2026',
    readTime: '4 min read',
    image: blog2,
    accent: '#F9A825',
    tag: '✨',
    featured: false,
  },
  {
    id: 3,
    title: 'How Gammirisgama Grows Your Cinnamon',
    excerpt: 'Ceylon cinnamon is the world\'s finest — and it starts in the hands of skilled village peelers. A close look at the art behind Sri Lanka\'s most prized export spice.',
    category: 'Artisan Craft',
    date: 'February 2026',
    readTime: '6 min read',
    image: blog3,
    accent: '#6D4C41',
    tag: '🎨',
    featured: false,
  },
  {
    id: 4,
    title: 'A Day in the Life of a Village Farmer',
    excerpt: 'Wake up with Sunil from Kandy District as he tends to his organic vegetable patch, preparing produce that will reach your table the very same day.',
    category: 'Farmer Stories',
    date: 'January 2026',
    readTime: '7 min read',
    image: blog4,
    accent: '#1565C0',
    tag: '👨‍🌾',
    featured: false,
  },
  {
    id: 5,
    title: 'The Rise of Organic Farming in Sri Lanka',
    excerpt: 'A quiet revolution is underway. Village by village, farmers are abandoning chemical fertilisers and returning to traditional, sustainable growing methods.',
    category: 'Sustainability',
    date: 'January 2026',
    readTime: '5 min read',
    image: blog5,
    accent: '#00695C',
    tag: '♻️',
    featured: false,
  },
  {
    id: 6,
    title: 'From Paddy Field to Your Plate',
    excerpt: "Sri Lanka's red rice tradition runs deeper than food — it is culture, medicine, and history. Meet the farmers preserving heirloom rice varieties for future generations.",
    category: 'Heritage Crops',
    date: 'December 2025',
    readTime: '8 min read',
    image: blog6,
    accent: '#C62828',
    tag: '🍚',
    featured: false,
  },
];

const CATEGORIES = ['All', 'Heritage Spices', 'Healing Spices', 'Artisan Craft', 'Farmer Stories', 'Sustainability', 'Heritage Crops'];

const SpiceStories = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredId, setHoveredId] = useState(null);

  const featured = STORIES[0];
  const rest = STORIES.slice(1);

  const filtered = activeCategory === 'All'
    ? rest
    : rest.filter(s => s.category === activeCategory);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

        /* ── Hero ── */
        .ss-hero {
          min-height: 480px;
          background: linear-gradient(120deg, #0a2e0a 0%, #1B5E20 55%, #33691E 100%);
          display: flex; align-items: center;
          position: relative; overflow: hidden;
          padding: 60px 0;
        }
        .ss-hero-blob {
          position: absolute; border-radius: 50%;
          filter: blur(70px); opacity: 0.18;
          animation: blobFloat 7s ease-in-out infinite;
        }
        @keyframes blobFloat {
          0%,100%{transform:translateY(0) scale(1);}
          50%{transform:translateY(-18px) scale(1.05);}
        }
        .ss-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(165,214,167,0.3);
          backdrop-filter: blur(10px);
          color: #A5D6A7; padding: 7px 20px; border-radius: 50px;
          font-size: 12px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; margin-bottom: 22px;
        }
        .ss-hero-title {
          font-family: 'Outfit', sans-serif; font-weight: 900;
          font-size: clamp(38px, 6vw, 68px); color: #fff;
          line-height: 1.08; letter-spacing: -2px;
          margin-bottom: 20px;
        }
        .ss-hero-title span { color: #A5D6A7; font-style: italic; font-family: 'Lora', serif; }

        /* ── Category Pills ── */
        .cat-pill {
          padding: 8px 20px; border-radius: 50px;
          border: 2px solid #e0e7e0;
          background: #fff; color: #555;
          font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.25s ease;
          white-space: nowrap; font-family: 'Outfit', sans-serif;
          flex-shrink: 0;
        }
        .cat-pill:hover { border-color: #2E7D32; color: #2E7D32; }
        .cat-pill.active {
          background: linear-gradient(135deg, #2E7D32, #43A047);
          border-color: transparent; color: #fff;
          box-shadow: 0 6px 20px rgba(46,125,50,0.35);
        }

        /* ── Featured Card ── */
        .featured-card {
          border-radius: 28px; overflow: hidden;
          position: relative; cursor: pointer;
          box-shadow: 0 30px 80px rgba(0,0,0,0.18);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .featured-card:hover { transform: translateY(-6px); box-shadow: 0 40px 100px rgba(0,0,0,0.25); }
        .featured-card-img {
          width: 100%; height: 520px;
          object-fit: cover; display: block;
          transition: transform 0.6s ease;
        }
        .featured-card:hover .featured-card-img { transform: scale(1.04); }
        .featured-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.05) 100%);
        }
        .featured-content {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 40px;
        }
        .story-badge {
          display: inline-block;
          padding: 5px 14px; border-radius: 50px;
          font-size: 11px; font-weight: 800;
          letter-spacing: 1.2px; text-transform: uppercase;
          margin-bottom: 14px;
        }

        /* ── Story Cards ── */
        .story-card {
          border-radius: 22px; overflow: hidden;
          background: #fff;
          box-shadow: 0 6px 30px rgba(0,0,0,0.07);
          transition: all 0.35s ease;
          display: flex; flex-direction: column;
          height: 100%;
          border: 1px solid #f0f0f0;
        }
        .story-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 55px rgba(0,0,0,0.13);
          border-color: transparent;
        }
        .story-card-img-wrap {
          position: relative; overflow: hidden;
          height: 210px;
        }
        .story-card-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .story-card:hover .story-card-img { transform: scale(1.07); }
        .story-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%);
          transition: opacity 0.3s;
          opacity: 0;
        }
        .story-card:hover .story-card-overlay { opacity: 1; }
        .story-card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }

        .read-more-btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 13px; font-weight: 700;
          text-decoration: none;
          transition: gap 0.25s ease;
          margin-top: auto;
          width: fit-content;
        }
        .read-more-btn:hover { gap: 12px; }

        /* ── Quote Section ── */
        .quote-section {
          background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
          padding: 80px 0;
          position: relative; overflow: hidden;
        }
        .quote-section::before {
          content: '"';
          position: absolute; top: -40px; left: 40px;
          font-size: 320px; color: rgba(255,255,255,0.04);
          font-family: 'Lora', serif; line-height: 1;
          pointer-events: none;
        }

        /* ── Newsletter ── */
        .newsletter-box {
          background: #fff;
          border-radius: 28px;
          padding: 55px 50px;
          box-shadow: 0 25px 80px rgba(0,0,0,0.1);
          text-align: center;
          position: relative; overflow: hidden;
        }
        .newsletter-box::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 5px;
          background: linear-gradient(90deg, #2E7D32, #66BB6A, #F9A825, #2E7D32);
          background-size: 200%;
          animation: gradient-shift 3s linear infinite;
        }
        @keyframes gradient-shift {
          0%{background-position:0% 0;} 100%{background-position:200% 0;}
        }
        .nl-input {
          flex: 1; padding: 15px 22px;
          border: 2px solid #e8edf1; border-radius: 50px;
          font-size: 15px; outline: none; font-family: 'Outfit', sans-serif;
          transition: border 0.3s;
        }
        .nl-input:focus { border-color: #2E7D32; }
        .nl-btn {
          background: linear-gradient(135deg, #2E7D32, #43A047);
          color: #fff; border: none; padding: 15px 32px;
          border-radius: 50px; font-size: 15px; font-weight: 700;
          cursor: pointer; font-family: 'Outfit', sans-serif;
          transition: all 0.3s; box-shadow: 0 8px 25px rgba(46,125,50,0.4);
          white-space: nowrap;
        }
        .nl-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(46,125,50,0.5); }

        @media (max-width: 768px) {
          .featured-card-img { height: 320px; }
          .featured-content { padding: 24px; }
          .newsletter-box { padding: 36px 24px; }
          .nl-form { flex-direction: column !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="ss-hero">
        <div className="ss-hero-blob" style={{ width: 420, height: 420, background: '#66BB6A', top: -120, right: -80 }} />
        <div className="ss-hero-blob" style={{ width: 280, height: 280, background: '#A5D6A7', bottom: -80, left: '10%', animationDelay: '3s' }} />
        <div className="ss-hero-blob" style={{ width: 200, height: 200, background: '#F9A825', top: '20%', right: '30%', animationDelay: '1.5s' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="ss-hero-badge">
                🌿 &nbsp; Tales from the Village
              </div>
              <h1 className="ss-hero-title">
                Sri Lanka's <span>Spice</span><br />Stories
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '17px', lineHeight: 1.8, maxWidth: '520px', marginBottom: '30px', fontFamily: 'Outfit' }}>
                Behind every spice in your kitchen is a story. Meet the growers, explore their lands,
                and understand the passion that makes Sri Lankan produce truly extraordinary.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link to="/marketplace" style={{
                  background: 'linear-gradient(135deg, #2E7D32, #43A047)',
                  color: '#fff', padding: '14px 30px', borderRadius: '50px',
                  fontWeight: 700, textDecoration: 'none', fontSize: '15px',
                  boxShadow: '0 8px 25px rgba(46,125,50,0.5)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <i className="fa fa-shopping-basket" /> Shop Now
                </Link>
                <a href="#stories" style={{
                  background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
                  color: '#fff', padding: '14px 30px', borderRadius: '50px',
                  fontWeight: 700, textDecoration: 'none', fontSize: '15px',
                  border: '1px solid rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <i className="fa fa-book" /> Read Stories
                </a>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '20px' }}>
                {[blog1, blog2, blog3, blog4].map((img, i) => (
                  <div key={i} style={{
                    borderRadius: '16px', overflow: 'hidden',
                    height: i % 2 === 0 ? '160px' : '130px',
                    marginTop: i % 2 !== 0 ? '20px' : '0',
                    boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                    border: '2px solid rgba(255,255,255,0.1)',
                  }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <div className="container">
          <div className="row" style={{ textAlign: 'center' }}>
            {[
              { val: '6+', label: 'Published Stories', icon: 'fa-book' },
              { val: '3K+', label: 'Monthly Readers', icon: 'fa-users' },
              { val: '12', label: 'Districts Covered', icon: 'fa-map-marker' },
              { val: '100%', label: 'Village Sourced', icon: 'fa-leaf' },
            ].map((s, i) => (
              <div className="col-6 col-md-3" key={i} style={{ padding: '28px 20px', borderRight: i < 3 ? '1px solid #f5f5f5' : 'none' }}>
                <i className={`fa ${s.icon}`} style={{ fontSize: '22px', color: '#2E7D32', marginBottom: '8px', display: 'block' }} />
                <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '26px', color: '#1B5E20', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: '12px', color: '#999', fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured Story ── */}
      <section style={{ padding: '70px 0 50px', background: '#f5f8f5' }} id="stories">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '35px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ display: 'inline-block', background: '#e8f5e9', color: '#2E7D32', padding: '5px 16px', borderRadius: '50px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                ⭐ Featured
              </span>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '28px', color: '#111', margin: 0 }}>Editor's Pick</h2>
            </div>
          </div>

          <div className="featured-card">
            <img src={featured.image} alt={featured.title} className="featured-card-img" />
            <div className="featured-overlay" />
            <div className="featured-content">
              <span className="story-badge" style={{ background: featured.accent, color: '#fff' }}>
                {featured.tag} {featured.category}
              </span>
              <h2 style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: 'clamp(22px, 4vw, 38px)', color: '#fff', marginBottom: '14px', lineHeight: 1.25 }}>
                {featured.title}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '16px', lineHeight: 1.7, maxWidth: '600px', marginBottom: '24px' }}>
                {featured.excerpt}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <Link to="#" style={{
                  background: '#fff', color: featured.accent,
                  padding: '12px 28px', borderRadius: '50px',
                  fontWeight: 800, fontSize: '14px', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                }}>
                  <i className="fa fa-book-open" /> Read Full Story
                </Link>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', display: 'flex', gap: '14px' }}>
                  <span><i className="fa fa-calendar" style={{ marginRight: 5 }} />{featured.date}</span>
                  <span><i className="fa fa-clock-o" style={{ marginRight: 5 }} />{featured.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter + Grid ── */}
      <section style={{ padding: '20px 0 80px', background: '#f5f8f5' }}>
        <div className="container">
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '40px', scrollbarWidth: 'none' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="row g-4">
            {filtered.map(story => (
              <div className="col-lg-4 col-md-6" key={story.id}>
                <div
                  className="story-card"
                  onMouseEnter={() => setHoveredId(story.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="story-card-img-wrap">
                    <img src={story.image} alt={story.title} className="story-card-img" />
                    <div className="story-card-overlay" />
                    <span className="story-badge" style={{
                      position: 'absolute', top: '14px', left: '14px', zIndex: 2,
                      background: story.accent, color: '#fff',
                      fontSize: '10px',
                    }}>
                      {story.tag} {story.category}
                    </span>
                    <div style={{
                      position: 'absolute', top: '14px', right: '14px',
                      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
                      color: '#fff', borderRadius: '50px', padding: '4px 12px',
                      fontSize: '11px', fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: '5px',
                      zIndex: 2,
                    }}>
                      <i className="fa fa-clock-o" /> {story.readTime}
                    </div>
                  </div>

                  <div className="story-card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ width: '3px', height: '18px', borderRadius: '3px', background: story.accent, flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                        {story.date}
                      </span>
                    </div>
                    <h5 style={{
                      fontFamily: 'Lora', fontWeight: 700, fontSize: '18px',
                      lineHeight: 1.35, marginBottom: '12px', color: '#111',
                    }}>
                      {story.title}
                    </h5>
                    <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.75, marginBottom: '20px', flex: 1 }}>
                      {story.excerpt}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #f5f5f5' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: `${story.accent}22`, display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <i className="fa fa-leaf" style={{ fontSize: '14px', color: story.accent }} />
                        </div>
                        <span style={{ fontSize: '12px', color: '#888', fontWeight: 600 }}>Village Farm</span>
                      </div>
                      <Link
                        to="#"
                        className="read-more-btn"
                        style={{ color: story.accent }}
                      >
                        Read More <i className="fa fa-long-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>
              <i className="fa fa-filter" style={{ fontSize: '48px', marginBottom: '16px', display: 'block', color: '#ddd' }} />
              <h5 style={{ color: '#bbb' }}>No stories in this category yet.</h5>
            </div>
          )}
        </div>
      </section>

      {/* ── Pull Quote ── */}
      <section className="quote-section">
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <i className="fa fa-leaf" style={{ fontSize: '32px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px', display: 'block' }} />
          <blockquote style={{
            fontFamily: 'Lora', fontStyle: 'italic',
            fontSize: 'clamp(20px, 3vw, 32px)', color: '#fff',
            maxWidth: '750px', margin: '0 auto 24px', lineHeight: 1.6,
            fontWeight: 400,
          }}>
            "Every spice carries the scent of the earth it grew in and the hands that tended it."
          </blockquote>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', letterSpacing: '1px', fontWeight: 600, textTransform: 'uppercase' }}>
            — A Sri Lanka Village Farmer Proverb
          </p>
          <div style={{ marginTop: '35px', display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/marketplace" style={{
              background: '#fff', color: '#2E7D32', padding: '13px 30px',
              borderRadius: '50px', fontWeight: 800, textDecoration: 'none', fontSize: '15px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <i className="fa fa-shopping-basket" /> Visit Marketplace
            </Link>
            <Link to="/contact" style={{
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
              color: '#fff', padding: '13px 30px', borderRadius: '50px',
              fontWeight: 700, textDecoration: 'none', fontSize: '15px',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <i className="fa fa-envelope" /> Share Your Story
            </Link>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section style={{ padding: '80px 0', background: '#f5f8f5' }}>
        <div className="container">
          <div className="newsletter-box">
            <span style={{ display: 'inline-block', background: '#e8f5e9', color: '#2E7D32', padding: '5px 18px', borderRadius: '50px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>
              📬 Newsletter
            </span>
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '28px', color: '#111', marginBottom: '10px' }}>
              Get Village Stories in Your Inbox
            </h3>
            <p style={{ color: '#888', fontSize: '15px', maxWidth: '460px', margin: '0 auto 32px', lineHeight: 1.7 }}>
              Join thousands of readers who receive monthly stories, seasonal recipes, and farm updates directly from Sri Lanka's villages.
            </p>
            <div className="nl-form" style={{ display: 'flex', gap: '12px', maxWidth: '500px', margin: '0 auto' }}>
              <input
                type="email"
                className="nl-input"
                placeholder="your@email.com"
              />
              <button className="nl-btn">
                Subscribe <i className="fa fa-paper-plane" style={{ marginLeft: '6px' }} />
              </button>
            </div>
            <p style={{ color: '#bbb', fontSize: '12px', marginTop: '14px' }}>
              <i className="fa fa-lock" style={{ marginRight: '5px' }} /> No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SpiceStories;
