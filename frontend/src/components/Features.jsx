
import {
  MessageSquareWarning,
  Globe,
  PhoneCall,
  Gavel,
  Scale,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    title: "Scam SMS Detection",
    description:
      "Detect malicious SMS and fraudulent messages before users click harmful links.",
    icon: MessageSquareWarning,
    color: "text-cyan-400",
  },
  {
    title: "Phishing URL Scanner",
    description:
      "Verify suspicious websites instantly using AI-powered phishing detection.",
    icon: Globe,
    color: "text-blue-400",
  },
  {
    title: "Fake Call Detection",
    description:
      "Identify scam callers and AI-generated voice impersonation attempts.",
    icon: PhoneCall,
    color: "text-indigo-400",
  },
  {
    title: "Digital Arrest Detection",
    description:
      "Detect fake legal notices and digital arrest scams before financial loss.",
    icon: Gavel,
    color: "text-purple-400",
  },
  {
    title: "AI Legal Assistant",
    description:
      "Receive instant legal guidance and cyber safety recommendations powered by AI.",
    icon: Scale,
    color: "text-emerald-400",
  },
  {
    title: "Threat Intelligence Dashboard",
    description:
      "Monitor real-time cyber threats, fraud trends, and security insights across India.",
    icon: LayoutDashboard,
    color: "text-rose-400",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="relative bg-slate-950 py-28 px-6 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05),transparent_70%)] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Section Heading */}
        <div className="text-center mb-20">

          <p className="text-cyan-400 uppercase tracking-[0.3em] font-semibold text-sm">
            Features
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white">

            AI Powered Protection for

            <br />

            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              India's Digital Safety
            </span>

          </h2>

          <p className="mt-6 text-slate-400 text-lg max-w-3xl mx-auto leading-8">
            Protect yourself against modern cyber threats using AI-powered
            fraud detection, legal assistance, scam analysis, and digital
            safety tools.
          </p>

        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature, index) => (

            <div
              key={index}
              className="group relative bg-slate-900/50 backdrop-blur-lg border border-slate-800 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10"
            >

              {/* Hover Glow */}

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>

              <div className="relative z-10">

                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center bg-slate-800 border border-slate-700 mb-6 transition-transform duration-300 group-hover:scale-110 ${feature.color}`}
                >
                  <feature.icon size={28} />
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition">

                  {feature.title}

                </h3>

                <p className="text-slate-400 leading-7 mb-8">

                  {feature.description}

                </p>

                <div className="flex items-center gap-2 text-cyan-400 font-semibold">

                  Explore

                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-2 transition-transform"
                  />

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default Features;