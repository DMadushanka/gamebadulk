import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import feature1 from '../img/featured/feature-1.jpg';

const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dkjay4gzf';
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'gamebadu';

const DISTRICTS = [
  'Matale', 'Kandy', 'Kurunegala', 'Kegalle', 'Colombo', 'Gampaha',
  'Kalutara', 'Galle', 'Matara', 'Hambantota', 'Ratnapura',
  'Nuwara Eliya', 'Badulla', 'Monaragala', 'Polonnaruwa',
  'Anuradhapura', 'Trincomalee', 'Batticaloa', 'Ampara', 'Jaffna',
];

const CATEGORIES = [
  { value: 'Fresh Greens', label: '🌿 Fresh Greens', color: '#00695C' },
  { value: 'Seasonal Staples', label: '🌾 Seasonal Staples', color: '#F9A825' },
  { value: 'Local Fruits', label: '🍍 Local Fruits', color: '#6A1B9A' },
  { value: 'Pure Spices', label: '🌶 Pure Spices', color: '#C62828' },
  { value: 'Traditional Staples', label: '🥕 Traditional Staples', color: '#E65100' },
];

const STATUS_CONFIG = {
  pending:  { bg: '#FFF8E1', color: '#F57F17', label: '⏳ Pending Review' },
  approved: { bg: '#E8F5E9', color: '#1B5E20', label: '✅ Approved' },
  rejected: { bg: '#FFEBEE', color: '#B71C1C', label: '❌ Rejected' },
};

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: '12px',
  border: '2px solid #eee', fontSize: '14px', outline: 'none',
  transition: 'border-color 0.3s, box-shadow 0.3s', background: '#fff',
  fontFamily: 'inherit',
};

const labelStyle = {
  display: 'block', fontWeight: 600, fontSize: '13px',
  marginBottom: '7px', color: '#444',
};

