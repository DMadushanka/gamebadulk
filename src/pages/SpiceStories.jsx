import React from 'react';
import { Link } from 'react-router-dom';
import breadcrumbImg from '../img/breadcrumb.jpg';
import feature1 from '../img/featured/feature-1.jpg';

const STORIES = [
  {
    id: 1,
    title: 'The Black Pepper Legacy of Matale',
    excerpt: 'For generations, the hill-country villages of Matale have nurtured premium-grade black pepper vines. Discover how these farming families are keeping an ancient tradition alive.',
    category: 'Heritage Spices',
    date: 'April 2026',
    readTime: '5 min read',
    icon: 'fa-leaf',
    color: '#2E7D32',
  },
  {
    id: 2,
    title: 'Turmeric: Sri Lanka\'s Golden Root',
    excerpt: 'From village gardens to global kitchens — the farmers of Kurunegala share their secrets for cultivating the most potent organic turmeric in the island.',
    category: 'Healing Spices',
    date: 'March 2026',
    readTime: '4 min read',
    icon: 'fa-sun-o',
    color: '#F9A825',
  },
  {
    id: 3,
    title: 'How Gammirisgama Grows Your Cinnamon',
    excerpt: 'Ceylon cinnamon is the world\'s finest — and it starts in the hands of skilled village peelers. A close look at the art behind Sri Lanka\'s most prized export.',
    category: 'Artisan Craft',
    date: 'February 2026',
    readTime: '6 min read',
    icon: 'fa-tree',
    color: '#6D4C41',
  },
  {
    id: 4,
    title: 'A Day in the Life of a Village Farmer',
    excerpt: 'Wake up with Sunil from Kandy District as he tends to his organic vegetable patch, preparing produce that will reach your table the very same day.',
    category: 'Farmer Stories',
    date: 'January 2026',
    readTime: '7 min read',
    icon: 'fa-user',
    color: '#1565C0',
  },
  {
    id: 5,
    title: 'The Rise of Organic Farming in Sri Lanka',
    excerpt: 'A quiet revolution is underway. Village by village, farmers are abandoning chemical fertilisers and returning to traditional, sustainable growing methods.',
    category: 'Sustainability',
    date: 'January 2026',
    readTime: '5 min read',
    icon: 'fa-recycle',
    color: '#00695C',
  },
  {
    id: 6,
    title: 'From Paddy Field to Your Plate',
    excerpt: 'Sri Lanka\'s red rice tradition runs deeper than food — it is culture, medicine, and history. Meet the farmers preserving heirloom rice varieties for future generations.',
    category: 'Heritage Crops',
    date: 'December 2025',
    readTime: '8 min read',
    icon: 'fa-pagelines',
    color: '#C62828',
  },
];

const SpiceStories = () => (
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
          Spice Stories
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
          <Link to="/" style={{ color: 'var(--primary)' }}>Home</Link>&nbsp;/&nbsp;Spice Stories
        </p>
      </div>
    </div>

    {/* Intro */}
    <section style={{ padding: '70px 0 30px', textAlign: 'center', background: '#fdfdfd' }}>
      <div className="container">
        <div className="section-title">
          <h2>Tales from the Village</h2>
          <p style={{ color: '#666', maxWidth: '650px', margin: '0 auto 20px', fontSize: '16px', lineHeight: 1.7 }}>
            Behind every spice in your kitchen is a story. Meet the growers, explore their lands,
            and understand the passion that makes Sri Lankan produce truly special.
          </p>
        </div>
      </div>
    </section>

    {/* Stories Grid */}
    <section style={{ padding: '10px 0 80px', background: '#fdfdfd' }}>
      <div className="container">
        <div className="row">
          {STORIES.map(story => (
            <div className="col-lg-4 col-md-6 mb-4" key={story.id}>
              <div
                className="glass-card"
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.07)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.13)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.07)';
                }}
              >
                {/* Story Header */}
                <div
                  style={{
                    background: `linear-gradient(135deg, ${story.color}22, ${story.color}44)`,
                    padding: '40px 30px 30px',
                    textAlign: 'center',
                    borderBottom: `3px solid ${story.color}33`,
                  }}
                >
                  <div style={{
                    width: '70px', height: '70px', borderRadius: '50%',
                    background: story.color, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 15px',
                    boxShadow: `0 8px 25px ${story.color}55`,
                  }}>
                    <i className={`fa ${story.icon}`} style={{ fontSize: '28px', color: '#fff' }} />
                  </div>
                  <span style={{
                    background: story.color, color: '#fff',
                    padding: '4px 14px', borderRadius: '50px',
                    fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}>
                    {story.category}
                  </span>
                </div>

                {/* Story Body */}
                <div style={{ padding: '25px 30px 30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h5 style={{ fontWeight: 700, fontSize: '18px', lineHeight: 1.4, marginBottom: '12px', color: '#222' }}>
                    {story.title}
                  </h5>
                  <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.7, flex: 1, marginBottom: '20px' }}>
                    {story.excerpt}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#999', fontSize: '12px' }}>
                      <i className="fa fa-calendar" style={{ marginRight: 5 }} />{story.date}
                      &nbsp;&nbsp;
                      <i className="fa fa-clock-o" style={{ marginRight: 5 }} />{story.readTime}
                    </div>
                    <Link
                      to="#"
                      style={{
                        color: story.color, fontWeight: 700, fontSize: '13px',
                        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px',
                      }}
                    >
                      Read More <i className="fa fa-arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default SpiceStories;
