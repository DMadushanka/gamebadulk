import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import bannerImg from '../img/hero/banner.jpeg';
import cat1 from '../img/categories/cat-1.png';
import cat2 from '../img/categories/cat-2.png';
import cat3 from '../img/categories/cat-3.png';
import cat4 from '../img/categories/cat-4.png';
import cat5 from '../img/categories/cat-5.png';
import cat6 from '../img/categories/cat-6.png';
import cat7 from '../img/categories/cat-7.png';
import feature1 from '../img/featured/feature-1.jpg';
import blog1 from '../img/blog/blog-1.jpg';
import blog2 from '../img/blog/blog-2.jpg';
import blog3 from '../img/blog/blog-3.jpg';
import FarmersMapModal from '../components/FarmersMapModal';

const CATS = [
  { img: cat1, label: 'Traditional Tubers', emoji: '🥔' },
  { img: cat2, label: 'Village Vegetables', emoji: '🥦' },
  { img: cat3, label: 'Fresh Greens', emoji: '🌿' },
  { img: cat4, label: 'Seasonal Staples', emoji: '🌾' },
  { img: cat5, label: 'Local Fruits', emoji: '🍍' },
  { img: cat6, label: 'Pure Spices', emoji: '🌶️' },
  { img: cat7, label: 'Traditional Staples', emoji: '🫙' },
];

const DISTRICTS = ['Matale','Kandy','Kurunegala','Kegalle','Colombo','Gampaha','Kalutara','Galle','Matara','Hambantota','Ratnapura','Nuwara Eliya','Badulla','Monaragala','Polonnaruwa','Anuradhapura','Trincomalee','Batticaloa','Ampara','Jaffna'];
const UNIQUE_CATEGORIES = ['All','Fresh Greens','Seasonal Staples','Local Fruits','Pure Spices','Traditional Staples'];

