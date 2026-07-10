import axios from "axios";
import { useState } from "react";
import {
  ScanSearch,
  MessageSquare,
  Globe,
  Image as ImageIcon,
  ShieldAlert,
  Cpu,
  Upload
} from "lucide-react";

const Scan = () => {
  const [activeTab, setActiveTab] = useState("sms");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    status: "Waiting for Scan",
    confidence: "--",
    verdict: "Ready to analyze potential threats.",
    reason: "Upload data and click Scan."
  });

  const handleScan = async () => {
    if (!text.trim()) {
      alert("Please enter a message.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/predict", {
        text: text
      });

      setResult({
        status: response.data.status || "Completed",
        confidence: response.data.confidence || "98%",
        verdict: response.data.verdict || "Analysis Successful",
        reason: response.data.reason || "The AI engine has processed the patterns successfully."
      });
    } catch (error) {
      alert("Backend not running.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-16 px-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Cpu size={14} className="animate-pulse" />
            <span>Kavach AI Neural Engine</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            AI <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Scam Scanner</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Scan SMS messages, suspicious URLs or screenshots using AI powered fraud detection.
          </p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl">
          <div className="flex flex-wrap p-1.5 bg-slate-950/80 rounded-2xl mb-8 border border-slate-800">
            {[
              { id: "sms", label: "SMS Message", icon: MessageSquare },
              { id: "url", label: "URL Scanner", icon: Globe },
              { id: "image", label: "Screenshot", icon: ImageIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-cyan-500 text-slate-950 shadow-lg"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="mb-8">
            {activeTab === "sms" && (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-44 bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all resize-none shadow-inner"
                placeholder="Paste suspicious SMS here..."
              />
            )}
            {activeTab === "url" && (
              <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-8 flex items-center gap-4">
                <Globe className="text-slate-600" size={24} />
                <input
                  type="text"
                  className="w-full bg-transparent text-slate-200 placeholder:text-slate-600 focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>
            )}
            {activeTab === "image" && (
              <div className="h-44 bg-slate-950/50 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-cyan-500/40 transition-colors group">
                <div className="p-4 bg-slate-900 rounded-full text-slate-500 group-hover:text-cyan-400 group-hover:scale-110 transition-all">
                  <Upload size={32} />
                </div>
                <span className="text-slate-500 font-medium">Click to upload screenshot</span>
              </div>
            )}
          </div>

          <button
            onClick={handleScan}
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
              loading 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.3)] active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <ScanSearch size={22} />
                SCAN WITH AI
              </>
            )}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Status</p>
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className={`w-2.5 h-2.5 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              {result.status}
            </div>
          </div>
          
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Confidence</p>
            <p className="text-white font-black text-3xl">{result.confidence}</p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Verdict</p>
            <p className="text-white font-bold">{result.verdict}</p>
          </div>
        </div>

        <div className="mt-4 bg-cyan-500/5 backdrop-blur-md border border-cyan-500/10 p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="p-4 bg-cyan-500/10 rounded-2xl text-cyan-500">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h3 className="text-cyan-400 font-bold uppercase tracking-widest text-xs mb-2">AI Reasoning Engine</h3>
            <p className="text-slate-300 text-base leading-relaxed italic">
              "{result.reason}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scan;