import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Custom Map Marker Icon
const farmerIcon = new L.DivIcon({
  html: `<div style="background: var(--primary); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">🧑‍🌾</div>`,
  className: 'custom-farmer-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const myLocationIcon = new L.DivIcon({
  html: `<div style="background: #1976D2; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">📍</div>`,
  className: 'custom-my-location-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const FarmersMapModal = ({ onClose }) => {
  const [farmers, setFarmers] = useState([]);
  const [myLocation, setMyLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Farmers
    const fetchFarmers = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'farmer'));
        const querySnapshot = await getDocs(q);
        const fetchedFarmers = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          let lat = data.locationLat;
          let lng = data.locationLng;

          // Legacy data fallback: Map older farmers near central farming districts for demonstration
          if (!lat || !lng) {
             // Generate a small pseudo-random offset based on ID so they don't stack
             const offset1 = (doc.id.charCodeAt(0) % 20) / 100;
             const offset2 = (doc.id.charCodeAt(1) % 20) / 100;
             lat = 7.3 + offset1; 
             lng = 80.5 + offset2;
          }

          fetchedFarmers.push({ id: doc.id, ...data, locationLat: lat, locationLng: lng });
        });
        setFarmers(fetchedFarmers);
      } catch (err) {
        console.error("Error fetching farmers:", err);
      }
    };

    fetchFarmers();

    // 2. Get User Location (Optional but helpful for "Nearby")
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMyLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        () => {
          setLoading(false); // Default to Sri Lanka center if denied
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  // Default to Sri Lanka center
  const centerLat = myLocation ? myLocation.lat : 7.8731;
  const centerLng = myLocation ? myLocation.lng : 80.7718;
  const initialZoom = myLocation ? 10 : 7;

  if (loading) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         <div style={{ background: '#fff', padding: '40px', borderRadius: '15px' }}>
            <h4>Loading Map...</h4>
         </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex',
      alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: '#fff', borderRadius: '24px', width: '90%', maxWidth: '900px',
        maxHeight: '90vh', overflow: 'hidden', position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'fadeIn 0.3s ease',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: '#f8f9fa', padding: '20px 30px', borderBottom: '1px solid #eee',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10
        }}>
          <div>
            <h4 style={{ margin: 0, fontWeight: 800, color: '#333' }}>Local Farmers Map</h4>
            <span style={{ fontSize: '13px', color: '#666' }}>Find registered growers physically near you</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '24px', color: '#888', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Map Container */}
        <div style={{ height: '600px', width: '100%', position: 'relative' }}>
          <MapContainer center={[centerLat, centerLng]} zoom={initialZoom} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {myLocation && (
              <Marker position={[myLocation.lat, myLocation.lng]} icon={myLocationIcon}>
                <Popup>
                  <strong>You are here!</strong>
                </Popup>
              </Marker>
            )}

            {farmers.map(farmer => (
              <Marker key={farmer.id} position={[farmer.locationLat, farmer.locationLng]} icon={farmerIcon}>
                <Popup>
                  <div style={{ minWidth: '150px' }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', color: 'var(--primary)' }}>{farmer.name}</h4>
                    <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>{farmer.addressText || 'Verified Farmer Location'}</p>
                    <a href={`https://wa.me/94${(farmer.phone || '770000000').replace(/^0/, '')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px 12px', background: '#25D366', color: '#fff', textAlign: 'center', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px', marginTop: '10px' }}>
                      <i className="fa fa-whatsapp" style={{ fontSize: '14px' }}></i> WhatsApp Farmer
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default FarmersMapModal;
