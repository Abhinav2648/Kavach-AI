import {
  ShieldAlert,
  Activity,
  Globe,
  PhoneOff,
  UserCheck,
  Timer,
  TrendingUp,
} from "lucide-react";

const statsData = [
  {
    id: "0x2A4",
    label: "Threats Blocked Today",
    value: "12,458",
    icon: ShieldAlert,
    color: "text-cyan-400",
    isLive: true,
  },
  {
    id: "0x4F1",
    label: "AI Detection Accuracy",
    value: "99.4%",
    icon: Activity,
    color: "text-emerald-400",
    isLive: false,
  },
  {
    id: "0x7B9",
    label: "Phishing URLs Detected",
    value: "2,318",
    icon: Globe,
    color: "text-blue-400",
    isLive: true,
  },
  {
    id: "0x9D3",
    label: "Scam Calls Reported",
    value: "876",
    icon: PhoneOff,
    color: "text-rose-400",
    isLive: true,
  },
  {
    id: "0xAE7",
    label: "Digital Arrest Cases Prevented",
    value: "547",
    icon: UserCheck,
    color: "text-indigo-400",
    isLive: true,
  },
  {
    id: "0xF20",
    label: "Average Scan Time",
    value: "0.8 sec",
    icon: Timer,
    color: "text-amber-400",
    isLive: false,
  },
];

const Stats = () => {
  return (
    <section
      id="stats"
      className="scroll-mt-24 bg-slate-950 py-28 px-6 relative overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}

        <div className="text-center mb-20">

          <p className="text-cyan-400 uppercase tracking-[0.3em] font-semibold text-sm">
            Live Metrics
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white">
            LIVE THREAT{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              DASHBOARD
            </span>
          </h2>

          <p className="mt-6 text-slate-400 text-lg max-w-3xl mx-auto leading-8">
            Real-time AI powered cyber threat intelligence protecting citizens
            across India every second.
          </p>

        </div>

        {/* Dashboard Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {statsData.map((stat, index) => (

            <div
              key={index}
              className="group relative overflow-hidden p-8 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-800 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(6,182,212,0.15)]"
            >

              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">

                <div className="flex justify-between items-start mb-6">

                  <div
                    className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 ${stat.color} group-hover:scale-110 transition-transform duration-500`}
                  >
                    <stat.icon size={28} />
                  </div>

                  {stat.isLive && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                      </span>
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                        LIVE
                      </span>
                    </div>
                  )}

                </div>

                <h3 className="text-4xl font-black text-white tracking-tight group-hover:text-cyan-400 transition-colors duration-300">
                  {stat.value}
                </h3>

                <p className="mt-2 text-slate-400 font-medium text-sm uppercase tracking-wide">
                  {stat.label}
                </p>

                <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">

                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">

                    <TrendingUp size={14} />

                    <span>+12% this hour</span>

                  </div>

                  <div className="text-slate-600 text-[10px] font-mono">

                    ID: {stat.id}

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* Bottom Status */}

        <div className="mt-14 rounded-2xl border border-cyan-500/10 bg-gradient-to-r from-cyan-900/10 via-slate-900/30 to-transparent p-6 flex flex-col md:flex-row justify-between items-center gap-5">

          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-full bg-cyan-500/20 flex items-center justify-center">

              <Activity size={20} className="text-cyan-400" />

            </div>

            <p className="text-slate-300">

              <span className="text-cyan-400 font-semibold">
                AI Security Network Operational
              </span>{" "}
              • Monitoring cyber threats across India in real time.

            </p>

          </div>

          <button className="text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors">

            View Live Threat Map →

          </button>

        </div>

      </div>

    </section>
  );
};

export default Stats;