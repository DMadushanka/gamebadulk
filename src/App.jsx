import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Marketplace from './pages/Marketplace';
import SpiceStories from './pages/SpiceStories';
import ContactUs from './pages/ContactUs';
import FarmerDashboard from './pages/FarmerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TransportDashboard from './pages/TransportDashboard';
import Cart from './pages/Cart';
import Legal from './pages/Legal';
import Profile from './pages/Profile';


function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartInitialized, setCartInitialized] = useState(false);

  // Sync Cart to Firestore whenever it changes
  useEffect(() => {
    if (user && cartInitialized) {
      const syncCart = async () => {
        try {
          const cartRef = doc(db, 'carts', user.uid);
          await setDoc(cartRef, { 
            items: cart, 
            lastUpdated: new Date().toISOString() 
          });
        } catch (error) {
          console.error("Error syncing cart:", error);
        }
      };
      
      const timeoutId = setTimeout(syncCart, 500); // Debounce sync
      return () => clearTimeout(timeoutId);
    }
  }, [cart, user, cartInitialized]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  useEffect(() => {
    let profileUnsubscribe = null;

    const authUnsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Load User Profile
        const docRef = doc(db, 'users', currentUser.uid);
        profileUnsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setUserData({ role: 'farmer', name: 'Loading...' });
          }
          setLoading(false);
        });

        // Load Persistent Cart
        try {
          const cartRef = doc(db, 'carts', currentUser.uid);
          const cartSnap = await getDoc(cartRef);
          if (cartSnap.exists()) {
            setCart(cartSnap.data().items || []);
          }
          setCartInitialized(true);
        } catch (error) {
          console.error("Error loading cart:", error);
          setCartInitialized(true);
        }
      } else {
        setUserData(null);
        setCart([]); // Clear cart on logout
        setCartInitialized(false);
        if (profileUnsubscribe) profileUnsubscribe();
        setLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
    };
  }, []);

  if (loading) return <div style={{display: 'flex', height: '100vh', alignItems:'center', justifyContent: 'center'}}><h2>Loading Application...</h2></div>;

  return (
    <Router>
      <Navbar user={user} userData={userData} cart={cart} removeFromCart={removeFromCart} />
      <Routes>
        <Route path="/" element={<Home user={user} userData={userData} addToCart={addToCart} />} />
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
        <Route path="/marketplace" element={<Marketplace user={user} addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} updateCartQuantity={updateCartQuantity} />} />

        <Route path="/spice-stories" element={<SpiceStories />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/farmer" element={user && userData?.role === 'farmer' ? <FarmerDashboard /> : <Navigate to="/" />} />
        <Route path="/admin" element={user && userData?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/transport" element={user && userData?.role === 'transport' ? <TransportDashboard /> : <Navigate to="/" />} />
        <Route path="/terms" element={<Legal type="terms" />} />
        <Route path="/profile" element={user ? <Profile user={user} userData={userData} /> : <Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
