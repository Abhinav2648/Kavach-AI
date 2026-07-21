import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Stats from "./components/Stats";
import About from "./components/About";
import Footer from "./components/Footer";

import Scan from "./pages/Scan";
import Emergency from "./pages/Emergency";
import History from "./pages/History";

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <About />
      <Login />
      <Footer />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Wait until Firebase checks login status
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Protected Scan Page */}
      <Route
        path="/scan"
        element={user ? <Scan /> : <Navigate to="/#login" replace />}
      />
      
      <Route path="/emergency" element={<Emergency />} />
      <Route
        path="/history"
        element={user ? <History /> : <Navigate to="/#login" replace />}
      />
    </Routes>
  );
}

export default App;