const Home = ({ user, userData, addToCart }) => {
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showMapModal, setShowMapModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [processingItems, setProcessingItems] = useState({});
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery && !selectedDistrict) return navigate('/marketplace');
    navigate('/marketplace', { state: { initialSearch: `${selectedDistrict} ${searchQuery}`.trim() } });
  };

  const handleAdd = (offer) => {
    if (!user) { navigate('/auth'); return; }
    setProcessingItems(prev => ({ ...prev, [offer.id]: 'adding' }));
    addToCart(offer);
    setTimeout(() => setProcessingItems(prev => { const n = { ...prev }; delete n[offer.id]; return n; }), 800);
  };

  const handleBuy = (offer) => {
    if (!user) { navigate('/auth'); return; }
    setProcessingItems(prev => ({ ...prev, [offer.id]: 'buying' }));
    addToCart(offer);
    setTimeout(() => { setProcessingItems(prev => { const n = { ...prev }; delete n[offer.id]; return n; }); navigate('/cart'); }, 600);
  };

  useEffect(() => {
    const q = query(collection(db, 'products'), where('status', '==', 'approved'));
    const unsub = onSnapshot(q, snap => {
      const data = [];
      snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      setApprovedProducts(data);
    });
    return () => unsub();
  }, []);

  const groupedProducts = approvedProducts.reduce((acc, p) => {
    const key = p.name?.toLowerCase().trim() || 'unknown';
    if (!acc[key]) acc[key] = { name: p.name, category: p.category, imageUrl: p.imageUrl, description: p.description, minPrice: p.price, maxPrice: p.price, offers: [] };
    acc[key].offers.push(p);
    if (p.price < acc[key].minPrice) acc[key].minPrice = p.price;
    if (p.price > acc[key].maxPrice) acc[key].maxPrice = p.price;
    return acc;
  }, {});

  const groupedList = Object.values(groupedProducts);

  const mapLegacyCategory = (cat) => {
    if (!cat) return 'Pure Spices';
    const l = cat.toLowerCase();
    if (l === 'spices') return 'Pure Spices';
    if (l === 'tubers') return 'Traditional Staples';
    if (l === 'rice' || l === 'rice & staples') return 'Seasonal Staples';
    if (l === 'vegetables' || l === 'greens') return 'Fresh Greens';
    if (l === 'fruits') return 'Local Fruits';
    return cat;
  };

  const filteredList = activeCategory === 'All'
    ? groupedList
    : groupedList.filter(item => mapLegacyCategory(item.category) === activeCategory);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,600;1,500&display=swap');

        /* ── Hero ── */
        .home-hero {
          min-height: 100vh;
          background-image: url(${bannerImg});
          background-size: cover;
          background-position: center;
          display: flex; align-items: center;
          position: relative; overflow: hidden;
        }
        .home-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(110deg, rgba(5,20,5,0.92) 0%, rgba(10,40,10,0.75) 55%, rgba(0,0,0,0.3) 100%);
        }
        .hero-particle {
          position: absolute; border-radius: 50%;
          animation: particleFloat 8s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes particleFloat {
          0%,100%{transform:translateY(0) scale(1);opacity:.15;}
          50%{transform:translateY(-30px) scale(1.1);opacity:.25;}
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(165,214,167,0.12);
          border: 1px solid rgba(165,214,167,0.3);
          backdrop-filter: blur(12px);
          color: #A5D6A7; padding: 8px 20px; border-radius: 50px;
          font-size: 12px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; margin-bottom: 24px;
          animation: fadeSlideUp 0.6s ease both;
        }
        .hero-title {
          font-family: 'Outfit', sans-serif; font-weight: 900;
          font-size: clamp(42px, 7vw, 80px);
          color: #fff; line-height: 1.05; letter-spacing: -2px;
          margin-bottom: 24px;
          animation: fadeSlideUp 0.7s 0.1s ease both;
        }
        .hero-title .accent { color: #A5D6A7; font-style: italic; font-family: 'Lora', serif; }
        .hero-subtitle {
          color: rgba(255,255,255,0.7); font-size: 18px; line-height: 1.75;
          max-width: 520px; margin-bottom: 38px;
          animation: fadeSlideUp 0.7s 0.2s ease both;
        }
        .hero-btns { animation: fadeSlideUp 0.7s 0.3s ease both; }
        .hero-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, #2E7D32, #43A047);
          color: #fff; padding: 16px 34px; border-radius: 50px;
          font-weight: 800; font-size: 15px; text-decoration: none;
          box-shadow: 0 10px 30px rgba(46,125,50,0.5);
          transition: all 0.3s; border: none; cursor: pointer;
          font-family: 'Outfit', sans-serif;
        }
        .hero-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(46,125,50,0.6); color: #fff; }
        .hero-btn-secondary {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.25);
          backdrop-filter: blur(8px);
          color: #fff; padding: 16px 34px; border-radius: 50px;
          font-weight: 700; font-size: 15px; text-decoration: none;
          transition: all 0.3s;
        }
        .hero-btn-secondary:hover { background: rgba(255,255,255,0.2); color: #fff; transform: translateY(-3px); }

        /* hero stats */
        .hero-stat-strip {
          display: flex; gap: 16px; flex-wrap: wrap;
          animation: fadeSlideUp 0.7s 0.4s ease both;
          margin-top: 42px;
        }
        .hero-stat-pill {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          padding: 10px 18px; border-radius: 50px;
        }
        .hero-stat-pill .val { font-family: 'Outfit'; font-weight: 900; color: #A5D6A7; font-size: 18px; }
        .hero-stat-pill .lbl { color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 600; }

        /* hero right image grid */
        .hero-image-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px; padding: 20px;
          animation: fadeSlideUp 0.7s 0.2s ease both;
        }
        .hero-grid-img {
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 15px 40px rgba(0,0,0,0.4);
          border: 2px solid rgba(255,255,255,0.1);
        }
        .hero-grid-img img { width: 100%; height: 100%; object-fit: cover; display: block; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Floating Search Bar ── */
        .search-float {
          margin-top: -36px; position: relative; z-index: 20;
          padding-bottom: 0;
        }
        .search-card {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.14);
          padding: 10px 12px;
          display: flex; align-items: center; gap: 0;
          overflow: hidden;
        }
        .search-district {
          display: flex; align-items: center; gap: 10px;
          padding: 0 20px; border-right: 2px solid #f0f0f0;
          min-width: 180px;
        }
        .search-district select {
          border: none; outline: none; background: transparent;
          font-weight: 700; color: #333; font-size: 14px;
          cursor: pointer; font-family: 'Outfit', sans-serif;
          padding: 14px 0; width: 100%;
        }
        .search-input-wrap {
          flex: 1; display: flex; align-items: center; gap: 10px; padding: 0 20px;
        }
        .search-input-wrap input {
          flex: 1; border: none; outline: none; font-size: 15px;
          color: #333; font-family: 'Outfit', sans-serif; padding: 14px 0;
        }
        .search-submit {
          background: linear-gradient(135deg, #2E7D32, #43A047);
          color: #fff; border: none; padding: 14px 28px; border-radius: 16px;
          font-weight: 800; font-size: 14px; cursor: pointer;
          font-family: 'Outfit', sans-serif; letter-spacing: 0.5px;
          transition: all 0.3s; display: flex; align-items: center; gap: 8px;
        }
        .search-submit:hover { transform: scale(1.03); box-shadow: 0 8px 25px rgba(46,125,50,0.4); }
        .map-trigger {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 22px; border-left: 2px solid #f0f0f0;
          cursor: pointer; transition: background 0.3s; border-radius: 0 20px 20px 0;
        }
        .map-trigger:hover { background: #f0f7f0; }
        .map-icon-box {
          width: 44px; height: 44px; border-radius: 12px;
          background: linear-gradient(135deg,#e8f5e9,#c8e6c9);
          display: flex; align-items: center; justify-content: center;
          color: #2E7D32; font-size: 18px; flex-shrink: 0;
        }

        /* ── Stats Banner ── */
        .stats-banner { background: linear-gradient(135deg, #1B5E20, #2E7D32); padding: 0; }
        .stat-item { padding: 32px 20px; text-align: center; border-right: 1px solid rgba(255,255,255,0.1); }
        .stat-item:last-child { border-right: none; }
        .stat-num { font-family: 'Outfit'; font-weight: 900; font-size: 32px; color: #fff; line-height: 1; }
        .stat-lbl { font-size: 12px; color: rgba(255,255,255,0.65); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

        /* ── Category Slider ── */
        .cat-runner { overflow: hidden; padding: 20px 0; }
        .cat-track { display: flex; animation: catScroll 30s linear infinite; width: max-content; }
        .cat-track:hover { animation-play-state: paused; }
        @keyframes catScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .cat-chip {
          flex-shrink: 0; margin-right: 16px;
          position: relative; border-radius: 20px; overflow: hidden;
          width: 240px; height: 200px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          cursor: pointer; transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        .cat-chip:hover { transform: translateY(-10px) scale(1.03); box-shadow: 0 22px 50px rgba(46,125,50,0.28); }
        .cat-chip img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s; }
        .cat-chip:hover img { transform: scale(1.08); }
        .cat-chip-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.05) 60%);
          transition: opacity 0.3s;
        }
        .cat-chip:hover .cat-chip-overlay { opacity: 0.9; }
        .cat-chip-label {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 18px; z-index: 2;
          display: flex; align-items: center; gap: 8px;
        }
        .cat-chip-label span { color: #fff; font-weight: 800; font-size: 14px; font-family: 'Outfit'; }
        .cat-emoji { font-size: 20px; }

        /* ── Section Header ── */
        .sec-badge {
          display: inline-block; background: #e8f5e9; color: #2E7D32;
          padding: 5px 16px; border-radius: 50px;
          font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; margin-bottom: 12px;
        }
        .sec-title {
          font-family: 'Outfit'; font-weight: 800;
          font-size: clamp(28px, 4vw, 40px); color: #111;
          margin-bottom: 8px; line-height: 1.15;
        }
        .sec-sub { color: #888; font-size: 15px; max-width: 520px; line-height: 1.7; }

        /* Category filter pills */
        .filter-pills { display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; margin-bottom: 40px; padding-bottom: 4px; }
        .filter-pill {
          padding: 9px 22px; border-radius: 50px; flex-shrink: 0;
          border: 2px solid #e8edf0; background: #fff; color: #666;
          font-weight: 700; font-size: 13px; cursor: pointer;
          transition: all 0.25s; font-family: 'Outfit';
        }
        .filter-pill:hover { border-color: #2E7D32; color: #2E7D32; }
        .filter-pill.active {
          background: linear-gradient(135deg, #2E7D32, #43A047);
          border-color: transparent; color: #fff;
          box-shadow: 0 6px 20px rgba(46,125,50,0.35);
        }

        /* ── Product Cards ── */
        .prod-card {
          background: #fff; border-radius: 20px;
          border: 1px solid #f0f0f0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          overflow: hidden; cursor: pointer;
          transition: all 0.35s ease;
          display: flex; flex-direction: column; height: 100%;
        }
        .prod-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(46,125,50,0.13);
          border-color: transparent;
        }
        .prod-img-wrap { position: relative; overflow: hidden; height: 200px; }
        .prod-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; background: #f5f5f5; }
        .prod-card:hover .prod-img { transform: scale(1.07); }
        .prod-badge {
          position: absolute; top: 12px; left: 12px;
          background: linear-gradient(135deg, #2E7D32, #43A047);
          color: #fff; padding: 4px 12px; border-radius: 50px;
          font-size: 10px; font-weight: 800; letter-spacing: 0.5px;
          z-index: 2;
        }
        .prod-body { padding: 18px 20px 20px; flex: 1; display: flex; flex-direction: column; }
        .prod-name {
          font-weight: 800; font-size: 16px; color: #111;
          margin-bottom: 6px; font-family: 'Outfit';
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .prod-price { font-weight: 900; font-size: 20px; color: #2E7D32; margin-bottom: 6px; font-family: 'Outfit'; }
        .prod-loc { font-size: 12px; color: #aaa; display: flex; align-items: center; gap: 5px; margin-top: auto; padding-top: 10px; border-top: 1px solid #f5f5f5; }

        /* ── How It Works ── */
        .hiw-section { background: linear-gradient(135deg, #f0f8f0 0%, #e8f5e9 100%); }
        .hiw-card {
          background: #fff; border-radius: 28px; padding: 44px 36px;
          text-align: center; height: 100%;
          box-shadow: 0 10px 40px rgba(0,0,0,0.06);
          transition: all 0.4s ease; position: relative;
          border: 1px solid rgba(255,255,255,0.9);
        }
        .hiw-card:hover { transform: translateY(-12px); box-shadow: 0 30px 70px rgba(46,125,50,0.15); }
        .hiw-num {
          position: absolute; top: -16px; left: 50%; transform: translateX(-50%);
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #2E7D32, #66BB6A);
          color: #fff; font-weight: 900; font-size: 14px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 18px rgba(46,125,50,0.4);
          font-family: 'Outfit';
        }
        .hiw-icon {
          width: 80px; height: 80px; border-radius: 24px;
          display: flex; align-items: center; justify-content: center;
          font-size: 34px; margin: 16px auto 24px;
        }
        .hiw-connector {
          position: absolute; top: 50%; left: 100%;
          width: 60px; height: 2px;
          background: repeating-linear-gradient(90deg, #2E7D32 0, #2E7D32 6px, transparent 6px, transparent 14px);
          transform: translateY(-50%); z-index: 1;
        }

        /* ── Why Gamebadu ── */
        .why-section { background: #fff; }
        .why-img-stack { position: relative; }
        .why-main-img { border-radius: 28px; overflow: hidden; box-shadow: 0 25px 70px rgba(0,0,0,0.15); }
        .why-main-img img { width: 100%; display: block; }
        .why-float-card {
          position: absolute; bottom: -20px; right: -20px;
          background: #fff; border-radius: 20px; padding: 20px 24px;
          box-shadow: 0 15px 50px rgba(0,0,0,0.14);
          display: flex; align-items: center; gap: 14px;
          min-width: 200px;
        }
        .why-float-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .why-check { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px; }
        .why-check-icon {
          width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
          background: #e8f5e9; display: flex; align-items: center; justify-content: center;
          color: #2E7D32; font-size: 13px; margin-top: 2px;
        }

        /* ── Stories Row ── */
        .story-mini-card {
          border-radius: 20px; overflow: hidden; position: relative;
          height: 260px; cursor: pointer;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          transition: all 0.4s ease;
        }
        .story-mini-card:hover { transform: translateY(-6px); box-shadow: 0 20px 55px rgba(0,0,0,0.2); }
        .story-mini-card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s; }
        .story-mini-card:hover img { transform: scale(1.07); }
        .story-mini-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%);
        }
        .story-mini-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px; z-index: 2; }

        /* ── CTA Banner ── */
        .cta-section {
          background: linear-gradient(135deg, #0a2e0a 0%, #1B5E20 50%, #2E7D32 100%);
          padding: 100px 0; position: relative; overflow: hidden;
        }
        .cta-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12; }

        /* ── Modal ── */
        @keyframes modalIn { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }
        .modal-offer-row {
          border: 1px solid #eef0ee; border-radius: 16px; padding: 18px 20px;
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
          box-shadow: 0 4px 15px rgba(0,0,0,0.04); transition: box-shadow 0.3s;
        }
        .modal-offer-row:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.08); }

        /* ── Responsive ── */
        @media(max-width:991px){
          .home-hero{ min-height: auto; }
          .hero-image-grid{ display:none!important; }
          .search-district{ display:none!important; }
          .hiw-connector{ display:none!important; }
          .why-float-card{ position:static; margin-top:20px; display:inline-flex; }
        }

        /* Tablet */
        @media(max-width:767px){
          /* Hero */
          .home-hero { min-height: auto; background-position: 60% center; }
          .hero-eyebrow { font-size:11px; padding:6px 14px; margin-bottom:16px; }
          .hero-subtitle { font-size:15px; margin-bottom:24px; }
          .hero-btns { display:flex; flex-direction:column; align-items:flex-start; gap:10px; }
          .hero-btn-primary, .hero-btn-secondary {
            padding:13px 22px; font-size:14px; width:auto;
          }
          .hero-stat-strip { margin-top:28px; gap:10px; }
          .hero-stat-pill { padding:8px 14px; }
          .hero-stat-pill .val { font-size:16px; }
          .hero-stat-pill .lbl { font-size:11px; }

          /* Search */
          .search-float { margin-top: -20px; }
          .search-card { flex-direction:row; border-radius:16px; padding:8px 10px; gap:6px; flex-wrap:nowrap; }
          .search-input-wrap { padding:0 10px; }
          .search-input-wrap input { font-size:13px; padding:10px 0; }
          .search-submit { padding:10px 14px; font-size:13px; border-radius:12px; }
          .map-trigger { display:none!important; }

          /* Stats */
          .stat-item { padding:22px 12px; border-right:none; border-bottom:1px solid rgba(255,255,255,0.1); }
          .stat-num { font-size:24px; }
          .stat-lbl { font-size:11px; }

          /* Cats */
          .cat-chip { width:160px; height:140px; border-radius:16px; margin-right:12px; }
          .cat-chip-label { padding:12px; }
          .cat-chip-label span { font-size:12px; }
          .cat-emoji { font-size:16px; }

          /* Cards */
          .prod-img-wrap { height:150px; }
          .prod-body { padding:12px 14px 14px; }
          .prod-name { font-size:13px; }
          .prod-price { font-size:16px; }
          .prod-loc { font-size:11px; }

          /* HIW */
          .hiw-card { padding:32px 20px; border-radius:20px; }
          .hiw-icon { width:60px; height:60px; font-size:26px; margin:14px auto 18px; }

          /* Stories */
          .story-mini-card { height:190px; }
          .story-mini-content { padding:14px; }
          .story-mini-content h6 { font-size:14px !important; }

          /* CTA */
          .cta-section { padding:60px 0; }
        }

        /* Mobile (< 576px) */
        @media(max-width:575px){
          /* Hero tight */
          .hero-title { letter-spacing: -0.5px; margin-bottom:16px; }
          .hero-subtitle { font-size:14px; line-height:1.65; margin-bottom:20px; }
          .hero-btns { flex-direction: row; flex-wrap: wrap; gap:8px; }
          .hero-btn-primary, .hero-btn-secondary {
            padding:11px 16px; font-size:13px; gap:6px;
          }
          .hero-stat-strip { gap:8px; margin-top:22px; }
          .hero-stat-pill { padding:7px 12px; gap:7px; }
          .hero-stat-pill .val { font-size:14px; }
          .hero-stat-pill .lbl { font-size:10px; }

          /* Search – single row pill style */
          .search-float { margin-top:-16px; }
          .search-card { border-radius:14px; padding:6px 8px; }
          .search-input-wrap input { font-size:12px; }
          .search-submit { padding:9px 12px; font-size:12px; }

          /* Stats 2×2 grid */
          .stat-item { border-bottom:1px solid rgba(255,255,255,0.08); }
          .stat-num { font-size:22px; }

          /* Section headings */
          .sec-title { font-size:22px !important; }
          .sec-badge { font-size:10px; }

          /* Filter pills compact */
          .filter-pill { padding:7px 14px; font-size:12px; }
          .filter-pills { margin-bottom:24px; }

          /* Product cards 2-col */
          .prod-img-wrap { height:130px; }
          .prod-body { padding:10px 12px 12px; }
          .prod-name { font-size:12px; }
          .prod-price { font-size:15px; margin-bottom:4px; }
          .prod-loc { font-size:10px; padding-top:8px; }

          /* HIW compact */
          .hiw-card { padding:28px 16px 24px; border-radius:18px; }
          .hiw-icon { width:52px; height:52px; font-size:22px; border-radius:16px; }
          .hiw-card h5 { font-size:15px !important; margin-bottom:8px !important; }
          .hiw-card p { font-size:12px !important; }
          .hiw-num { width:30px; height:30px; font-size:12px; top:-14px; }

          /* Why section */
          .why-check { margin-bottom:14px; gap:10px; }
          .why-check-icon { width:24px; height:24px; font-size:11px; }

          /* Stories tighter */
          .story-mini-card { height:170px; }

          /* Modal */
          .modal-offer-row { flex-direction:column; align-items:flex-start; padding:14px; gap:12px; }

          /* CTA */
          .cta-section { padding:50px 0; }
        }
      `}</style>

      {/* ══════════════════════════════
          HERO SECTION
      ══════════════════════════════ */}
      <section className="home-hero" style={{paddingTop:0}}>
        <div className="home-hero-overlay" />
        {/* Ambient blobs */}
        <div className="hero-particle" style={{width:500,height:500,background:'#2E7D32',top:-150,right:-100,animationDuration:'9s'}} />
        <div className="hero-particle" style={{width:300,height:300,background:'#66BB6A',bottom:-80,left:'15%',animationDuration:'7s',animationDelay:'2s'}} />
        <div className="hero-particle" style={{width:180,height:180,background:'#A5D6A7',top:'30%',right:'25%',animationDuration:'11s',animationDelay:'1s'}} />

        <div className="container" style={{position:'relative',zIndex:5,padding:'clamp(60px,12vw,100px) 15px clamp(100px,16vw,140px)'}}>
          <div className="row align-items-center">
            {/* Left Content */}
            <div className="col-lg-7">
              <div className="hero-eyebrow">
                <span style={{width:8,height:8,borderRadius:'50%',background:'#A5D6A7',display:'inline-block'}} />
                Direct from Sri Lankan Villages
              </div>
              <h1 className="hero-title">
                Fresh, Honest<br />
                <span className="accent">Village Produce</span><br />
                at Your Door
              </h1>
              <p className="hero-subtitle">
                Connecting you directly with local farmers for a fairer, fresher harvest.
                No middlemen, just pure village goodness — picked and sold with pride.
              </p>
              <div className="hero-btns" style={{display:'flex',gap:'14px',flexWrap:'wrap'}}>
                <Link to="/marketplace" className="hero-btn-primary">
                  <i className="fa fa-shopping-basket" /> Shop Marketplace
                </Link>
                <button className="hero-btn-secondary" onClick={() => setShowMapModal(true)}>
                  <i className="fa fa-map-marker" /> Find Farmers Near You
                </button>
                {userData?.role === 'farmer' && (
                  <Link to="/farmer" className="hero-btn-primary" style={{background:'linear-gradient(135deg,#f57c00,#FB8C00)'}}>
                    ✨ List Product
                  </Link>
                )}
              </div>

              {/* Animated Stats Pills */}
              <div className="hero-stat-strip">
                {[
                  {val:'500+',lbl:'Village Farmers',icon:'fa-users'},
                  {val:'25+',lbl:'Districts',icon:'fa-map-marker'},
                  {val:'100%',lbl:'Pesticide Free',icon:'fa-leaf'},
                ].map((s,i)=>(
                  <div className="hero-stat-pill" key={i}>
                    <i className={`fa ${s.icon}`} style={{color:'#A5D6A7',fontSize:'16px'}} />
                    <div>
                      <div className="val">{s.val}</div>
                      <div className="lbl">{s.lbl}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image Grid */}
            <div className="col-lg-5 d-none d-lg-block">
              <div className="hero-image-grid">
                <div className="hero-grid-img" style={{height:200}}><img src={blog1} alt="farm" /></div>
                <div className="hero-grid-img" style={{height:160,marginTop:40}}><img src={blog2} alt="market" /></div>
                <div className="hero-grid-img" style={{height:160}}><img src={blog3} alt="spice" /></div>
                <div className="hero-grid-img" style={{height:200,marginTop:-40}}><img src={blog1} alt="village" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FLOATING SEARCH BAR
      ══════════════════════════════ */}
      <div className="search-float">
        <div className="container">
          <form onSubmit={handleSearch}>
            <div className="search-card">
              {/* District */}
              <div className="search-district">
                <i className="fa fa-map-marker" style={{color:'#2E7D32',fontSize:'18px',flexShrink:0}} />
                <select value={selectedDistrict} onChange={e=>setSelectedDistrict(e.target.value)}>
                  <option value="">All Districts</option>
                  {DISTRICTS.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {/* Text Input */}
              <div className="search-input-wrap">
                <i className="fa fa-search" style={{color:'#ccc',fontSize:'16px'}} />
                <input
                  type="text"
                  placeholder="Search for spices, vegetables, tubers..."
                  value={searchQuery}
                  onChange={e=>setSearchQuery(e.target.value)}
                />
              </div>
              {/* Submit */}
              <button type="submit" className="search-submit">
                <i className="fa fa-search" /> Search
              </button>
              {/* Map Trigger */}
              <div className="map-trigger" onClick={()=>setShowMapModal(true)}>
                <div className="map-icon-box">
                  <i className="fa fa-map-marker" />
                </div>
                <div style={{lineHeight:1.3}}>
                  <div style={{fontWeight:800,fontSize:'14px',color:'#111',fontFamily:'Outfit'}}>Map View</div>
                  <div style={{fontSize:'12px',color:'#aaa'}}>Find nearby farmers</div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {showMapModal && <FarmersMapModal onClose={()=>setShowMapModal(false)} />}

      {/* ══════════════════════════════
          STATS BANNER
      ══════════════════════════════ */}
      <section className="stats-banner" style={{marginTop:40}}>
        <div className="container-fluid">
          <div className="row">
            {[
              {num:'500+',lbl:'Farmers Registered',icon:'fa-users'},
              {num:'25',lbl:'Districts Covered',icon:'fa-map'},
              {num:'2,000+',lbl:'Products Sold',icon:'fa-shopping-basket'},
              {num:'100%',lbl:'Village Sourced',icon:'fa-leaf'},
            ].map((s,i)=>(
              <div className="col-6 col-md-3 stat-item" key={i}>
                <i className={`fa ${s.icon}`} style={{fontSize:'22px',color:'rgba(165,214,167,0.8)',marginBottom:'8px',display:'block'}} />
                <div className="stat-num">{s.num}</div>
                <div className="stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          AUTO-SCROLL CATEGORIES
      ══════════════════════════════ */}
      <section style={{padding:'70px 0 50px',background:'#fdfdfd'}}>
        <div className="container" style={{marginBottom:'30px'}}>
          <div style={{textAlign:'center'}}>
            <span className="sec-badge">Browse by Category</span>
            <h2 className="sec-title">What Are You Looking For?</h2>
          </div>
        </div>
        <div className="cat-runner">
          <div className="cat-track">
            {[...CATS,...CATS].map((c,i)=>(
              <div className="cat-chip" key={i} onClick={()=>navigate('/marketplace')}>
                <img src={c.img} alt={c.label} />
                <div className="cat-chip-overlay" />
                <div className="cat-chip-label">
                  <span className="cat-emoji">{c.emoji}</span>
                  <span>{c.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════ */}
      <section style={{padding:'60px 0 80px',background:'#f5f8f5'}}>
        <div className="container">
          <div className="row align-items-end mb-4">
            <div className="col-md-6">
              <span className="sec-badge">🌾 Fresh From The Farm</span>
              <h2 className="sec-title">Featured Produce</h2>
              <p className="sec-sub">Real listings from verified village farmers across Sri Lanka.</p>
            </div>
            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <Link to="/marketplace" style={{display:'inline-flex',alignItems:'center',gap:'8px',color:'#2E7D32',fontWeight:700,textDecoration:'none',fontSize:'14px',border:'2px solid #2E7D32',padding:'10px 22px',borderRadius:'50px',transition:'all 0.3s'}}
                onMouseEnter={e=>{e.currentTarget.style.background='#2E7D32';e.currentTarget.style.color='#fff';}}
                onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#2E7D32';}}>
                View All <i className="fa fa-long-arrow-right" />
              </Link>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="filter-pills">
            {UNIQUE_CATEGORIES.map(cat=>(
              <button key={cat} className={`filter-pill ${activeCategory===cat?'active':''}`} onClick={()=>setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {filteredList.length === 0 ? (
            <div style={{textAlign:'center',padding:'60px 0',color:'#aaa'}}>
              <i className="fa fa-leaf" style={{fontSize:'52px',color:'#ddd',marginBottom:'16px',display:'block'}} />
              <h5 style={{color:'#ccc'}}>No products in this category yet.</h5>
            </div>
          ) : (
            <div className="row g-3">
              {filteredList.map((group,idx)=>(
                <div className="col-6 col-md-4 col-lg-3" key={idx}>
                  <div className="prod-card" onClick={()=>setSelectedGroup(group)}>
                    <div className="prod-img-wrap">
                      {group.imageUrl
                        ? <img src={group.imageUrl} alt={group.name} className="prod-img" />
                        : <img src={feature1} alt={group.name} className="prod-img" />
                      }
                      <div className="prod-badge">
                        {group.offers.length} Offer{group.offers.length>1?'s':''}
                      </div>
                    </div>
                    <div className="prod-body">
                      <div className="prod-name">{group.name}</div>
                      <div className="prod-price">
                        {group.minPrice===group.maxPrice ? `Rs. ${group.minPrice}` : `Rs. ${group.minPrice}+`}
                        <span style={{fontSize:'12px',color:'#aaa',fontWeight:500}}> /kg</span>
                      </div>
                      <div className="prod-loc">
                        <i className="fa fa-map-marker" style={{color:'#2E7D32'}} /> Multiple Locations
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════
          HOW IT WORKS
      ══════════════════════════════ */}
      <section className="hiw-section" style={{padding:'90px 0'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'60px'}}>
            <span className="sec-badge">Simple Process</span>
            <h2 className="sec-title">How Gamebadu Works</h2>
            <p className="sec-sub" style={{margin:'0 auto'}}>
              Supporting local farmers is just a few clicks away. No middlemen, no pesticides — pure village goodness at your fingertips.
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              {step:1,icon:'fa-map-marker',bg:'#e8f5e9',color:'#2E7D32',title:'Select Location',desc:'Filter by district to find growers in your immediate area for maximum freshness and minimum transport time.'},
              {step:2,icon:'fa-shopping-basket',bg:'#fff3e0',color:'#f57c00',title:'Pick Produce',desc:'Browse fresh spices, tubers, greens and staples listed directly by verified village farming families.'},
              {step:3,icon:'fa-whatsapp',bg:'#e8f8ed',color:'#25D366',title:'Connect & Buy',desc:'WhatsApp the farmer directly, arrange a fair-price deal, and support the village economy with every purchase.'},
            ].map((s,i)=>(
              <div className="col-md-4" key={i} style={{position:'relative'}}>
                <div className="hiw-card">
                  <div className="hiw-num">{s.step}</div>
                  <div className="hiw-icon" style={{background:s.bg}}>
                    <i className={`fa ${s.icon}`} style={{fontSize:'32px',color:s.color}} />
                  </div>
                  <h5 style={{fontFamily:'Outfit',fontWeight:800,fontSize:'20px',color:'#111',marginBottom:'12px'}}>{s.title}</h5>
                  <p style={{color:'#777',fontSize:'14px',lineHeight:1.75,margin:0}}>{s.desc}</p>
                </div>
                {i < 2 && <div className="hiw-connector d-none d-md-block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          WHY GAMEBADU  
      ══════════════════════════════ */}
      <section className="why-section" style={{padding:'90px 0'}}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="why-img-stack">
                <div className="why-main-img">
                  <img src={blog2} alt="Village farmer" style={{width:'100%',display:'block'}} />
                </div>
                <div className="why-float-card">
                  <div className="why-float-icon" style={{background:'#e8f5e9'}}>🌿</div>
                  <div>
                    <div style={{fontWeight:800,fontSize:'22px',color:'#1B5E20',fontFamily:'Outfit',lineHeight:1}}>100%</div>
                    <div style={{fontSize:'13px',color:'#888',marginTop:'2px'}}>Organic Village Produce</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <span className="sec-badge">Why Choose Us</span>
              <h2 className="sec-title">The Gamebadu Difference</h2>
              <p style={{color:'#888',fontSize:'15px',lineHeight:1.8,marginBottom:'32px'}}>
                We believe the best food comes from people who genuinely care — families who have
                farmed the same land across generations, using traditional wisdom and sustainable methods.
              </p>
              {[
                {icon:'fa-leaf',color:'#2E7D32',bg:'#e8f5e9',title:'Zero Pesticides',desc:'All our farmers commit to chemical-free, traditional growing methods.'},
                {icon:'fa-bolt',color:'#f57c00',bg:'#fff3e0',title:'Same-Day Freshness',desc:'Products are listed live and ordered direct — no cold storage delays.'},
                {icon:'fa-handshake-o',color:'#1565C0',bg:'#e3f2fd',title:'Fair Farmer Prices',desc:'Farmers set their own prices — no exploitation, no middlemen cut.'},
                {icon:'fa-map-marker',color:'#C62828',bg:'#ffebee',title:'Hyperlocal Sourcing',desc:'Buy from your own district and know exactly where your food comes from.'},
              ].map((item,i)=>(
                <div className="why-check" key={i}>
                  <div className="why-check-icon" style={{background:item.bg,color:item.color}}>
                    <i className={`fa ${item.icon}`} />
                  </div>
                  <div>
                    <div style={{fontWeight:800,fontSize:'15px',color:'#111',marginBottom:'4px',fontFamily:'Outfit'}}>{item.title}</div>
                    <div style={{fontSize:'14px',color:'#888',lineHeight:1.6}}>{item.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{display:'flex',gap:'14px',marginTop:'32px',flexWrap:'wrap'}}>
                <Link to="/marketplace" className="hero-btn-primary" style={{fontSize:'14px',padding:'13px 28px'}}>
                  <i className="fa fa-shopping-basket" /> Shop Now
                </Link>
                <Link to="/spice-stories" style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'13px 28px',borderRadius:'50px',border:'2px solid #e0e0e0',color:'#555',fontWeight:700,fontSize:'14px',textDecoration:'none',fontFamily:'Outfit',transition:'all 0.3s'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='#2E7D32';e.currentTarget.style.color='#2E7D32';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='#e0e0e0';e.currentTarget.style.color='#555';}}>
                  <i className="fa fa-book" /> Read Stories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          SPICE STORIES PREVIEW
      ══════════════════════════════ */}
      <section style={{padding:'80px 0',background:'#f5f8f5'}}>
        <div className="container">
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'40px',flexWrap:'wrap',gap:'14px'}}>
            <div>
              <span className="sec-badge">📖 From The Village</span>
              <h2 className="sec-title" style={{margin:0}}>Spice Stories</h2>
            </div>
            <Link to="/spice-stories" style={{display:'inline-flex',alignItems:'center',gap:'8px',color:'#2E7D32',fontWeight:700,textDecoration:'none',fontSize:'14px'}}>
              All Stories <i className="fa fa-long-arrow-right" />
            </Link>
          </div>
          <div className="row g-3">
            {[
              {img:blog1,cat:'Heritage Spices',title:'The Black Pepper Legacy of Matale',date:'April 2026'},
              {img:blog2,cat:'Healing Spices',title:"Turmeric: Sri Lanka's Golden Root",date:'March 2026'},
              {img:blog3,cat:'Artisan Craft',title:'How Gammirisgama Grows Your Cinnamon',date:'Feb 2026'},
            ].map((s,i)=>(
              <div className="col-md-4" key={i}>
                <Link to="/spice-stories" style={{textDecoration:'none'}}>
                  <div className="story-mini-card">
                    <img src={s.img} alt={s.title} />
                    <div className="story-mini-overlay" />
                    <div className="story-mini-content">
                      <span style={{background:'rgba(46,125,50,0.85)',color:'#fff',padding:'3px 10px',borderRadius:'50px',fontSize:'10px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase'}}>{s.cat}</span>
                      <h6 style={{color:'#fff',fontFamily:'Outfit',fontWeight:700,fontSize:'16px',marginTop:'10px',marginBottom:'4px',lineHeight:1.4}}>{s.title}</h6>
                      <span style={{color:'rgba(255,255,255,0.6)',fontSize:'12px'}}><i className="fa fa-calendar" style={{marginRight:5}} />{s.date}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          CTA BANNER
      ══════════════════════════════ */}
      <section className="cta-section">
        <div className="cta-blob" style={{width:500,height:500,background:'#66BB6A',top:-150,right:-100}} />
        <div className="cta-blob" style={{width:300,height:300,background:'#A5D6A7',bottom:-100,left:-80}} />
        <div className="container" style={{position:'relative',zIndex:2,textAlign:'center'}}>
          <span style={{display:'inline-block',background:'rgba(255,255,255,0.12)',border:'1px solid rgba(165,214,167,0.3)',color:'#A5D6A7',padding:'7px 20px',borderRadius:'50px',fontSize:'12px',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:'22px'}}>
            🌿 &nbsp;Join the Movement
          </span>
          <h2 style={{fontFamily:'Outfit',fontWeight:900,fontSize:'clamp(32px,5vw,58px)',color:'#fff',marginBottom:'18px',lineHeight:1.1,letterSpacing:'-1px'}}>
            Ready to Go Farm-to-Table?
          </h2>
          <p style={{color:'rgba(255,255,255,0.7)',fontSize:'18px',maxWidth:'520px',margin:'0 auto 40px',lineHeight:1.7}}>
            Join thousands of Sri Lankans buying pesticide-free village produce, direct from the farmers who grow it.
          </p>
          <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/marketplace" className="hero-btn-primary" style={{fontSize:'16px',padding:'17px 38px'}}>
              <i className="fa fa-shopping-basket" /> Browse Marketplace
            </Link>
            {!user && (
              <Link to="/auth" style={{display:'inline-flex',alignItems:'center',gap:'10px',background:'rgba(255,255,255,0.12)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.3)',color:'#fff',padding:'17px 38px',borderRadius:'50px',fontWeight:700,fontSize:'16px',textDecoration:'none',transition:'all 0.3s'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.12)'}>
                <i className="fa fa-user-plus" /> Register as Farmer
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          SELLERS MODAL (unchanged logic)
      ══════════════════════════════ */}
      {selectedGroup && (
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.6)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(5px)'}}>
          <div style={{background:'#fff',borderRadius:'24px',width:'90%',maxWidth:'820px',maxHeight:'90vh',overflowY:'auto',position:'relative',boxShadow:'0 20px 70px rgba(0,0,0,0.3)',animation:'modalIn 0.3s ease'}}>
            {/* Modal Header */}
            <div style={{background:'linear-gradient(135deg,#f8f9fa,#f0f7f0)',padding:'22px 30px',borderBottom:'1px solid #eee',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:10}}>
              <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
                {selectedGroup.imageUrl
                  ? <img src={selectedGroup.imageUrl} alt={selectedGroup.name} style={{width:60,height:60,borderRadius:'14px',objectFit:'cover',border:'2px solid #e8f5e9'}} />
                  : <img src={feature1} alt={selectedGroup.name} style={{width:60,height:60,borderRadius:'14px',objectFit:'cover',border:'2px solid #e8f5e9'}} />}
                <div>
                  <h4 style={{margin:0,fontWeight:800,fontFamily:'Outfit',fontSize:'20px'}}>{selectedGroup.name}</h4>
                  <span style={{fontSize:'12px',color:'#2E7D32',background:'#e8f5e9',padding:'3px 12px',borderRadius:'50px',fontWeight:700}}>{selectedGroup.category}</span>
                </div>
              </div>
              <button onClick={()=>setSelectedGroup(null)} style={{background:'#f5f5f5',border:'none',width:38,height:38,borderRadius:'50%',fontSize:'18px',color:'#666',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s'}}
                onMouseEnter={e=>{e.currentTarget.style.background='#fee';e.currentTarget.style.color='#e53935';}}
                onMouseLeave={e=>{e.currentTarget.style.background='#f5f5f5';e.currentTarget.style.color='#666';}}>
                ✕
              </button>
            </div>
            {/* Modal Body */}
            <div style={{padding:'28px 30px'}}>
              {selectedGroup.description && <p style={{color:'#777',marginBottom:'20px',lineHeight:1.7,fontSize:'14px'}}>{selectedGroup.description}</p>}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'18px'}}>
                <h6 style={{fontWeight:800,color:'#1B5E20',fontFamily:'Outfit',margin:0}}>
                  Available Offers <span style={{background:'#e8f5e9',color:'#2E7D32',padding:'2px 10px',borderRadius:'50px',fontSize:'12px',marginLeft:'8px'}}>{selectedGroup.offers.length}</span>
                </h6>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                {selectedGroup.offers.map(offer => {
                  const status = processingItems[offer.id];
                  const isAdding = status === 'adding';
                  const isBuying = status === 'buying';
                  return (
                    <div key={offer.id} className="modal-offer-row">
                      <div>
                        <div style={{fontSize:'22px',fontWeight:900,color:'#2E7D32',fontFamily:'Outfit'}}>
                          Rs. {offer.price} <span style={{fontSize:'13px',color:'#bbb',fontWeight:400}}>/{offer.unit||'kg'}</span>
                        </div>
                        <div style={{display:'flex',flexWrap:'wrap',gap:'14px',marginTop:'6px',fontSize:'13px',color:'#777'}}>
                          <span><i className="fa fa-map-marker" style={{color:'#2E7D32',marginRight:5}} />{offer.district}</span>
                          <span><i className="fa fa-envelope" style={{marginRight:5}} />{offer.farmerEmail}</span>
                          {offer.quantity > 0 && <span>🧮 Qty: {offer.quantity}</span>}
                        </div>
                      </div>
                      <div style={{display:'flex',gap:'8px',marginTop:'12px',flexWrap:'wrap'}}>
                        <button onClick={()=>handleAdd(offer)} disabled={!!status}
                          style={{background:isAdding?'#f0f7f0':'#fff',color:'#2E7D32',border:'2px solid #2E7D32',padding:'10px 18px',borderRadius:'12px',fontWeight:700,fontSize:'14px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',transition:'all 0.3s',fontFamily:'Outfit'}}>
                          {isAdding ? <><i className="fa fa-circle-o-notch fa-spin" /> Adding...</> : <><i className="fa fa-shopping-cart" /> Add to Cart</>}
                        </button>
                        <button onClick={()=>handleBuy(offer)} disabled={!!status}
                          style={{background:isBuying?'#1b5e20':'#2E7D32',color:'#fff',border:'none',padding:'10px 18px',borderRadius:'12px',fontWeight:700,fontSize:'14px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',transition:'all 0.3s',fontFamily:'Outfit'}}>
                          {isBuying ? <><i className="fa fa-circle-o-notch fa-spin" /> Buying...</> : 'Buy Now'}
                        </button>
                        <a href={`https://wa.me/94${(offer.phone||'770000000').replace(/^0/,'')}`} target="_blank" rel="noopener noreferrer"
                          style={{background:'#25D366',color:'#fff',padding:'10px 18px',borderRadius:'12px',textDecoration:'none',fontWeight:700,fontSize:'14px',display:'flex',alignItems:'center',gap:'6px',fontFamily:'Outfit'}}>
                          <i className="fa fa-whatsapp" style={{fontSize:'18px'}} /> WhatsApp
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