const FarmerDashboard = () => {
  const [formData, setFormData] = useState({
    name: '', price: '', district: 'Matale',
    category: 'Pure Spices', description: '', unit: 'kg', quantity: '',
    phone: '',
  });
  const [myProducts, setMyProducts] = useState([]);
  const [existingProducts, setExistingProducts] = useState([]);
  const [productSelection, setProductSelection] = useState('new');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'products'
  const fileInputRef = useRef(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const q1 = query(collection(db, 'products'), where('farmerId', '==', user.uid));
    const unsub1 = onSnapshot(q1, (snapshot) => {
      setMyProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const q2 = query(collection(db, 'products'), where('status', '==', 'approved'));
    const unsub2 = onSnapshot(q2, (snapshot) => {
      const uniqueProds = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.name) uniqueProds[data.name.toLowerCase().trim()] = data;
      });
      setExistingProducts(Object.values(uniqueProds));
    });

    return () => { unsub1(); unsub2(); };
  }, [user]);

  const handleSelectionChange = (e) => {
    const val = e.target.value;
    setProductSelection(val);
    if (val === 'new') {
      setFormData({ ...formData, name: '', description: '', category: 'Pure Spices' });
      setImagePreview(null);
      setImageFile(null);
    } else {
      const selected = existingProducts.find(p => p.name === val);
      if (selected) {
        setFormData({ ...formData, name: selected.name, description: selected.description || '', category: selected.category || 'Pure Spices' });
        setImagePreview(selected.imageUrl || null);
        setImageFile(null);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('Please select an image file.');
    if (file.size > 5 * 1024 * 1024) return alert('Image must be under 5MB.');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setUploading(true);

    try {
      let imageUrl = null;

      if (imageFile) {
        const cloudData = new FormData();
        cloudData.append('file', imageFile);
        cloudData.append('upload_preset', CLOUDINARY_PRESET);
        cloudData.append('folder', `gamebadu/products/${user.uid}`);

        // Simulate progress during the upload
        setUploadProgress(10);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
          { method: 'POST', body: cloudData }
        );
        setUploadProgress(80);
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        imageUrl = data.secure_url;
        setUploadProgress(100);
      } else if (productSelection !== 'new' && imagePreview) {
        imageUrl = imagePreview; // Reusing existing product's generic image
      }

      await addDoc(collection(db, 'products'), {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseFloat(formData.quantity) || 0,
        farmerId: user.uid,
        farmerEmail: user.email,
        imageUrl,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setFormData({ name: '', price: '', district: 'Matale', category: 'Pure Spices', description: '', unit: 'kg', quantity: '', phone: '' });
      setImageFile(null);
      setImagePreview(null);
      setProductSelection('new');
      setUploadProgress(0);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Error submitting product. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const catColor = CATEGORIES.find(c => c.value === formData.category)?.color || '#2E7D32';

  return (
    <div style={{ background: 'linear-gradient(135deg, #f0f4f0 0%, #e8f5e9 100%)', minHeight: '100vh', padding: '0 0 60px' }}>

      {/* ── Header Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)',
        padding: '40px 0 30px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${120 + i * 60}px`, height: `${120 + i * 60}px`,
            borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)',
            top: `${-30 + i * 10}px`, right: `${100 + i * 80}px`,
            animation: `spin ${8 + i * 4}s linear infinite`,
          }} />
        ))}
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontWeight: 600, fontSize: '13px' }}>
            <i className="fa fa-arrow-left"></i> Back to Home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '28px',
              backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)',
            }}>
              🌾
            </div>
            <div>
              <h2 style={{ color: '#fff', fontFamily: 'Outfit', fontWeight: 800, fontSize: '28px', margin: 0 }}>
                Farmer Portal
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: '14px' }}>
                {user?.email} &nbsp;·&nbsp; List your produce, reach buyers directly
              </p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
              <div style={{ textAlign: 'center', color: '#fff' }}>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>{myProducts.length}</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>Listed</div>
              </div>
              <div style={{ textAlign: 'center', color: '#fff' }}>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>
                  {myProducts.filter(p => p.status === 'approved').length}
                </div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>Live</div>
              </div>
              <div style={{ textAlign: 'center', color: '#fff' }}>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>
                  {myProducts.filter(p => p.status === 'pending').length}
                </div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>Pending</div>
              </div>
            </div>
          </div>

          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '28px' }}>
            {[
              { key: 'form', label: '➕ Add New Product' },
              { key: 'products', label: `📦 My Products (${myProducts.length})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                padding: '10px 22px', borderRadius: '50px', border: 'none',
                background: activeTab === tab.key ? '#fff' : 'rgba(255,255,255,0.15)',
                color: activeTab === tab.key ? '#1B5E20' : '#fff',
                fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                transition: 'all 0.3s', backdropFilter: 'blur(10px)',
              }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '35px' }}>

        {/* ── TAB: ADD PRODUCT ── */}
        {activeTab === 'form' && (
          <div className="row" style={{ gap: '0' }}>

            {/* ─ LEFT: Form ─ */}
            <div className="col-lg-6 mb-4">
              <div style={{
                background: '#fff', borderRadius: '24px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                overflow: 'hidden',
              }}>
                <div style={{ background: 'linear-gradient(135deg, #2E7D32, #43A047)', padding: '20px 30px' }}>
                  <h5 style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
                    📝 Product Details
                  </h5>
                  <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '13px', marginTop: '4px' }}>
                    Fill in the form — preview updates live on the right
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '30px' }}>

                  {/* Select Existing Product */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={labelStyle}>Product Catalog</label>
                    <select
                      value={productSelection}
                      onChange={handleSelectionChange}
                      style={{ ...inputStyle, background: '#f5fbff', borderColor: '#90CAF9' }}
                    >
                      <option value="new">✨ + Create Completely New Product</option>
                      {existingProducts.map((p, i) => (
                        <option key={i} value={p.name}>📦 Sell Existing: {p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Image Upload */}
                  {productSelection === 'new' && (
                  <div style={{ marginBottom: '22px' }}>
                    <label style={labelStyle}>Product Image</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={e => e.preventDefault()}
                      style={{
                        border: `2px dashed ${imagePreview ? '#2E7D32' : '#ddd'}`,
                        borderRadius: '16px', padding: '20px',
                        textAlign: 'center', cursor: 'pointer',
                        background: imagePreview ? '#f1f8f1' : '#fafafa',
                        transition: 'all 0.3s',
                        position: 'relative', overflow: 'hidden',
                      }}
                    >
                      {imagePreview ? (
                        <div style={{ position: 'relative' }}>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px' }}
                          />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                            style={{
                              position: 'absolute', top: '8px', right: '8px',
                              background: 'rgba(0,0,0,0.6)', color: '#fff',
                              border: 'none', borderRadius: '50%', width: '28px', height: '28px',
                              cursor: 'pointer', fontSize: '14px', display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                            }}
                          >✕</button>
                        </div>
                      ) : (
                        <>
                          <div style={{ fontSize: '36px', marginBottom: '8px' }}>📷</div>
                          <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>
                            Click to upload or drag & drop
                          </p>
                          <p style={{ margin: '4px 0 0', color: '#bbb', fontSize: '12px' }}>
                            PNG, JPG up to 5MB
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                  )}

                  {/* Product Name */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={labelStyle}>Product Name *</label>
                    <input
                      type="text" required placeholder="e.g. Premium Black Pepper"
                      value={formData.name}
                      readOnly={productSelection !== 'new'}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      style={{ ...inputStyle, background: productSelection !== 'new' ? '#f5f5f5' : '#fff' }}
                      onFocus={e => { if (productSelection==='new') {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 3px rgba(46,125,50,0.12)';} }}
                      onBlur={e => { if (productSelection==='new') {e.target.style.borderColor = '#eee'; e.target.style.boxShadow = 'none';} }}
                    />
                  </div>

                  {/* Description */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={labelStyle}>Short Description</label>
                    <textarea
                      rows={3} placeholder="Describe your product — freshness, origin, qualities..."
                      value={formData.description}
                      readOnly={productSelection !== 'new'}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      style={{ ...inputStyle, resize: 'vertical', background: productSelection !== 'new' ? '#f5f5f5' : '#fff' }}
                      onFocus={e => { if (productSelection==='new') {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 3px rgba(46,125,50,0.12)';} }}
                      onBlur={e => { if (productSelection==='new') {e.target.style.borderColor = '#eee'; e.target.style.boxShadow = 'none';} }}
                    />
                  </div>

                  {/* Price + Unit + Quantity */}
                  <div className="row" style={{ marginBottom: '18px' }}>
                    <div className="col-5">
                      <label style={labelStyle}>Price (Rs.) *</label>
                      <input
                        type="number" required min="0" placeholder="2500"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 3px rgba(46,125,50,0.12)'; }}
                        onBlur={e => { e.target.style.borderColor = '#eee'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div className="col-3">
                      <label style={labelStyle}>Unit</label>
                      <select
                        value={formData.unit}
                        onChange={e => setFormData({ ...formData, unit: e.target.value })}
                        style={inputStyle}
                      >
                        {['kg', 'g', 'liter', 'piece', 'bunch', 'bag'].map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-4">
                      <label style={labelStyle}>Quantity</label>
                      <input
                        type="number" min="0" placeholder="50"
                        value={formData.quantity}
                        onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 3px rgba(46,125,50,0.12)'; }}
                        onBlur={e => { e.target.style.borderColor = '#eee'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div style={{ marginBottom: '18px', opacity: productSelection !== 'new' ? 0.6 : 1, pointerEvents: productSelection !== 'new' ? 'none' : 'auto' }}>
                    <label style={labelStyle}>Category *</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat.value })}
                          style={{
                            padding: '7px 14px', borderRadius: '50px', border: '2px solid',
                            borderColor: formData.category === cat.value ? cat.color : '#eee',
                            background: formData.category === cat.value ? `${cat.color}18` : '#fff',
                            color: formData.category === cat.value ? cat.color : '#666',
                            fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* District + Phone */}
                  <div className="row" style={{ marginBottom: '18px' }}>
                    <div className="col-6">
                      <label style={labelStyle}>District *</label>
                      <select
                        value={formData.district}
                        onChange={e => setFormData({ ...formData, district: e.target.value })}
                        style={inputStyle}
                      >
                        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="col-6">
                      <label style={labelStyle}>Contact Phone</label>
                      <input
                        type="tel" placeholder="+94 77 000 0000"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 3px rgba(46,125,50,0.12)'; }}
                        onBlur={e => { e.target.style.borderColor = '#eee'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {uploading && (
                    <div style={{ marginBottom: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', color: '#555' }}>
                        <span>Uploading image...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div style={{ background: '#eee', borderRadius: '50px', height: '8px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: '50px',
                          background: 'linear-gradient(90deg, #2E7D32, #66BB6A)',
                          width: `${uploadProgress}%`, transition: 'width 0.3s',
                        }} />
                      </div>
                    </div>
                  )}

                  {/* Success message */}
                  {submitted && (
                    <div style={{
                      background: '#E8F5E9', border: '1px solid #A5D6A7',
                      borderRadius: '12px', padding: '14px 18px',
                      display: 'flex', alignItems: 'center', gap: '10px',
                      marginBottom: '18px', animation: 'fadeIn 0.3s ease',
                    }}>
                      <span style={{ fontSize: '22px' }}>✅</span>
                      <div>
                        <strong style={{ color: '#1B5E20', display: 'block', fontSize: '14px' }}>
                          Product submitted for review!
                        </strong>
                        <span style={{ color: '#388E3C', fontSize: '12px' }}>
                          Admin will approve it shortly.
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploading}
                    style={{
                      width: '100%', padding: '15px', borderRadius: '14px',
                      background: uploading
                        ? '#ccc'
                        : 'linear-gradient(135deg, #2E7D32, #43A047)',
                      color: '#fff', border: 'none', fontWeight: 700,
                      fontSize: '16px', cursor: uploading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s', letterSpacing: '0.5px',
                      boxShadow: uploading ? 'none' : '0 6px 20px rgba(46,125,50,0.35)',
                    }}
                    onMouseEnter={e => { if (!uploading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {uploading ? `⏳ Uploading... ${uploadProgress}%` : '🚀 Submit for Review'}
                  </button>
                </form>
              </div>
            </div>

            {/* ─ RIGHT: Live Preview ─ */}
            <div className="col-lg-6 mb-4" style={{ paddingLeft: '20px' }}>
              <div style={{ position: 'sticky', top: '20px' }}>
                <div style={{
                  background: '#fff', borderRadius: '24px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)', overflow: 'hidden',
                }}>
                  <div style={{ background: 'linear-gradient(135deg, #263238, #37474F)', padding: '20px 30px' }}>
                    <h5 style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
                      👁️ Live Preview
                    </h5>
                    <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '13px', marginTop: '4px' }}>
                      This is how buyers will see your product
                    </p>
                  </div>

                  {/* Simulated website card */}
                  <div style={{ padding: '30px', background: '#f8f9fa' }}>
                    <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                      Featured Produce Section
                    </p>

                    {/* Marketplace Card Preview */}
                    <div style={{
                      background: '#fff', borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      overflow: 'hidden', maxWidth: '280px', margin: '0 auto',
                      transition: 'transform 0.3s',
                    }}>
                      {/* Product Image */}
                      <div style={{
                        height: '200px', position: 'relative', overflow: 'hidden',
                        background: imagePreview ? 'transparent' : '#f0f0f0',
                      }}>
                        <img
                          src={imagePreview || feature1}
                          alt="Product"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.4s' }}
                        />
                        {/* Hover overlay */}
                        <div style={{
                          position: 'absolute', bottom: '10px', right: '10px',
                          display: 'flex', gap: '8px',
                        }}>
                          <div style={{
                            background: '#25D366', color: '#fff',
                            width: '36px', height: '36px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '18px', boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                          }}>
                            <i className="fa fa-whatsapp" />
                          </div>
                          <div style={{
                            background: '#1565C0', color: '#fff',
                            width: '36px', height: '36px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '16px', boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                          }}>
                            <i className="fa fa-phone" />
                          </div>
                        </div>
                        {/* Category Badge */}
                        <div style={{
                          position: 'absolute', top: '10px', left: '10px',
                          background: catColor, color: '#fff',
                          padding: '4px 10px', borderRadius: '50px',
                          fontSize: '11px', fontWeight: 700,
                        }}>
                          {CATEGORIES.find(c => c.value === formData.category)?.label}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div style={{ padding: '18px' }}>
                        <h6 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px', color: '#222' }}>
                          {formData.name || <span style={{ color: '#bbb' }}>Product name will appear here</span>}
                        </h6>

                        {formData.description && (
                          <p style={{ fontSize: '12px', color: '#888', marginBottom: '10px', lineHeight: 1.5 }}>
                            {formData.description.length > 80
                              ? formData.description.slice(0, 80) + '...'
                              : formData.description}
                          </p>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontWeight: 800, fontSize: '18px', color: '#2E7D32' }}>
                              {formData.price ? `Rs. ${Number(formData.price).toLocaleString()}` : 'Rs. —'}
                            </span>
                            <span style={{ fontSize: '12px', color: '#999', marginLeft: '4px' }}>
                              /{formData.unit}
                            </span>
                          </div>
                          {formData.quantity && (
                            <span style={{ fontSize: '11px', color: '#aaa' }}>
                              Qty: {formData.quantity} {formData.unit}
                            </span>
                          )}
                        </div>

                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <i className="fa fa-map-marker" style={{ color: catColor, fontSize: '12px' }} />
                          <span style={{ fontSize: '12px', color: '#666' }}>
                            {formData.district}, Sri Lanka
                          </span>
                        </div>
                        {formData.phone && (
                          <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <i className="fa fa-phone" style={{ color: '#888', fontSize: '11px' }} />
                            <span style={{ fontSize: '12px', color: '#666' }}>{formData.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Admin notice */}
                    <div style={{
                      marginTop: '20px', background: '#FFF8E1',
                      border: '1px solid #FFE082', borderRadius: '12px',
                      padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start',
                    }}>
                      <span style={{ fontSize: '18px' }}>⚠️</span>
                      <p style={{ margin: 0, fontSize: '12px', color: '#795548', lineHeight: 1.5 }}>
                        Your listing will be reviewed by an Admin before going live on the marketplace.
                        Approval usually takes under 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: MY PRODUCTS ── */}
        {activeTab === 'products' && (
          <div>
            {myProducts.length === 0 ? (
              <div style={{
                background: '#fff', borderRadius: '24px', padding: '80px 40px',
                textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
              }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🌱</div>
                <h4 style={{ fontWeight: 700, color: '#333', marginBottom: '10px' }}>No Products Yet</h4>
                <p style={{ color: '#888', marginBottom: '25px' }}>
                  Start by adding your first product listing.
                </p>
                <button onClick={() => setActiveTab('form')} style={{
                  background: 'linear-gradient(135deg, #2E7D32, #43A047)',
                  color: '#fff', border: 'none', borderRadius: '50px',
                  padding: '12px 30px', fontWeight: 700, cursor: 'pointer', fontSize: '14px',
                }}>
                  ➕ Add First Product
                </button>
              </div>
            ) : (
              <div className="row">
                {myProducts.map((p, i) => {
                  const sc = STATUS_CONFIG[p.status] || STATUS_CONFIG.pending;
                  return (
                    <div className="col-lg-4 col-md-6 mb-4" key={p.id}>
                      <div style={{
                        background: '#fff', borderRadius: '20px',
                        boxShadow: '0 6px 25px rgba(0,0,0,0.07)', overflow: 'hidden',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        animation: `fadeIn 0.4s ease ${i * 0.08}s both`,
                      }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.12)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.07)'; }}
                      >
                        <div style={{ height: '160px', overflow: 'hidden', background: '#f5f5f5' }}>
                          <img
                            src={p.imageUrl || feature1}
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ padding: '18px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <h6 style={{ fontWeight: 700, margin: 0, fontSize: '15px', color: '#222' }}>{p.name}</h6>
                            <span style={{
                              background: sc.bg, color: sc.color,
                              padding: '3px 10px', borderRadius: '50px',
                              fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap',
                            }}>
                              {sc.label}
                            </span>
                          </div>
                          <p style={{ fontSize: '20px', fontWeight: 800, color: '#2E7D32', margin: '5px 0' }}>
                            Rs. {Number(p.price).toLocaleString()}
                            <span style={{ fontSize: '12px', color: '#aaa', fontWeight: 400 }}> /{p.unit || 'kg'}</span>
                          </p>
                          <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#888' }}>
                            <span><i className="fa fa-map-marker" style={{ marginRight: 4 }} />{p.district}</span>
                            <span><i className="fa fa-tag" style={{ marginRight: 4 }} />{p.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default FarmerDashboard;
