import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { Link } from 'react-router-dom';
import {
  collection, query, onSnapshot,
  doc, updateDoc,
} from 'firebase/firestore';
import feature1 from '../img/featured/feature-1.jpg';

const STATUS = {
  pending:  { bg: '#FFF8E1', color: '#F57F17', icon: '⏳', label: 'Pending' },
  approved: { bg: '#E8F5E9', color: '#1B5E20', icon: '✅', label: 'Approved' },
  rejected: { bg: '#FFEBEE', color: '#B71C1C', icon: '❌', label: 'Rejected' },
};

const TABS = [
  { key: 'pending',  label: 'Pending Review', icon: '⏳' },
  { key: 'approved', label: 'Approved',        icon: '✅' },
  { key: 'rejected', label: 'Rejected',        icon: '❌' },
  { key: 'all',      label: 'All Products',    icon: '📦' },
];

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // product id being updated
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    // Simple collection fetch — sorted client-side to avoid Firestore index requirement
    const q = query(collection(db, 'products'));
    return onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort newest first using the serverTimestamp (falls back to 0 if missing)
      prods.sort((a, b) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return bTime - aTime;
      });
      setProducts(prods);
    }, (err) => console.error('AdminDashboard Firestore error:', err));
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleStatus = async (id, newStatus) => {
    setActionLoading(id);
    try {
      await updateDoc(doc(db, 'products', id), { status: newStatus, reviewedBy: user?.email, reviewedAt: new Date() });
      showToast(`Product ${newStatus} successfully!`, newStatus === 'approved' ? 'success' : 'error');
      if (selectedProduct?.id === id) setSelectedProduct(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error(err);
      showToast('Failed to update status.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const visible = products.filter(p => {
    const matchesTab = activeTab === 'all' || p.status === activeTab;
    const matchesSearch = !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.district?.toLowerCase().includes(search.toLowerCase()) ||
      p.farmerEmail?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    pending:  products.filter(p => p.status === 'pending').length,
    approved: products.filter(p => p.status === 'approved').length,
    rejected: products.filter(p => p.status === 'rejected').length,
    all:      products.length,
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #0f1923 0%, #1a2332 100%)', minHeight: '100vh', paddingBottom: '60px' }}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          background: toast.type === 'success' ? '#1B5E20' : '#B71C1C',
          color: '#fff', padding: '14px 22px', borderRadius: '14px',
          fontWeight: 600, fontSize: '14px', boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          animation: 'slideIn 0.3s ease',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ fontSize: '20px' }}>{toast.type === 'success' ? '✅' : '❌'}</span>
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0d47a1 0%, #1565C0 50%, #1976D2 100%)',
        padding: '35px 0 0', position: 'relative', overflow: 'hidden',
      }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${80 + i * 50}px`, height: `${80 + i * 50}px`,
            borderRadius: '50%', border: '1px solid rgba(255,255,255,0.07)',
            top: `${-20 + i * 8}px`, left: `${50 + i * 120}px`,
          }} />
        ))}

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '15px', fontWeight: 600, fontSize: '13px' }}>
            <i className="fa fa-arrow-left"></i> Back to Home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.15)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '26px',
              backdropFilter: 'blur(10px)', border: '1.5px solid rgba(255,255,255,0.25)',
            }}>🛡️</div>
            <div>
              <h2 style={{ color: '#fff', fontFamily: 'Outfit', fontWeight: 800, fontSize: '26px', margin: 0 }}>
                Admin Control Panel
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', margin: 0, fontSize: '13px' }}>
                {user?.email} &nbsp;·&nbsp; Product Moderation & Marketplace Management
              </p>
            </div>

            {/* Stat Pills */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { label: 'Total', value: counts.all, color: '#90CAF9' },
                { label: 'Pending', value: counts.pending, color: '#FFE082' },
                { label: 'Live', value: counts.approved, color: '#A5D6A7' },
                { label: 'Rejected', value: counts.rejected, color: '#EF9A9A' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginTop: '30px', overflowX: 'auto', paddingBottom: '0' }}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '11px 22px', border: 'none', cursor: 'pointer',
                  background: activeTab === tab.key ? '#fff' : 'rgba(255,255,255,0.1)',
                  color: activeTab === tab.key ? '#0d47a1' : 'rgba(255,255,255,0.8)',
                  fontWeight: 700, fontSize: '13px', borderRadius: '12px 12px 0 0',
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {tab.icon} {tab.label}
                {counts[tab.key] > 0 && (
                  <span style={{
                    background: activeTab === tab.key ? '#0d47a1' : 'rgba(255,255,255,0.25)',
                    color: activeTab === tab.key ? '#fff' : '#fff',
                    borderRadius: '50px', padding: '1px 8px',
                    fontSize: '11px', marginLeft: '8px', fontWeight: 800,
                  }}>
                    {counts[tab.key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container" style={{ marginTop: '0' }}>
        <div style={{
          background: '#fff', borderRadius: '0 16px 16px 16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden', minHeight: '500px',
        }}>

          {/* Search bar */}
          <div style={{ padding: '20px 25px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
            <div style={{ position: 'relative', maxWidth: '400px' }}>
              <i className="fa fa-search" style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', color: '#bbb',
              }} />
              <input
                type="text"
                placeholder="Search by product, district, farmer email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '10px 16px 10px 38px',
                  border: '2px solid #eee', borderRadius: '10px',
                  fontSize: '14px', outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#1565C0'}
                onBlur={e => e.target.style.borderColor = '#eee'}
              />
            </div>
          </div>

          {/* Product List */}
          {visible.length === 0 ? (
            <div style={{ padding: '80px 40px', textAlign: 'center', color: '#aaa' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>
                {activeTab === 'pending' ? '🎉' : '📭'}
              </div>
              <h4 style={{ color: '#555', fontWeight: 700 }}>
                {activeTab === 'pending' ? 'All clear! No pending reviews.' : 'No products here yet.'}
              </h4>
              <p style={{ fontSize: '14px' }}>
                {activeTab === 'pending' ? 'Farmers\' submissions will appear here for your approval.' : 'Switch to a different tab to see products.'}
              </p>
            </div>
          ) : (
            <div style={{ padding: '0' }}>
              {visible.map((p, i) => {
                const sc = STATUS[p.status] || STATUS.pending;
                const isLoading = actionLoading === p.id;
                return (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex', alignItems: 'stretch',
                      borderBottom: '1px solid #f5f5f5',
                      background: selectedProduct?.id === p.id ? '#EFF7FF' : '#fff',
                      transition: 'background 0.2s',
                      animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
                    }}
                  >
                    {/* Product Image */}
                    <div style={{ width: '100px', minHeight: '90px', flexShrink: 0, overflow: 'hidden' }}>
                      <img
                        src={p.imageUrl || feature1}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, padding: '14px 18px', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '15px', color: '#222' }}>{p.name}</span>
                        <span style={{
                          background: sc.bg, color: sc.color,
                          padding: '2px 10px', borderRadius: '50px',
                          fontSize: '11px', fontWeight: 700,
                        }}>
                          {sc.icon} {sc.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#777', flexWrap: 'wrap' }}>
                        <span><strong style={{ color: '#2E7D32' }}>Rs. {Number(p.price).toLocaleString()}</strong> /{p.unit || 'kg'}</span>
                        <span><i className="fa fa-map-marker" style={{ color: '#1565C0', marginRight: 4 }} />{p.district}</span>
                        <span><i className="fa fa-tag" style={{ marginRight: 4 }} />{p.category}</span>
                        {p.farmerEmail && (
                          <span><i className="fa fa-user" style={{ marginRight: 4 }} />{p.farmerEmail}</span>
                        )}
                      </div>
                      {p.description && (
                        <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#999', lineHeight: 1.5 }}>
                          {p.description.length > 120 ? p.description.slice(0, 120) + '...' : p.description}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex', flexDirection: 'column', gap: '8px',
                      padding: '14px 16px', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {/* View Details Button */}
                      <button
                        onClick={() => setSelectedProduct(selectedProduct?.id === p.id ? null : p)}
                        style={{
                          padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #ddd',
                          background: selectedProduct?.id === p.id ? '#EFF7FF' : '#fff',
                          color: '#555', fontWeight: 600, fontSize: '12px', cursor: 'pointer',
                          transition: 'all 0.2s', whiteSpace: 'nowrap',
                        }}
                      >
                        <i className="fa fa-eye" style={{ marginRight: 5 }} />
                        {selectedProduct?.id === p.id ? 'Close' : 'Preview'}
                      </button>

                      {p.status !== 'approved' && (
                        <button
                          disabled={isLoading}
                          onClick={() => handleStatus(p.id, 'approved')}
                          style={{
                            padding: '7px 14px', borderRadius: '8px', border: 'none',
                            background: isLoading ? '#ccc' : 'linear-gradient(135deg, #1B5E20, #2E7D32)',
                            color: '#fff', fontWeight: 700, fontSize: '12px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s', whiteSpace: 'nowrap',
                          }}
                        >
                          {isLoading ? '⏳' : '✅ Approve'}
                        </button>
                      )}

                      {p.status !== 'rejected' && (
                        <button
                          disabled={isLoading}
                          onClick={() => handleStatus(p.id, 'rejected')}
                          style={{
                            padding: '7px 14px', borderRadius: '8px', border: 'none',
                            background: isLoading ? '#ccc' : 'linear-gradient(135deg, #B71C1C, #C62828)',
                            color: '#fff', fontWeight: 700, fontSize: '12px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s', whiteSpace: 'nowrap',
                          }}
                        >
                          {isLoading ? '⏳' : '❌ Reject'}
                        </button>
                      )}

                      {p.status !== 'pending' && (
                        <button
                          disabled={isLoading}
                          onClick={() => handleStatus(p.id, 'pending')}
                          style={{
                            padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #FFE082',
                            background: '#FFF8E1', color: '#795548', fontWeight: 600, fontSize: '12px',
                            cursor: isLoading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
                          }}
                        >
                          ↩ Reset
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Product Detail Preview Panel ── */}
        {selectedProduct && (
          <div style={{
            marginTop: '24px', background: '#fff', borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)', overflow: 'hidden',
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ background: 'linear-gradient(135deg, #263238, #37474F)', padding: '18px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
                👁️ Product Preview — How it appears in Marketplace
              </h5>
              <button onClick={() => setSelectedProduct(null)} style={{
                background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
                width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px',
              }}>✕</button>
            </div>

            <div style={{ padding: '30px', display: 'flex', gap: '30px', flexWrap: 'wrap', background: '#f8f9fa' }}>
              {/* Simulated Marketplace Card */}
              <div style={{
                background: '#fff', borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '260px', flexShrink: 0,
              }}>
                <div style={{ height: '200px', overflow: 'hidden', background: '#f0f0f0' }}>
                  <img
                    src={selectedProduct.imageUrl || feature1}
                    alt={selectedProduct.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '16px' }}>
                  <h6 style={{ fontWeight: 700, marginBottom: '4px' }}>{selectedProduct.name}</h6>
                  {selectedProduct.description && (
                    <p style={{ fontSize: '12px', color: '#888', marginBottom: '10px', lineHeight: 1.5 }}>
                      {selectedProduct.description}
                    </p>
                  )}
                  <div style={{ fontWeight: 800, fontSize: '18px', color: '#2E7D32' }}>
                    Rs. {Number(selectedProduct.price).toLocaleString()}
                    <span style={{ fontWeight: 400, fontSize: '12px', color: '#aaa' }}> /{selectedProduct.unit || 'kg'}</span>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
                    <i className="fa fa-map-marker" style={{ color: '#2E7D32', marginRight: 4 }} />
                    {selectedProduct.district}, Sri Lanka
                  </div>
                  {selectedProduct.phone && (
                    <div style={{ marginTop: '5px', fontSize: '12px', color: '#888' }}>
                      <i className="fa fa-phone" style={{ marginRight: 4 }} />
                      {selectedProduct.phone}
                    </div>
                  )}
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <a href={`https://wa.me/${(selectedProduct.phone || '').replace(/\D/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{
                        flex: 1, background: '#25D366', color: '#fff', padding: '8px',
                        borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: 600,
                      }}>
                      <i className="fa fa-whatsapp" /> WhatsApp
                    </a>
                    <a href={`tel:${selectedProduct.phone}`}
                      style={{
                        flex: 1, background: '#1565C0', color: '#fff', padding: '8px',
                        borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: 600,
                      }}>
                      <i className="fa fa-phone" /> Call
                    </a>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div style={{ flex: 1, minWidth: '220px' }}>
                <h6 style={{ fontWeight: 700, marginBottom: '16px', color: '#333' }}>📋 Submission Details</h6>
                {[
                  { label: 'Product ID', value: selectedProduct.id, mono: true },
                  { label: 'Farmer Email', value: selectedProduct.farmerEmail || '-' },
                  { label: 'Farmer UID', value: selectedProduct.farmerId, mono: true },
                  { label: 'Category', value: selectedProduct.category },
                  { label: 'District', value: selectedProduct.district },
                  { label: 'Quantity', value: `${selectedProduct.quantity || '—'} ${selectedProduct.unit || 'kg'}` },
                  { label: 'Current Status', value: `${STATUS[selectedProduct.status]?.icon} ${STATUS[selectedProduct.status]?.label}` },
                  { label: 'Submitted', value: selectedProduct.createdAt?.toDate ? selectedProduct.createdAt.toDate().toLocaleString() : 'Unknown' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', marginBottom: '10px', fontSize: '13px' }}>
                    <span style={{ width: '130px', flexShrink: 0, color: '#999', fontWeight: 600 }}>{row.label}</span>
                    <span style={{
                      color: '#333', fontFamily: row.mono ? 'monospace' : 'inherit',
                      fontSize: row.mono ? '11px' : '13px', wordBreak: 'break-all',
                    }}>
                      {row.value}
                    </span>
                  </div>
                ))}

                {/* Quick actions in detail pane */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                  {selectedProduct.status !== 'approved' && (
                    <button
                      onClick={() => handleStatus(selectedProduct.id, 'approved')}
                      style={{
                        padding: '11px 24px', borderRadius: '10px', border: 'none',
                        background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
                        color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(46,125,50,0.35)',
                      }}
                    >
                      ✅ Approve & Publish
                    </button>
                  )}
                  {selectedProduct.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatus(selectedProduct.id, 'rejected')}
                      style={{
                        padding: '11px 24px', borderRadius: '10px', border: 'none',
                        background: 'linear-gradient(135deg, #B71C1C, #C62828)',
                        color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(183,28,28,0.35)',
                      }}
                    >
                      ❌ Reject Listing
                    </button>
                  )}
                </div>

                {selectedProduct.status === 'approved' && (
                  <div style={{
                    marginTop: '16px', background: '#E8F5E9', border: '1px solid #A5D6A7',
                    borderRadius: '12px', padding: '14px 18px', fontSize: '13px', color: '#1B5E20',
                  }}>
                    🌐 <strong>Live on Marketplace!</strong> This product is currently visible to all buyers
                    on the homepage and marketplace pages.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
