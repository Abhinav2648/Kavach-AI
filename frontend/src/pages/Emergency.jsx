import { Link } from "react-router-dom";
const Emergency = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-3xl w-full">
        <Link
          to="/scan"
          className="inline-block mb-6 text-cyan-400 hover:text-cyan-300 font-semibold transition"
        >
          ← Back to AI Scanner
        </Link>
        <p className="text-red-400 text-sm font-semibold tracking-widest">
          KAVACH AI EMERGENCY ASSISTANCE
        </p>

        <h1 className="text-4xl font-bold mt-3">Cyber Fraud Emergency</h1>

        <p className="text-slate-400 mt-3">
          If you believe you are a victim of cyber fraud, digital arrest,
          phishing, or financial scam, take immediate action.
        </p>

        <div className="mt-8 bg-slate-900 border border-red-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-red-400">Immediate Actions</h2>

          <div className="mt-5 space-y-4 text-slate-300">
            <p>1. Do not send any more money to the suspected scammer.</p>

            <p>2. Do not share OTPs, passwords, PINs or banking credentials.</p>

            <p>
              3. Save screenshots, phone numbers, messages and transaction
              details as evidence.
            </p>

            <p>
              4. Contact your bank immediately if a financial transaction has
              occurred.
            </p>

            <p>
              5. Report the incident to the appropriate cybercrime authorities.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <a
                href="https://cybercrime.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-500 hover:bg-red-400 text-white font-bold px-6 py-3 rounded-lg text-center transition"
              >
                Report Cybercrime
              </a>

              <a
                href="tel:1930"
                className="border border-red-500/50 text-red-400 hover:bg-red-500/10 font-bold px-6 py-3 rounded-lg text-center transition"
              >
                Call Cybercrime Helpline — 1930
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
