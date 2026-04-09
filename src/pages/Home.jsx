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
import FarmersMapModal from '../components/FarmersMapModal';

const Home = ({ user, userData, addToCart }) => {
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showMapModal, setShowMapModal] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery && !selectedDistrict) return navigate('/marketplace');
    const finalSearch = `${selectedDistrict} ${searchQuery}`.trim();
    navigate('/marketplace', { state: { initialSearch: finalSearch } });
  };

  const [processingItems, setProcessingItems] = useState({});

  const handleAdd = (offer) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setProcessingItems(prev => ({ ...prev, [offer.id]: 'adding' }));
    addToCart(offer);
    setTimeout(() => {
      setProcessingItems(prev => {
        const next = { ...prev };
        delete next[offer.id];
        return next;
      });
    }, 800);
  };

  const handleBuy = (offer) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setProcessingItems(prev => ({ ...prev, [offer.id]: 'buying' }));
    addToCart(offer);
    setTimeout(() => {
      setProcessingItems(prev => {
        const next = { ...prev };
        delete next[offer.id];
        return next;
      });
      navigate('/cart');
    }, 600);
  };

  useEffect(() => {
    const q = query(collection(db, 'products'), where('status', '==', 'approved'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = [];
      snapshot.forEach(doc => {
        productsData.push({ id: doc.id, ...doc.data() });
      });
      setApprovedProducts(productsData);
    });

    return () => unsubscribe();
  }, []);

  // Group products by name
  const groupedProducts = approvedProducts.reduce((acc, p) => {
    const key = p.name?.toLowerCase().trim() || 'unknown';
    if (!acc[key]) {
      acc[key] = {
        name: p.name,
        category: p.category,
        imageUrl: p.imageUrl,
        description: p.description,
        minPrice: p.price,
        maxPrice: p.price,
        offers: []
      };
    }
    acc[key].offers.push(p);
    if (p.price < acc[key].minPrice) acc[key].minPrice = p.price;
    if (p.price > acc[key].maxPrice) acc[key].maxPrice = p.price;
    return acc;
  }, {});

  const groupedList = Object.values(groupedProducts);

  const uniqueCategories = ['All', 'Fresh Greens', 'Seasonal Staples', 'Local Fruits', 'Pure Spices', 'Traditional Staples'];
  
  const mapLegacyCategory = (cat) => {
    if (!cat) return 'Pure Spices';
    const lower = cat.toLowerCase();
    if (lower === 'spices') return 'Pure Spices';
    if (lower === 'tubers') return 'Traditional Staples';
    if (lower === 'rice' || lower === 'rice & staples') return 'Seasonal Staples';
    if (lower === 'vegetables' || lower === 'greens') return 'Fresh Greens';
    if (lower === 'fruits') return 'Local Fruits';
    return cat; // if already matches exact string
  };

  const filteredList = activeCategory === 'All' 
    ? groupedList 
    : groupedList.filter(item => mapLegacyCategory(item.category) === activeCategory);

  return (
    <>
      {/* Hero Banner Section (Contained Floating Island) */}
      <section className="hero-banner-section animate" style={{ paddingTop: '30px' }}>
        <div className="container">
          <div className="hero__item set-bg" style={{ 
            backgroundImage: `url(${bannerImg})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '60vh',
            minHeight: '450px',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 100%)' }}></div>
            
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
              <div className="row">
                <div className="col-lg-9 col-md-10">
                  <div className="hero__text" style={{ padding: '0 40px' }}>
                    <span style={{ color: '#A5D6A7', fontWeight: 800, letterSpacing: '3px', fontSize: '15px', textTransform: 'uppercase', display: 'block', marginBottom: '15px' }}>DIRECT FROM SRI LANKAN VILLAGES</span>
                    <h2 style={{ color: '#fff', fontSize: '54px', fontWeight: 900, marginBottom: '25px', lineHeight: 1.15, textShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>Fresh, Pesticide-Free <br />Village Staples</h2>
                    <p style={{ color: '#f5f5f5', fontSize: '18px', maxWidth: '550px', marginBottom: '40px', fontWeight: 400, lineHeight: 1.6 }}>Connecting you directly with local farmers for a fairer, fresher harvest. No middlemen, just pure village goodness.</p>
                    
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      <Link to="#" className="primary-btn" style={{ background: '#2E7D32', border: 'none', padding: '16px 36px', borderRadius: '50px', fontSize: '15px', fontWeight: 800, boxShadow: '0 10px 25px rgba(46,125,50,0.4)', color: '#fff', textDecoration: 'none', transition: 'all 0.3s' }}>
                        FIND GROWERS NEAR YOU
                      </Link>
                      {userData?.role === 'farmer' && (
                        <Link to="/farmer" className="primary-btn" style={{ background: '#fff', color: '#2E7D32', border: 'none', padding: '16px 36px', borderRadius: '50px', fontSize: '15px', fontWeight: 800, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textDecoration: 'none', transition: 'all 0.3s' }}>
                          ✨ LIST NEW PRODUCT
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Search Section (Overlapping) */}
      <section className="hero-search-section animate" style={{ marginTop: '-45px', position: 'relative', zIndex: 10, paddingBottom: '30px' }}>
        <div className="container">
          <div className="hero__search" style={{ background: '#fff', padding: '15px 30px', margin: '0 20px', borderRadius: '20px', boxShadow: '0 15px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            
            <div className="hero__search__form" style={{ width: '65%', paddingLeft: 0 }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', alignItems: 'center', margin: 0 }}>
                <div className="hero__search__categories" style={{ position: 'relative', width: '35%', paddingLeft: '15px', fontWeight: 700, color: '#333', borderRight: '2px solid #eee' }}>
                  <select 
                     value={selectedDistrict} 
                     onChange={(e) => setSelectedDistrict(e.target.value)}
                     style={{ border: 'none', width: '100%', height: '50px', background: 'transparent', outline: 'none', fontWeight: 700, color: '#333', appearance: 'none', cursor: 'pointer', position: 'relative', zIndex: 2 }}>
                    <option value="">All Districts</option>
                    {['Matale', 'Kandy', 'Kurunegala', 'Kegalle', 'Colombo', 'Gampaha', 'Kalutara', 'Galle', 'Matara', 'Hambantota', 'Ratnapura', 'Nuwara Eliya', 'Badulla', 'Monaragala', 'Polonnaruwa', 'Anuradhapura', 'Trincomalee', 'Batticaloa', 'Ampara', 'Jaffna'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <span className="arrow_carrot-down" style={{ position: 'absolute', right: '15px', top: '16px', zIndex: 1, pointerEvents: 'none' }}>▼</span>
                </div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search village produce near you..." 
                  style={{ width: '65%', border: 'none', padding: '0 20px', height: '50px', fontSize: '15px' }} 
                />
                <button type="submit" className="site-btn" style={{ right: 0, height: '50px', borderRadius: '0 15px 15px 0' }}>SEARCH</button>
              </form>
            </div>
            
            <div onClick={() => setShowMapModal(true)} className="hero__search__phone" style={{ width: '30%', justifyContent: 'flex-end', margin: 0, display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: 'all 0.3s' }}>
              <div className="hero__search__phone__icon" style={{ background: '#e8f5e9', color: '#2E7D32', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <i className="fa fa-map-marker"></i>
              </div>
              <div className="hero__search__phone__text">
                <h5 style={{ fontWeight: 800, margin: 0, fontSize: '16px' }}>Location Based</h5>
                <span style={{ fontSize: '13px', color: '#888' }}>Find Farmers Nearby</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic React Leaflet Map Modal */}
      {showMapModal && <FarmersMapModal onClose={() => setShowMapModal(false)} />}

      {/* Categories Slider Animation Section */}
      <section className="categories animate" style={{ padding: '60px 0 20px', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative' }}>
          <div className="cat-slider-container">
            <div className="cat-slider-track">
              {/* First Set */}
              <div className="cat-slide-item">
                <div className="cat-card-modern set-bg" style={{ backgroundImage: `url(${cat1})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                  <h5><Link to="#">Traditional Tubers</Link></h5>
                </div>
              </div>
              <div className="cat-slide-item">
                <div className="cat-card-modern set-bg" style={{ backgroundImage: `url(${cat2})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                  <h5><Link to="#">Village Vegetables</Link></h5>
                </div>
              </div>
              <div className="cat-slide-item">
                <div className="cat-card-modern set-bg" style={{ backgroundImage: `url(${cat3})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                  <h5><Link to="#">Fresh Greens</Link></h5>
                </div>
              </div>
              <div className="cat-slide-item">
                <div className="cat-card-modern set-bg" style={{ backgroundImage: `url(${cat4})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                  <h5><Link to="#">Seasonal Staples</Link></h5>
                </div>
              </div>
              <div className="cat-slide-item">
                <div className="cat-card-modern set-bg" style={{ backgroundImage: `url(${cat5})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                  <h5><Link to="#">Local Fruits</Link></h5>
                </div>
              </div>
              <div className="cat-slide-item">
                <div className="cat-card-modern set-bg" style={{ backgroundImage: `url(${cat6})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                  <h5><Link to="#">Pure Spices</Link></h5>
                </div>
              </div>
              <div className="cat-slide-item">
                <div className="cat-card-modern set-bg" style={{ backgroundImage: `url(${cat7})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                  <h5><Link to="#">Traditional Staples</Link></h5>
                </div>
              </div>
              {/* Cloned Set for Infinite Loop */}
              <div className="cat-slide-item">
                <div className="cat-card-modern set-bg" style={{ backgroundImage: `url(${cat1})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                  <h5><Link to="#">Traditional Tubers</Link></h5>
                </div>
              </div>
              <div className="cat-slide-item">
                <div className="cat-card-modern set-bg" style={{ backgroundImage: `url(${cat2})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                  <h5><Link to="#">Village Vegetables</Link></h5>
                </div>
              </div>
              <div className="cat-slide-item">
                <div className="cat-card-modern set-bg" style={{ backgroundImage: `url(${cat3})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                  <h5><Link to="#">Fresh Greens</Link></h5>
                </div>
              </div>
              <div className="cat-slide-item">
                <div className="cat-card-modern set-bg" style={{ backgroundImage: `url(${cat4})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                  <h5><Link to="#">Seasonal Staples</Link></h5>
                </div>
              </div>
              <div className="cat-slide-item">
                <div className="cat-card-modern set-bg" style={{ backgroundImage: `url(${cat5})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                  <h5><Link to="#">Local Fruits</Link></h5>
                </div>
              </div>
              <div className="cat-slide-item">
                <div className="cat-card-modern set-bg" style={{ backgroundImage: `url(${cat6})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                  <h5><Link to="#">Pure Spices</Link></h5>
                </div>
              </div>
              <div className="cat-slide-item">
                <div className="cat-card-modern set-bg" style={{ backgroundImage: `url(${cat7})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                  <h5><Link to="#">Traditional Staples</Link></h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured animate" style={{ padding: '80px 0', background: '#fdfdfd' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <span style={{ color: '#2E7D32', fontWeight: 700, letterSpacing: '2px', fontSize: '14px', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>FRESH FROM THE FARM</span>
                <h2 style={{ fontWeight: 800, fontSize: '42px', color: '#111' }}>Featured Produce</h2>
                <div style={{ width: '80px', height: '4px', background: '#2E7D32', margin: '20px auto 0', borderRadius: '10px' }}></div>
              </div>
              <div className="featured__controls" style={{ marginBottom: '50px' }}>
                <ul className="featured-filter-scroll" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px', padding: 0, listStyle: 'none' }}>
                  {uniqueCategories.map(cat => (
                    <li 
                      key={cat}
                      className={activeCategory === cat ? "active" : ""} 
                      onClick={() => setActiveCategory(cat)}
                      style={{ 
                        cursor: 'pointer', padding: '10px 28px', 
                        background: activeCategory === cat ? '#2E7D32' : '#fff', 
                        color: activeCategory === cat ? '#fff' : '#555', 
                        border: activeCategory === cat ? 'none' : '2px solid #eee',
                        borderRadius: '50px', fontWeight: activeCategory === cat ? 700 : 600, 
                        fontSize: '15px', 
                        boxShadow: activeCategory === cat ? '0 8px 20px rgba(46,125,50,0.25)' : 'none',
                        transition: 'all 0.3s' 
                      }}>
                      {cat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="row featured__filter">
            {/* Dynamic Real Products Grouped */}
            {filteredList.map((group, idx) => (
              <div className="col-6 col-lg-3 col-md-4 col-sm-6 text-center mb-4" key={idx} style={{ padding: "0 10px" }}>
                <div className="featured__item modern-featured-card" style={{ cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => setSelectedGroup(group)}>
                  <div className="featured__item__pic set-bg" style={{ backgroundImage: `url(${group.imageUrl || feature1})`, borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                    <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--primary)', color: '#fff', padding: '6px 14px', borderRadius: '50px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>
                      {group.offers.length} Offer{group.offers.length > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="featured__item__text" style={{ padding: '20px 10px 0' }}>
                    <h6 style={{ fontWeight: 800, fontSize: '17px', marginBottom: '8px' }}><a href="#" onClick={(e) => { e.preventDefault(); setSelectedGroup(group); }} style={{ color: '#222' }}>{group.name}</a></h6>
                    <h5 style={{ color: '#2E7D32', fontWeight: 800, fontSize: '18px', marginBottom: '8px' }}>
                      {group.minPrice === group.maxPrice
                        ? `Rs. ${group.minPrice}`
                        : `Rs. ${group.minPrice} - ${group.maxPrice}`}
                    </h5>
                    <p className="text-muted" style={{ fontSize: '13px', margin: 0 }}>
                      <i className="fa fa-map-marker" style={{ color: '#bbb', marginRight: 6 }} /> Various Locations
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Fallback Static Items if no products */}
            {filteredList.length === 0 && (
              <div className="col-12 text-center" style={{ padding: "40px", color: "#888", fontWeight: 700 }}>
                No products found for this category.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works animate" style={{ padding: '100px 0', background: 'linear-gradient(135deg, #f0f8ff 0%, #e8f5e9 100%)', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title" style={{ textAlign: 'center', marginBottom: '60px' }}>
                <span style={{ color: '#2E7D32', fontWeight: 700, letterSpacing: '2px', fontSize: '14px', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>SIMPLE PROCESS</span>
                <h2 style={{ fontWeight: 800, fontSize: '42px', color: '#111' }}>How It Works</h2>
                <div style={{ width: '80px', height: '4px', background: '#2E7D32', margin: '20px auto 30px', borderRadius: '10px' }}></div>
                <p style={{ color: '#555', maxWidth: '600px', margin: '0 auto', fontSize: '18px', lineHeight: 1.6 }}>Supporting local farmers is just a few clicks away. No middlemen, no pesticides, just pure village goodness direct to you.</p>
              </div>
            </div>
          </div>
          <div className="row how-it-works-row" style={{ position: 'relative' }}>
            <div className="col-4 col-lg-4" style={{ padding: '0 5px' }}>
              <div className="step-card modern-step-card" style={{ padding: '50px 40px', borderRadius: '30px', marginBottom: '30px', background: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', textAlign: 'center', position: 'relative', zIndex: 2, height: '100%', transition: 'all 0.4s' }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 25px', background: '#e8f5e9', color: '#2E7D32', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                  <i className="fa fa-map-marker"></i>
                </div>
                <h5 style={{ fontWeight: 800, marginBottom: '15px', color: '#222', fontSize: '22px' }}>1. Select Location</h5>
                <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>Filter by district to find growers in your immediate area for maximum freshness.</p>
              </div>
            </div>
            <div className="col-4 col-lg-4" style={{ padding: '0 5px' }}>
              <div className="step-card modern-step-card" style={{ padding: '50px 40px', borderRadius: '30px', marginBottom: '30px', background: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', textAlign: 'center', position: 'relative', zIndex: 2, height: '100%', transition: 'all 0.4s' }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 25px', background: '#fff3e0', color: '#f57c00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                  <i className="fa fa-shopping-basket"></i>
                </div>
                <h5 style={{ fontWeight: 800, marginBottom: '15px', color: '#222', fontSize: '22px' }}>2. Pick Produce</h5>
                <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>Browse fresh spices, tubers, and staples grown directly by village families.</p>
              </div>
            </div>
            <div className="col-4 col-lg-4" style={{ padding: '0 5px' }}>
              <div className="step-card modern-step-card" style={{ padding: '50px 40px', borderRadius: '30px', marginBottom: '30px', background: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', textAlign: 'center', position: 'relative', zIndex: 2, height: '100%', transition: 'all 0.4s' }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 25px', background: '#e1f5fe', color: '#0288d1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                  <i className="fa fa-whatsapp" style={{ color: '#25D366' }}></i>
                </div>
                <h5 style={{ fontWeight: 800, marginBottom: '15px', color: '#222', fontSize: '22px' }}>3. Connect Locally</h5>
                <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>WhatsApp or Call the farmer directly to arrange a fair-price purchase.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sellers Modal */}
      {selectedGroup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex',
          alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: '#fff', borderRadius: '24px', width: '90%', maxWidth: '800px',
            maxHeight: '90vh', overflowY: 'auto', position: 'relative',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'fadeIn 0.3s ease'
          }}>
            {/* Modal Header */}
            <div style={{
              background: '#f8f9fa', padding: '20px 30px', borderBottom: '1px solid #eee',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              position: 'sticky', top: 0, zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src={selectedGroup.imageUrl || feature1} alt={selectedGroup.name} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ margin: 0, fontWeight: 700 }}>{selectedGroup.name}</h4>
                  <span style={{ fontSize: '12px', color: '#888', background: '#eee', padding: '3px 10px', borderRadius: '50px' }}>
                    {selectedGroup.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                style={{ background: 'none', border: 'none', fontSize: '24px', color: '#888', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content - Offers List */}
            <div style={{ padding: '30px' }}>
              <p style={{ color: '#555', marginBottom: '20px' }}>{selectedGroup.description}</p>
              <h6 style={{ fontWeight: 700, marginBottom: '15px', color: '#1B5E20' }}>
                Available Offers ({selectedGroup.offers.length})
              </h6>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {selectedGroup.offers.map(offer => {
                  const status = processingItems[offer.id];
                  const isAdding = status === 'adding';
                  const isBuying = status === 'buying';

                  return (
                    <div key={offer.id} className="modal-offer-item" style={{
                      border: '1px solid #eee', borderRadius: '16px', padding: '16px 20px',
                      display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
                    }}>
                      <div className="modal-offer-info">
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#2E7D32' }}>
                          Rs. {offer.price} <span style={{ fontSize: '13px', color: '#aaa', fontWeight: 400 }}>/{offer.unit || 'kg'}</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '6px', fontSize: '13px', color: '#666' }}>
                          <span><i className="fa fa-map-marker" style={{ color: 'var(--primary)' }} /> {offer.district}</span>
                          <span><i className="fa fa-envelope" /> {offer.farmerEmail}</span>
                          {offer.quantity > 0 && <span>🧮 Qty: {offer.quantity}</span>}
                        </div>
                      </div>
                      <div className="modal-offer-actions" style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => handleAdd(offer)}
                          disabled={!!status}
                          style={{
                            background: isAdding ? '#f0f0f0' : '#fff', 
                            color: '#2E7D32', border: '2px solid #2E7D32', 
                            padding: '10px 16px', borderRadius: '10px',
                            fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                            transition: 'all 0.3s'
                          }}>
                          {isAdding ? <><i className="fa fa-circle-o-notch fa-spin"></i> Adding...</> : <><i className="fa fa-shopping-cart" /> Add to Cart</>}
                        </button>
                        <button 
                          onClick={() => handleBuy(offer)}
                          disabled={!!status}
                          style={{
                            background: isBuying ? '#1b5e20' : '#2E7D32', 
                            color: '#fff', border: 'none', 
                            padding: '10px 16px', borderRadius: '10px',
                            fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            transition: 'all 0.3s'
                          }}>
                          {isBuying ? <><i className="fa fa-circle-o-notch fa-spin"></i> Buying...</> : 'Buy Now'}
                        </button>
                        <a href={`https://wa.me/94${(offer.phone || '770000000').replace(/^0/, '')}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{
                            background: '#25D366', color: '#fff', padding: '10px 16px', borderRadius: '10px',
                            textDecoration: 'none', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px'
                          }}>
                          <i className="fa fa-whatsapp" style={{ fontSize: '18px' }} /> WhatsApp
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
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        
        /* Auto Scrolling Slider Track */
        .cat-slider-container {
          width: 100%;
          overflow: hidden;
          padding: 10px 0;
        }
        .cat-slider-track {
          display: flex;
          width: 200%; /* Enough width to hold 2x the normal amount */
          animation: slideAnimation 25s linear infinite;
        }
        .cat-slider-container:hover .cat-slider-track {
          animation-play-state: paused;
        }
        .cat-slide-item {
          flex: 0 0 auto;
          width: 280px;
          margin-right: 30px;
        }
        @keyframes slideAnimation {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        /* Modern Category Card */
        .cat-card-modern {
           position: relative;
           border-radius: 24px;
           overflow: hidden;
           box-shadow: 0 10px 30px rgba(0,0,0,0.08);
           transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
           height: 220px;
           margin-bottom: 30px;
        }
        .cat-card-modern:hover {
           transform: translateY(-12px) scale(1.03);
           box-shadow: 0 20px 40px rgba(46,125,50,0.25);
        }
        .cat-card-modern::before {
           content: '';
           position: absolute;
           top: 0; left: 0; width: 100%; height: 100%;
           background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 100%);
           z-index: 1;
           transition: opacity 0.3s;
        }
        .cat-card-modern:hover::before {
           opacity: 0.9;
        }
        .cat-card-modern h5 {
           position: absolute;
           bottom: 25px;
           left: 0;
           width: 100%;
           text-align: center;
           z-index: 2;
           margin: 0;
           transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .cat-card-modern:hover h5 {
           transform: translateY(-5px);
        }
        .cat-card-modern h5 a {
           color: #fff;
           font-weight: 800;
           font-size: 16px;
           letter-spacing: 0.5px;
           text-shadow: 0 2px 10px rgba(0,0,0,0.3);
           text-decoration: none;
           padding: 10px 24px;
           background: rgba(46, 125, 50, 0.85);
           border-radius: 50px;
           backdrop-filter: blur(8px);
           border: 1px solid rgba(255,255,255,0.2);
           transition: all 0.3s;
        }
        .cat-card-modern:hover h5 a {
           background: #fff;
           color: #2E7D32;
           border-color: #fff;
        }

        /* Featured Card Hover */
        .modern-featured-card {
           background: #fff;
           border-radius: 20px;
           overflow: hidden;
           padding-bottom: 25px;
           border: 1px solid #f0f0f0;
           box-shadow: 0 5px 15px rgba(0,0,0,0.02);
        }
        .modern-featured-card:hover {
           transform: translateY(-8px);
           border-color: transparent;
           box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        .modern-featured-card:hover .featured__item__pic {
           box-shadow: 0 15px 35px rgba(46,125,50,0.15) !important;
        }

        /* Hover interaction for filters */
        .featured__controls ul li:not(.active):hover {
           border-color: #2E7D32 !important;
           color: #2E7D32 !important;
        }

        /* Step Card Modern */
        .modern-step-card:hover {
          transform: translateY(-15px) scale(1.02);
          box-shadow: 0 30px 60px rgba(0,0,0,0.1) !important;
        }

        /* Global Responsive Padding Reductions for mobile */
        @media (max-width: 991px) {
          .hero-banner-section .hero__item { min-height: auto !important; height: auto !important; padding: 40px 0; border-radius: 0 !important; }
          .hero-banner-section .container { padding: 0 !important; }
          .hero-banner-section h2 { font-size: 38px !important; }
          .hero-banner-section .hero__text { padding: 0 15px !important; text-align: center; }
          .hero-banner-section .hero__text p { margin: 0 auto 20px auto !important; font-size: 16px !important; }
          .hero-banner-section .hero__text div { justify-content: center; }
          
          .hero-search-section .hero__search { margin: 0 10px !important; flex-direction: column; padding: 15px !important; }
          .hero-search-section .hero__search__form { width: 100% !important; margin-bottom: 15px !important; border-bottom: 1px solid #eee; padding-bottom: 15px; }
          .hero-search-section .hero__search__phone { width: 100% !important; justify-content: center !important; }
          
          .featured__controls ul { gap: 8px !important; }
          .featured__controls ul li { padding: 6px 14px !important; font-size: 12px !important; margin-bottom: 8px; }
        }

        @media (max-width: 768px) {
          .hero-banner-section h2 { font-size: 32px !important; line-height: 1.2 !important; }
          .hero-search-section .hero__search__categories { display: none !important; }
          .hero-search-section .hero__search__form input { padding-left: 0 !important; text-align: center; height: 40px !important; font-size: 13px !important; }
          .hero-search-section .hero__search__form form { flex-direction: column; gap: 10px; }
          .hero-search-section .hero__search__form input { width: 100% !important; border-radius: 10px !important; border: 1px solid #eee !important; }
          .hero-search-section .site-btn { width: 100%; border-radius: 10px !important; height: 40px !important; font-size: 13px !important; padding: 0 !important; }

          /* Scale down sections globally */
          section.featured, section.how-it-works, section.categories { padding: 40px 0 !important; }
        }

        @media (max-width: 575px) {
          /* Scale Hero Banner Heavily */
          .hero-banner-section h2 { font-size: 26px !important; marginBottom: 15px !important; }
          .hero-banner-section .hero__text span { font-size: 11px !important; letter-spacing: 1px !important; marginBottom: 5px !important; }
          .hero-banner-section .hero__text p { font-size: 14px !important; }
          .primary-btn { padding: 10px 20px !important; font-size: 12px !important; }
          
          .section-title h2 { font-size: 24px !important; }
          .section-title p { font-size: 13px !important; }
          .section-title span { font-size: 11px !important; letter-spacing: 1px !important; marginBottom: 5px !important; }
          
          /* Scale Categories deeply */
          .cat-slider-track { animation-duration: 20s !important; }
          .cat-slide-item { width: 140px !important; margin-right: 15px !important; }
          .cat-card-modern { height: 120px !important; border-radius: 16px !important; margin-bottom: 15px !important; }
          .cat-card-modern h5 a { font-size: 11px !important; padding: 6px 12px !important; }
          .cat-card-modern h5 { bottom: 15px !important; }

          /* Modal Styling Tightened */
          .modal-offer-item { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; padding: 12px !important; }
          .modal-offer-info div { font-size: 16px !important; }
          .modal-offer-info span { font-size: 11px !important; }
          .modal-offer-actions { width: 100%; justify-content: stretch; }
          .modal-offer-actions a { flex: 1; justify-content: center; padding: 8px 10px !important; font-size: 12px !important; }

          /* Featured Cards 2-per-row Scaling */
          .row.featured__filter { margin: 0 -8px; }
          .featured__filter > div { padding: 0 8px !important; }
          .modern-featured-card { padding-bottom: 10px !important; border-radius: 12px !important; }
          .modern-featured-card .featured__item__pic { height: 120px !important; border-radius: 12px 12px 0 0 !important; }
          .modern-featured-card .featured__item__text { padding: 10px 5px 0 !important; }
          .modern-featured-card .featured__item__text h6 { font-size: 12px !important; margin-bottom: 3px !important; }
          .modern-featured-card .featured__item__text h6 a { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
          .modern-featured-card .featured__item__text h5 { font-size: 13px !important; margin-bottom: 4px !important; }
          .modern-featured-card .featured__item__text p { font-size: 10px !important; }
          .featured__item__pic div { font-size: 9px !important; padding: 3px 6px !important; top: 6px !important; left: 6px !important; }

          /* How It works Condensed 3-columns */
          .how-it-works-row { margin: 0 -5px !important; }
          .modern-step-card { padding: 15px 5px !important; margin-bottom: 10px !important; border-radius: 12px !important; height: 100% !important; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; }
          .modern-step-card div:first-child { width: 35px !important; height: 35px !important; font-size: 16px !important; margin-bottom: 10px !important; }
          .modern-step-card h5 { font-size: 11px !important; margin-bottom: 6px !important; line-height: 1.3 !important; }
          .modern-step-card p { font-size: 9px !important; line-height: 1.4 !important; }

          /* Filter scrollable wrapper */
          .featured-filter-scroll {
             flex-wrap: nowrap !important;
             justify-content: flex-start !important;
             overflow-x: auto !important;
             padding-bottom: 15px !important;
             margin: 0 -15px !important;
             padding-left: 15px !important;
             padding-right: 15px !important;
             -webkit-overflow-scrolling: touch;
             scroll-snap-type: x mandatory;
          }
          .featured-filter-scroll li {
             scroll-snap-align: start;
             flex-shrink: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Home;
