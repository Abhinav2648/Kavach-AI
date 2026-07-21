import { useEffect, useState } from "react";
import { Shield, Menu, X } from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const handleNavClick = (item) => {
    const section = document.getElementById(item.toLowerCase());

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    window.history.replaceState(null, "", `#${item.toLowerCase()}`);
    setIsOpen(false);
  };

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");

      // Redirect to home page
      window.location.hash = "home";
      setIsOpen(false);
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-cyan-400" strokeWidth={2.5} />

            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              KAVACH AI
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {["Home", "Features", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => handleNavClick(item)} 
                className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium tracking-wide"
              >
                {item}
              </a>
            ))}

            {/* Login / Logout */}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-transparent border border-red-500/50 text-red-400 px-6 py-2 rounded-full hover:bg-red-500/10 transition-all font-semibold text-sm"
              >
                Logout
              </button>
            ) : (
              <a
                href="#login"
                className="bg-transparent border border-cyan-500/50 text-cyan-400 px-6 py-2 rounded-full hover:bg-cyan-500/10 transition-all font-semibold text-sm"
              >
                Login
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-6 space-y-4">
          {["Home", "Features", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => handleNavClick(item)}
              className="block text-slate-300 hover:text-cyan-400"
            >
              {item}
            </a>
          ))}

          {/* Mobile Login / Logout */}
          {user ? (
            <button
              onClick={handleLogout}
              className="block w-full text-center bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-bold"
            >
              Logout
            </button>
          ) : (
            <a
              href="#login"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-lg font-bold"
            >
              Login
            </a>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
