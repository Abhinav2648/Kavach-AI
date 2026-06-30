import {
  ShieldCheck,
  Mail,
  MapPin,
  Activity,
  Heart,
  ChevronRight,
} from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer
      id="contact"
      className="relative bg-slate-950 border-t border-slate-900 pt-20 pb-10 px-6 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-t from-cyan-900/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <ShieldCheck className="text-cyan-400" size={28} />
              </div>

              <h2 className="text-2xl font-black text-white">
                KAVACH <span className="text-cyan-400">AI</span>
              </h2>
            </div>

            <p className="text-slate-400 text-sm leading-7">
              Securing India's digital future using Artificial Intelligence,
              phishing detection, scam prevention and cyber fraud protection.
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-xs uppercase tracking-widest text-cyan-400 font-bold">
                Economic Times AI Hackathon
              </p>

              <p className="text-slate-300 mt-2 text-sm">
                Built for ET AI Hackathon 2026
              </p>
            </div>

            <div className="flex gap-4">

  <a
    href="https://github.com/Abhinav2648"
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 rounded-full border border-slate-800 bg-slate-900 text-slate-400 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300"
  >
    <FaGithub size={18} />
  </a>

  <a
    href="#"
    className="p-2 rounded-full border border-slate-800 bg-slate-900 text-slate-400 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300"
  >
      <FaXTwitter size={18} />
     </a>

         <a
            href="https://www.linkedin.com/in/abhinav-yadav-07590b289"
             target="_blank"
             rel="noopener noreferrer"
            className="p-2 rounded-full border border-slate-800 bg-slate-900 text-slate-400 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300"
  >
           <FaLinkedin size={18} />
            </a>

          </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">
              Quick Links
            </h3>

            <ul className="space-y-4">

              <li>
                <a href="#home" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition">
                  <ChevronRight size={15} />
                  Home
                </a>
              </li>

              <li>
                <a href="#features" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition">
                  <ChevronRight size={15} />
                  Features
                </a>
              </li>

              <li>
                <a href="#dashboard" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition">
                  <ChevronRight size={15} />
                  Dashboard
                </a>
              </li>

              <li>
                <a href="#about" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition">
                  <ChevronRight size={15} />
                  About
                </a>
              </li>

              <li>
                <a href="#contact" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition">
                  <ChevronRight size={15} />
                  Contact
                </a>
              </li>

            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">
              Features
            </h3>

            <ul className="space-y-4 text-slate-400">

              <li className="flex items-center gap-2 hover:text-cyan-400 transition">
                <ChevronRight size={15} />
                Scam SMS Detection
              </li>

              <li className="flex items-center gap-2 hover:text-cyan-400 transition">
                <ChevronRight size={15} />
                Phishing URL Scanner
              </li>

              <li className="flex items-center gap-2 hover:text-cyan-400 transition">
                <ChevronRight size={15} />
                Fake Call Detection
              </li>

              <li className="flex items-center gap-2 hover:text-cyan-400 transition">
                <ChevronRight size={15} />
                AI Legal Assistant
              </li>

              <li className="flex items-center gap-2 hover:text-cyan-400 transition">
                <ChevronRight size={15} />
                Threat Dashboard
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div>

            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">
              Contact
            </h3>

            <div className="space-y-5">

              <div className="flex gap-3">
                <Mail className="text-cyan-400 mt-1" size={18} />

                <div>
                  <p className="text-white font-semibold">Email</p>
                  <p className="text-slate-400 text-sm">
                    support@kavachai.in
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin className="text-cyan-400 mt-1" size={18} />

                <div>
                  <p className="text-white font-semibold">Location</p>
                  <p className="text-slate-400 text-sm">
                    New Delhi, India
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
                <Activity className="text-emerald-400" size={16} />
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                  AI Protection Active 24×7
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="text-slate-500 text-sm">
            <p>© 2026 Kavach AI. All Rights Reserved.</p>

            <p className="flex items-center gap-1 mt-2">
              Made with
              <Heart size={14} className="fill-rose-500 text-rose-500" />
              for Economic Times AI Hackathon
            </p>
          </div>

          <div className="flex gap-6 text-sm">
            <a href="#" className="text-slate-500 hover:text-white">
              Privacy Policy
            </a>

            <a href="#" className="text-slate-500 hover:text-white">
              Terms of Service
            </a>

            <a href="#" className="text-slate-500 hover:text-white">
              Security
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;