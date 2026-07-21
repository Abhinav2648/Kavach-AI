import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    if (isSignup && !name) {
      alert("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);

        alert("Account created successfully!");

        // Switch to login after successful signup
        setIsSignup(false);
        setPassword("");
      } else {
        await signInWithEmailAndPassword(auth, email, password);

        alert("Login successful!");

        // Redirect to scan page
        window.location.href = "/scan";
      }
    } catch (error) {
      console.error("Firebase Authentication Error:", error);

      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered. Please login.");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        alert("Password must be at least 6 characters.");
      } else if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        alert("Invalid email or password.");
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="login"
      className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-24"
    >
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-white text-center">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <p className="text-slate-400 text-center mt-2 mb-8">
          {isSignup
            ? "Create your KAVACH AI account"
            : "Login to continue to KAVACH AI"}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition"
          >
            {loading
              ? "Please wait..."
              : isSignup
                ? "Sign Up"
                : "Login"}
          </button>
        </form>

        <p className="text-slate-400 text-center mt-6 text-sm">
          {isSignup
            ? "Already have an account? "
            : "Don't have an account? "}

          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setPassword("");
            }}
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </section>
  );
};

export default Login;