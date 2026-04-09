import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import feature1 from '../img/featured/feature-1.jpg';
import breadcrumbImg from '../img/breadcrumb.jpg';

const CATEGORIES = ['All', 'Spices', 'Tubers', 'Vegetables', 'Rice & Staples', 'Greens'];

const Marketplace = ({ user, addToCart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(location.state?.initialSearch || '');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedGroup, setSelectedGroup] = useState(null);
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
      const data = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      setProducts(data);
    });
    return () => unsubscribe();
  }, []);

  // Group products by name
  const groupedProducts = products.reduce((acc, p) => {
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

  const filtered = groupedList.filter(group => {
    const matchesSearch = group.name?.toLowerCase().includes(search.toLowerCase()) ||
      group.offers.some(o => o.district?.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === 'All' ||
      group.category?.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Breadcrumb */}
      <div
        className="breadcrumb-section"
        style={{
          backgroundImage: `url(${breadcrumbImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '80px 0',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.55)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontFamily: 'Outfit', fontWeight: 800, fontSize: '42px', marginBottom: '10px' }}>
            Village Marketplace
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
            <Link to="/" style={{ color: 'var(--primary)' }}>Home</Link> &nbsp;/&nbsp; Marketplace
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <section style={{ padding: '50px 0 20px', background: '#fdfdfd' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-3">
              <div style={{ position: 'relative' }}>
                <i className="fa fa-search" style={{
                  position: 'absolute', left: '16px', top: '50%',
                  transform: 'translateY(-50%)', color: '#aaa', fontSize: '16px'
                }} />
                <input
                  type="text"
                  placeholder="Search by product name or district..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: '100%', padding: '14px 20px 14px 44px',
                    border: '2px solid #eee', borderRadius: '50px',
                    fontSize: '15px', outline: 'none',
                    transition: 'border 0.3s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = '#eee'}
                />
              </div>
            </div>
            <div className="col-lg-6 mb-3">
              <div 
                className="category-scroll-container"
                style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  overflowX: 'auto', 
                  paddingBottom: '10px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '6px 14px', borderRadius: '50px', border: '2px solid',
                      borderColor: activeCategory === cat ? 'var(--primary)' : '#ddd',
                      background: activeCategory === cat ? 'var(--primary)' : '#fff',
                      color: activeCategory === cat ? '#fff' : '#555',
                      fontWeight: 600, fontSize: '12px', cursor: 'pointer',
                      transition: 'all 0.3s',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="featured spad" style={{ paddingTop: '20px' }}>
        <div className="container">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
              <i className="fa fa-leaf" style={{ fontSize: '60px', color: '#ddd', marginBottom: '20px', display: 'block' }} />
              <h4>No products found</h4>
              <p>Try a different search or category filter.</p>
            </div>
          ) : (
            <div className="row mobile-grid">
              {filtered.map((group, idx) => (
                <div className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4" key={idx}>
                  <div className="featured__item" style={{ cursor: 'pointer' }} onClick={() => setSelectedGroup(group)}>
                    <div
                      className="featured__item__pic set-bg"
                      style={{ 
                        backgroundImage: `url(${group.imageUrl || feature1})`,
                        height: '180px' // Slightly shorter for density
                      }}
                    >
                      <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--primary)', color: '#fff', padding: '3px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 700 }}>
                        {group.offers.length} Offer{group.offers.length > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="featured__item__text" style={{ paddingTop: '10px' }}>
                      <h6 style={{ fontSize: '14px', marginBottom: '5px' }}>
                        <a href="#" onClick={(e) => { e.preventDefault(); setSelectedGroup(group); }}>{group.name}</a>
                      </h6>
                      <h5 style={{ fontSize: '16px', color: '#2E7D32' }}>
                        {group.minPrice === group.maxPrice
                          ? `Rs. ${group.minPrice}`
                          : `Rs. ${group.minPrice}+`}
                      </h5>
                      <p className="text-muted" style={{ fontSize: '11px', marginBottom: 0 }}>
                        <i className="fa fa-map-marker" style={{ color: 'var(--primary)', marginRight: 4 }} />
                        View Available Districts
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                    <div key={offer.id} style={{
                      border: '1px solid #eee', borderRadius: '16px', padding: '16px 20px',
                      display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
                    }}>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#2E7D32' }}>
                          Rs. {offer.price} <span style={{ fontSize: '13px', color: '#aaa', fontWeight: 400 }}>/{offer.unit || 'kg'}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '6px', fontSize: '13px', color: '#666' }}>
                          <span><i className="fa fa-map-marker" style={{ color: 'var(--primary)' }} /> {offer.district}</span>
                          <span><i className="fa fa-envelope" /> {offer.farmerEmail}</span>
                          {offer.quantity > 0 && <span>🧮 Qty: {offer.quantity}</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
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
        .category-scroll-container::-webkit-scrollbar { display: none; }
        @media (max-width: 576px) {
          .mobile-grid .col-6 { padding: 0 8px; }
          .featured__item__text h6 { height: 35px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        }
      `}</style>
    </>
  );
};

export default Marketplace;
