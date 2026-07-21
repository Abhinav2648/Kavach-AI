import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { collection, getDocs, query, orderBy } from "firebase/firestore";

import { auth, db } from "../firebase";

const History = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        const scansRef = collection(db, "users", auth.currentUser.uid, "scans");

        const q = query(scansRef, orderBy("createdAt", "desc"));

        const snapshot = await getDocs(q);

        const scanList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setScans(scanList);
      } catch (error) {
        console.error("Error fetching scan history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";

    try {
      return timestamp.toDate().toLocaleString();
    } catch {
      return "Unknown date";
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Threat Detected") {
      return "text-red-400 border-red-500/30 bg-red-500/10";
    }

    if (status === "Suspicious") {
      return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
    }

    return "text-green-400 border-green-500/30 bg-green-500/10";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading scan history...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-end mb-6">
          <Link
            to="/scan"
            className="border border-cyan-500/40 text-cyan-400 px-4 py-2 rounded-lg hover:bg-cyan-500/10 transition"
          >
            ← Back to Scanner
          </Link>
        </div>

        <div className="mb-10">
          <p className="text-cyan-400 text-sm font-semibold tracking-widest">
            KAVACH AI
          </p>

          <h1 className="text-4xl font-bold mt-2">Scan History</h1>

          <p className="text-slate-400 mt-2">
            Review your previous AI-powered security scans.
          </p>
        </div>

        {scans.length === 0 ? (
          <div className="border border-slate-800 bg-slate-900 rounded-xl p-10 text-center">
            <p className="text-slate-400">No scans found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scans.map((scan) => (
              <div
                key={scan.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div
                      className={`inline-block border rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        scan.status,
                      )}`}
                    >
                      {scan.status || "Unknown"}
                    </div>

                    <h2 className="text-xl font-bold mt-3 uppercase">
                      {scan.type || "Scan"} Scan
                    </h2>

                    <p className="text-slate-400 text-sm mt-1">
                      {formatDate(scan.createdAt)}
                    </p>

                    <p className="text-slate-300 mt-3">
                      Confidence:
                      <span className="text-cyan-400 font-semibold ml-2">
                        {scan.confidence || "--"}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedScan(scan)}
                    className="bg-cyan-600 hover:bg-cyan-500 px-5 py-2 rounded-lg font-semibold transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAILS MODAL */}

      {selectedScan && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-7 max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Scan Details</h2>

              <button
                onClick={() => setSelectedScan(null)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-slate-500 text-sm">Status</p>
                <p className="font-semibold">{selectedScan.status}</p>
              </div>

              <div>
                <p className="text-slate-500 text-sm">Confidence</p>
                <p>{selectedScan.confidence}</p>
              </div>

              <div>
                <p className="text-slate-500 text-sm">Risk Level</p>
                <p>{selectedScan.riskLevel}</p>
              </div>

              <div>
                <p className="text-slate-500 text-sm">Input</p>
                <div className="bg-slate-950 p-4 rounded-lg mt-2 text-slate-300 break-words">
                  {selectedScan.input || "No input available"}
                </div>
              </div>

              <div>
                <p className="text-slate-500 text-sm">Reason</p>
                <p className="text-slate-300 mt-1">
                  {selectedScan.reason || "No reason available"}
                </p>
              </div>

              <div>
                <p className="text-slate-500 text-sm">Detected Keywords</p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedScan.detectedKeywords?.length > 0 ? (
                    selectedScan.detectedKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-400">
                      No suspicious keywords detected.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-slate-500 text-sm">Safety Recommendation</p>

                <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg mt-2 text-cyan-100">
                  {selectedScan.safetyRecommendation ||
                    "No recommendation available."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
