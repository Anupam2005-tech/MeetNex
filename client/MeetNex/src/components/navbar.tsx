import { useEffect, useState } from "react";
import { Menu, X, UserPlus, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolledUp, setScrolledUp] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolledUp(currentY < lastScrollY || currentY < 20);
      lastScrollY = currentY;
      setScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 md:top-4 left-1/2 z-50 transform -translate-x-1/2 transition-all duration-300 
        w-full md:left-1/2 md:transform md:-translate-x-1/2 
        ${
          scrolledUp ? "md:w-[90%] lg:w-[50%]" : "md:w-[40%] lg:w-[30%]"
        }
        bg-black/30 border border-white/10 backdrop-blur-lg shadow-lg 
        rounded-none md:rounded-full
      `}
    >
      <div
        className={`flex items-center justify-between px-6 ${
          scrollY > 10 ? "py-3" : "py-4"
        } transition-all duration-300`}
      >
        <div className="flex items-center space-x-4">
          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white">
            <span className="text-lg font-bold">Startup</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden space-x-4 md:flex items-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-transform duration-200 ease-in-out transform hover:-translate-y-[0.05rem]"
          >
            <LogIn size={16} />
            Login
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200 transition-transform duration-200 ease-in-out transform hover:-translate-y-[0.05rem]"
          >
            <UserPlus size={16} />
            Register
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden space-y-4 px-6 py-4 bg-black/60 backdrop-blur-md border-t border-white/10 shadow-lg rounded-b-xl">
          <Link
            to="/login"
            onClick={() => setIsMobileOpen(false)}
            className="block text-gray-300 hover:text-white"
          >
            <LogIn size={16} className="inline mr-2" />
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setIsMobileOpen(false)}
            className="block text-gray-300 hover:text-white"
          >
            <UserPlus size={16} className="inline mr-2" />
            Register
          </Link>
        </div>
      )}
    </header>
  );
}
