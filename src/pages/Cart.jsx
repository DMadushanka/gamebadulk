import React from 'react';
import { Link } from 'react-router-dom';
import breadcrumbImg from '../img/breadcrumb.jpg';
import feature1 from '../img/featured/feature-1.jpg';

const Cart = ({ cart, removeFromCart, updateCartQuantity }) => {
  const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  const delivery = subtotal > 0 ? 350 : 0; // Flat delivery fee if not empty
  const total = subtotal + delivery;

  const handleWhatsAppCheckout = () => {
    let message = "Hi Gamebadu, I'd like to order:\n\n";
    cart.forEach(item => {
      message += `• ${item.name} (${item.quantity} ${item.unit || 'kg'}) - Rs. ${Number(item.price) * item.quantity}\n`;
    });
    message += `\nSubtotal: Rs. ${subtotal}\nDelivery: Rs. ${delivery}\nTotal: Rs. ${total}\n\nPlease confirm my order!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/94770000000?text=${encoded}`, '_blank');
  };

  return (
    <div style={{ background: '#fdfdfd', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{
        backgroundImage: `url(${breadcrumbImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '60px 0',
        position: 'relative',
        animation: 'fadeIn 0.8s ease'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontFamily: 'Outfit', fontWeight: 800, fontSize: '36px', marginBottom: '5px' }}>
            Shopping Cart
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>
            <Link to="/" style={{ color: 'var(--primary)' }}>Home</Link> &nbsp;/&nbsp; Cart
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 15px' }}>
        {cart.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 0',
            animation: 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)' 
          }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🛒</div>
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#333' }}>Your cart is empty</h3>
            <p style={{ color: '#666', marginBottom: '30px' }}>Looks like you haven't added anything yet.</p>
            <Link to="/marketplace" className="primary-btn" style={{ textDecoration: 'none' }}>
              Back to Marketplace
            </Link>
          </div>
        ) : (
          <div className="row" style={{ animation: 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            {/* Cart Items List */}
            <div className="col-lg-8">
              <div style={{ 
                background: '#fff', 
                borderRadius: '24px', 
                padding: '30px', 
                boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                border: '1px solid #f0f0f0'
              }}>
                <h4 style={{ 
                  fontFamily: 'Outfit', 
                  fontWeight: 800, 
                  marginBottom: '25px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px' 
                }}>
                  Items List <span style={{ fontSize: '14px', fontWeight: 500, color: '#999' }}>({cart.length} Products)</span>
                </h4>

                {cart.map((item, index) => (
                  <div key={item.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '20px 0', 
                    borderBottom: index === cart.length - 1 ? 'none' : '1px solid #f5f5f5',
                    transition: 'transform 0.3s ease',
                    animation: `itemFadeIn 0.5s ease ${index * 0.1}s backwards`
                  }}>
                    {/* Item Image */}
                    <Link to={`/marketplace?search=${item.name}`} style={{ width: '100px', height: '100px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={item.imageUrl || feature1} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Link>

                    {/* Item Info */}
                    <div style={{ flex: 1, paddingLeft: '20px' }}>
                      <h5 style={{ fontWeight: 700, margin: '0 0 5px 0', fontSize: '18px' }}>
                        <Link to={`/marketplace?search=${item.name}`} style={{ color: '#333', textDecoration: 'none' }}>
                            {item.name}
                        </Link>
                      </h5>
                      <span style={{ color: '#999', fontSize: '13px' }}>{item.category || 'Fresh Produce'}</span>
                      <div style={{ fontWeight: 800, color: 'var(--primary)', marginTop: '8px', fontSize: '16px' }}>
                        Rs. {Number(item.price).toLocaleString()} <span style={{ fontWeight: 400, color: '#999', fontSize: '12px' }}>/ {item.unit || 'kg'}</span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      background: '#f8f9fa', 
                      borderRadius: '50px', 
                      padding: '5px' 
                    }}>
                      <button 
                        onClick={() => updateCartQuantity(item.id, -1)}
                        style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >-</button>
                      <span style={{ width: '40px', textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
                      <button 
                         onClick={() => updateCartQuantity(item.id, 1)}
                         style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >+</button>
                    </div>

                    {/* Item Total */}
                    <div style={{ width: '120px', textAlign: 'right', fontWeight: 800, fontSize: '17px', color: '#222' }}>
                      Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                    </div>

                    {/* Remove button */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      style={{ 
                        marginLeft: '15px', 
                        background: 'none', 
                        border: 'none', 
                        color: '#ff4d4f', 
                        opacity: 0.6, 
                        cursor: 'pointer', 
                        fontSize: '18px',
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
                    >
                      <i className="fa fa-trash-o"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="col-lg-4">
              <div style={{ 
                background: '#fff', 
                borderRadius: '24px', 
                padding: '30px', 
                boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                border: '1px solid #f0f0f0',
                position: 'sticky',
                top: '110px'
              }}>
                <h4 style={{ fontFamily: 'Outfit', fontWeight: 800, marginBottom: '25px' }}>Order Summary</h4>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#666' }}>
                  <span>Items Subtotal</span>
                  <span style={{ fontWeight: 600, color: '#333' }}>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', color: '#666' }}>
                  <span>Delivery Estimate</span>
                  <span style={{ fontWeight: 600, color: '#333' }}>Rs. {delivery.toLocaleString()}</span>
                </div>

                <div style={{ borderTop: '2px dashed #eee', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <span style={{ fontWeight: 800, fontSize: '18px' }}>Total Amount</span>
                  <span style={{ fontWeight: 900, fontSize: '22px', color: 'var(--primary)' }}>
                    Rs. {total.toLocaleString()}
                  </span>
                </div>

                <button 
                  onClick={handleWhatsAppCheckout}
                  style={{ 
                    width: '100%', 
                    background: 'linear-gradient(135deg, var(--primary) 0%, #43a047 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '18px',
                    fontWeight: 800,
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px rgba(46,125,50,0.3)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(46,125,50,0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(46,125,50,0.3)';
                  }}
                >
                  <i className="fa fa-whatsapp" style={{ fontSize: '20px' }}></i> Checkout via WhatsApp
                </button>

                <p style={{ 
                  textAlign: 'center', 
                  fontSize: '12px', 
                  color: '#999', 
                  marginTop: '15px',
                  lineHeight: 1.5
                }}>
                  Security Note: We use Direct-to-Farmer logistics. One of our transport partners will contact you once the farmer confirms the stock.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(40px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes itemFadeIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .primary-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(46,125,50,0.2);
        }
      `}</style>
    </div>
  );
};

export default Cart;
