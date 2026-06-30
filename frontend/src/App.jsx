import About from "./components/About";
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Stats from './components/Stats';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(17,24,39,1)_0%,_rgba(2,6,23,1)_100%)]"></div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Stats />
          <About/>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;