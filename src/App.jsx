import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
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

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let profileUnsubscribe = null;

    const authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        profileUnsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            // Temporary fallback during the split-second race condition on registration
            setUserData({ role: 'farmer', name: 'Loading...' });
          }
          setLoading(false);
        }, (err) => {
          console.error("Firestore read error:", err);
          setUserData({ role: 'farmer', name: 'Guest' });
          setLoading(false);
        });
      } else {
        setUserData(null);
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
      <Navbar user={user} userData={userData} />
      <Routes>
        <Route path="/" element={<Home userData={userData} />} />
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/spice-stories" element={<SpiceStories />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/farmer" element={user && userData?.role === 'farmer' ? <FarmerDashboard /> : <Navigate to="/" />} />
        <Route path="/admin" element={user && userData?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/transport" element={user && userData?.role === 'transport' ? <TransportDashboard /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
