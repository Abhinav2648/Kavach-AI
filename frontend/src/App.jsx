import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Stats from "./components/Stats";
import About from "./components/About";
import Footer from "./components/Footer";

import Scan from "./pages/Scan";

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <Hero />

      <Features />

      <Stats />

      <About />

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/scan" element={<Scan />} />
    </Routes>
  );
}

export default App;