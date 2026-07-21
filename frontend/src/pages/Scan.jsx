import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ScanSearch,
  MessageSquare,
  Globe,
  Image as ImageIcon,
  ShieldAlert,
  Cpu,
  Upload,
} from "lucide-react";

const Scan = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout.");
    }
  };
  const [activeTab, setActiveTab] = useState("sms");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [url, setUrl] = useState("");
  const [history, setHistory] = useState([]);
  const [scanCount, setScanCount] = useState(0);
  useEffect(() => {
    const loadHistory = async () => {
      if (!auth.currentUser) return;

      try {
        const scansRef = collection(db, "users", auth.currentUser.uid, "scans");

        const q = query(scansRef, orderBy("createdAt", "desc"));

        const snapshot = await getDocs(q);

        const scans = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHistory(scans);
        setScanCount(scans.length);
      } catch (err) {
        console.error("Error loading history:", err);
      }
    };

    loadHistory();
  }, []);
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState({
    status: "Waiting for Scan",
    confidence: "--",
    verdict: "Ready to analyze potential threats.",
    reason: "Upload data and click Scan.",
  });
  const riskLevel =
    result.status === "Waiting for Scan"
      ? "--"
      : result.status.toLowerCase().includes("safe")
        ? "Low"
        : result.status.toLowerCase().includes("suspicious")
          ? "Medium"
          : "High";
  const safetyRecommendation =
    riskLevel === "--"
      ? "Scan a message, URL, or screenshot to receive safety recommendations."
      : riskLevel === "High"
        ? "Do not click any links or share OTP, passwords, banking details, or personal information."
        : riskLevel === "Medium"
          ? "Proceed with caution. Verify the sender or website before taking any action."
          : "No major threats detected. Always stay cautious when sharing personal information online.";
  const updateDashboardStats = (type, scanResult) => {
    const stats = JSON.parse(localStorage.getItem("scanStats")) || {
      totalScans: 0,
      threatsDetected: 0,
      safeScans: 0,
      smsScanned: 0,
      urlsScanned: 0,
      imagesScanned: 0,
    };

    stats.totalScans += 1;

    const status = scanResult?.status?.toLowerCase() || "";

    if (status.includes("threat")) {
      stats.threatsDetected += 1;
    } else if (status.includes("safe")) {
      stats.safeScans += 1;
    }

    if (type === "sms") {
      stats.smsScanned += 1;
    } else if (type === "url") {
      stats.urlsScanned += 1;
    } else if (type === "image") {
      stats.imagesScanned += 1;
    }

    localStorage.setItem("scanStats", JSON.stringify(stats));
  };
  const saveScanToFirestore = async (type, input, scanResult) => {
    const user = auth.currentUser;

    if (!user) {
      console.error("User is not logged in");
      return;
    }

    try {
      await addDoc(collection(db, "users", user.uid, "scans"), {
        type: type,
        input: input,
        status: scanResult.status,
        confidence: scanResult.confidence,
        verdict: scanResult.verdict,
        reason: scanResult.reason || "",
        riskLevel: scanResult.risk_level || "",
        detectedKeywords: scanResult.detected_keywords || [],
        safetyRecommendation: scanResult.safety_recommendation || "",
        createdAt: serverTimestamp(),
      });

      console.log("Scan saved to Firestore");
    } catch (error) {
      console.error("Error saving scan:", error);
    }
  };
  const handleScan = async () => {
    setLoading(true);

    try {
      // ---------- SMS ----------
      if (activeTab === "sms") {
        if (!text.trim()) {
          alert("Please enter a message.");
          setLoading(false);
          return;
        }

        const response = await axios.post("http://127.0.0.1:5000/predict", {
          text: text,
        });

        setResult(response.data);
        await saveScanToFirestore("sms", text, response.data);
        updateDashboardStats("sms", response.data);
        setScanCount((prev) => prev + 1);
        setHistory((prev) => [
          {
            type: "SMS",
            status: response.data.status,
            confidence: response.data.confidence,
            verdict: response.data.verdict,
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
      }

      // ---------- URL ----------
      else if (activeTab === "url") {
        if (!url.trim()) {
          alert("Please enter a URL.");
          setLoading(false);
          return;
        }

        const response = await axios.post("http://127.0.0.1:5000/predict_url", {
          url: url,
        });

        setResult(response.data);
        await saveScanToFirestore("url", url, response.data);

        updateDashboardStats("url", response.data);
        setScanCount((prev) => prev + 1);
        setHistory((prev) => [
          {
            type: "URL",
            status: response.data.status,
            confidence: response.data.confidence,
            verdict: response.data.verdict,
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
      }

      // ---------- IMAGE ----------
      else if (activeTab === "image") {
        if (!image) {
          alert("Please select an image.");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", image);

        const response = await axios.post(
          "http://127.0.0.1:5000/predict_image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setResult(response.data);
        await saveScanToFirestore(
          "image",
          response.data.extracted_text || image.name,
          response.data,
        );
        updateDashboardStats("image", response.data);
        setScanCount((prev) => prev + 1);

        setHistory((prev) => [
          {
            type: "IMAGE",
            status: response.data.status,
            confidence: response.data.confidence,
            verdict: response.data.verdict,
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
      }
    } catch (error) {
      console.error(error);
      alert("Backend not running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-16 px-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-end gap-3 mb-6">
          <Link
            to="/history"
            className="border border-cyan-500/40 text-cyan-400 px-4 py-2 rounded-lg hover:bg-cyan-500/10 transition"
          >
            Scan History
          </Link>

          <button
            onClick={handleLogout}
            className="border border-red-500/40 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/10 transition"
          >
            Logout
          </button>
        </div>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Cpu size={14} className="animate-pulse" />
            <span>Kavach AI Neural Engine</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            AI{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Scam Scanner
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Scan SMS messages, suspicious URLs or screenshots using AI powered
            fraud detection.
          </p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl">
          <div className="flex flex-wrap p-1.5 bg-slate-950/80 rounded-2xl mb-8 border border-slate-800">
            {[
              { id: "sms", label: "SMS Message", icon: MessageSquare },
              { id: "url", label: "URL Scanner", icon: Globe },
              { id: "image", label: "Screenshot", icon: ImageIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setResult({
                    status: "Waiting for Scan",
                    confidence: "--",
                    verdict: "Ready to analyze potential threats.",
                    reason: "Upload data and click Scan.",
                  });
                }}
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
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-transparent text-slate-200 placeholder:text-slate-600 focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>
            )}
            {activeTab === "image" && (
              <div className="min-h-[350px] bg-slate-950/50 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-4 p-6">
                <Upload size={32} className="text-cyan-400" />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImage(file);

                    if (file) {
                      setImageInfo({
                        name: file.name,
                        size: (file.size / 1024).toFixed(2),
                        type: file.type,
                      });
                    }
                  }}
                  className="text-white"
                />

                {image && (
                  <div className="mt-4 flex flex-col items-center gap-3">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-44 rounded-xl border border-cyan-500 shadow-lg object-contain"
                    />

                    {imageInfo && (
                      <div className="text-center text-sm text-slate-300">
                        <p>
                          <span className="text-cyan-400 font-semibold">
                            Name:
                          </span>{" "}
                          {imageInfo.name}
                        </p>

                        <p>
                          <span className="text-cyan-400 font-semibold">
                            Type:
                          </span>{" "}
                          {imageInfo.type}
                        </p>

                        <p>
                          <span className="text-cyan-400 font-semibold">
                            Size:
                          </span>{" "}
                          {imageInfo.size} KB
                        </p>
                      </div>
                    )}
                  </div>
                )}
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
        <div className="mt-6 mb-4 flex justify-end items-center">
          <div className="bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-xl text-cyan-400 font-semibold">
            Total Scans: {scanCount}
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">
              Status
            </p>
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  loading
                    ? "bg-amber-500 animate-pulse"
                    : result.status.toLowerCase().includes("safe")
                      ? "bg-green-500"
                      : result.status.toLowerCase().includes("suspicious")
                        ? "bg-yellow-500"
                        : "bg-red-500"
                }`}
              />
              {result.status}
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">
              Confidence
            </p>
            <div className="mt-2">
              <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    parseInt(result.confidence) > 80
                      ? "bg-red-500"
                      : parseInt(result.confidence) > 50
                        ? "bg-yellow-400"
                        : "bg-green-500"
                  }`}
                  style={{
                    width: result.confidence || "0%",
                  }}
                ></div>
              </div>

              <p className="text-white text-2xl font-bold mt-2">
                {result.confidence}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">
              Verdict
            </p>
            <p
              className={`font-bold ${
                result.status.toLowerCase().includes("safe")
                  ? "text-green-400"
                  : result.status.toLowerCase().includes("suspicious")
                    ? "text-yellow-400"
                    : "text-red-400"
              }`}
            >
              {result.verdict}
            </p>
          </div>
          {/* Risk Level Card */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">
              Risk Level
            </p>

            <p
              className={`font-bold text-2xl ${
                riskLevel === "Low"
                  ? "text-green-400"
                  : riskLevel === "Medium"
                    ? "text-yellow-400"
                    : "text-red-400"
              }`}
            >
              {riskLevel}
            </p>
          </div>
        </div>
        <div className="mt-4 w-full p-5 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl">
          <p className="text-cyan-400 font-bold mb-2">
            🛡️ Safety Recommendation
          </p>

          <p className="text-slate-300">{safetyRecommendation}</p>
        </div>

        <div className="mt-4 bg-cyan-500/5 backdrop-blur-md border border-cyan-500/10 p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="p-4 bg-cyan-500/10 rounded-2xl text-cyan-500">
            <ShieldAlert size={32} />
          </div>
          <div>
            {history.length > 0 && (
              <div className="mt-8 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-cyan-400 text-xl font-bold">
                    Scan History
                  </h2>

                  <button
                    onClick={() => setHistory([])}
                    className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm"
                  >
                    Clear History
                  </button>
                </div>

                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-slate-950/50 border border-slate-800 rounded-xl p-4"
                    >
                      <div>
                        <p className="text-white font-semibold">{item.type}</p>

                        <p className="text-slate-400 text-sm">{item.time}</p>
                      </div>

                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.status.toLowerCase().includes("safe")
                              ? "bg-green-500/20 text-green-400"
                              : item.status.toLowerCase().includes("suspicious")
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {item.verdict}
                        </span>

                        <p className="text-slate-400 text-sm">
                          {item.confidence}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <h3 className="text-cyan-400 font-bold uppercase tracking-widest text-xs mb-2">
              AI Reasoning Engine
            </h3>
            <p className="text-slate-300 text-base leading-relaxed italic">
              "{result.reason}"
            </p>
            {result.detected_keywords &&
              result.detected_keywords.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-cyan-400 font-bold text-sm mb-3">
                    Detected Keywords
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {result.detected_keywords.map((word, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500 text-red-300 text-sm font-semibold"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            {result.extracted_text && (
              <div className="mt-4">
                <h4 className="text-cyan-400 font-bold text-sm mb-2">
                  Extracted Text
                </h4>

                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-300 whitespace-pre-wrap">
                  {result.extracted_text}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scan;
