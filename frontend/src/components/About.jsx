import {
  BrainCircuit,
  EyeOff,
  Zap,
  Map,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const About = () => {
  const highlights = [
    "AI Powered Engine",
    "CERT-In Inspired Framework",
    "Real-time Protection",
    "Privacy First Approach",
  ];

  const infoCards = [
    {
      title: "AI Protection",
      desc: "24/7 Monitoring",
      icon: BrainCircuit,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Privacy First",
      desc: "No Data Stored",
      icon: EyeOff,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Fast Detection",
      desc: "<1 Second Response",
      icon: Zap,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      title: "National Scale",
      desc: "Built for India",
      icon: Map,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <section
      id="about"
      className="relative bg-slate-950 py-24 px-6 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-cyan-600/10 rounded-full blur-[100px] -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div>
          {/* Section Heading */}
          <h3 className="text-cyan-500 font-bold tracking-[0.2em] uppercase text-sm mb-5">
            ABOUT
          </h3>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>

            <span className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em]">
              About Kavach AI
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-white">
            India's AI
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Cyber Defence Platform
            </span>
          </h2>

          {/* Description */}
          <div className="mt-8 space-y-5 text-slate-400 text-lg leading-8">
            <p>
              Kavach AI is an intelligent cybersecurity platform designed to
              protect Indian citizens against modern digital frauds such as scam
              SMS, phishing websites, fake digital arrest notices, voice scams,
              and online financial fraud.
            </p>

            <p>
              Powered by Artificial Intelligence and inspired by CERT-In cyber
              safety initiatives, our platform continuously analyzes threats in
              real time while keeping user privacy at the center of every
              decision.
            </p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-slate-200"
              >
                <CheckCircle2 className="text-cyan-400" size={20} />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* Button */}
          <button className="mt-10 group inline-flex items-center gap-3 px-8 py-4 bg-slate-900 border border-slate-700 rounded-xl hover:border-cyan-400 hover:bg-slate-900/80 transition-all duration-300 text-white font-semibold">
            Explore Platform
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        {/* Right Cards */}
        <div className="relative grid grid-cols-2 gap-6">
          {/* Background Glow */}
          <div className="absolute inset-0 rounded-full bg-cyan-500/5 blur-3xl"></div>

          {infoCards.map((card, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800 hover:border-cyan-400/50 hover:bg-slate-900/70 transition-all duration-500 hover:-translate-y-2 shadow-xl group ${
                index % 2 !== 0 ? "mt-8" : ""
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.bg} mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <card.icon className={card.color} size={30} />
              </div>

              <h4 className="text-xl font-bold text-white mb-2">
                {card.title}
              </h4>

              <p className="text-slate-400">{card.desc}</p>

              <div className="mt-6 h-[2px] w-0 bg-gradient-to-r from-cyan-500 to-transparent group-hover:w-full transition-all duration-500"></div>
            </div>
          ))}

          {/* Decorative Glow */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default About;