import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Zap,
  Globe,
  Cpu,
  Smartphone,
} from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section id="home" className="relative min-h-screen bg-slate-950 flex items-center overflow-hidden pt-44 pb-20 px-6">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT CONTENT */}

        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-sm font-semibold">
            <Zap size={16} />
            AI Powered Digital Public Safety
          </div>

          <p className="mt-6 uppercase tracking-[0.3em] text-cyan-400 text-sm font-semibold">
            Economic Times AI Hackathon 2026
          </p>

          <h1 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.15]">
            AI Protection Against
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Digital Arrest & Cyber Fraud
            </span>
          </h1>

          <p className="mt-8 text-slate-400 text-lg leading-8 max-w-xl">
            Detect scam SMS, phishing links, fake digital arrest notices,
            suspicious calls, and cyber fraud using AI-powered analysis before
            financial damage occurs.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <button
              onClick={() => navigate("/scan")}
              className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-xl transition-all"
            >
              <ShieldCheck size={20} />
              Start AI Scan
            </button>

            <Link
              to="/emergency"
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-red-500/50 text-white font-semibold hover:bg-red-500/10 transition"
            >
              Emergency Report
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800">
            <p className="text-slate-500 text-sm leading-7">
              Built for the{" "}
              <span className="text-cyan-400 font-semibold"></span>
              <br />
            </p>
          </div>
        </div>

        {/* RIGHT CONTENT */}

        <div className="flex justify-center">
          <div className="relative w-80 h-80 md:w-[420px] md:h-[420px] flex items-center justify-center">
            {/* Rotating Rings */}

            <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/20 animate-[spin_22s_linear_infinite]" />

            <div className="absolute inset-10 rounded-full border border-blue-500/20 animate-[spin_16s_linear_infinite_reverse]" />

            {/* Shield */}

            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl">
              <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full" />

              <ShieldCheck size={90} className="relative z-10 text-cyan-400" />
            </div>

            {/* Floating Icons */}

            <div className="absolute top-2 right-8 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-xl animate-bounce">
              <Lock size={24} className="text-blue-400" />
            </div>

            <div className="absolute bottom-8 left-0 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-xl animate-pulse">
              <Smartphone size={24} className="text-cyan-400" />
            </div>

            <div className="absolute top-1/2 -right-6 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-xl animate-bounce">
              <Globe size={24} className="text-indigo-400" />
            </div>

            <div className="absolute bottom-2 right-20 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-xl">
              <Cpu size={24} className="text-emerald-400" />
            </div>

            {/* Light Beams */}

            <div className="absolute w-[160%] h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent rotate-45" />

            <div className="absolute w-[160%] h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent -rotate-45" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
