import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Github } from "lucide-react";
import Logo from "@/components/ui/Logo";
import LoginPage from "@/pages/auth/LoginPage";
import  LinkPreview  from "@/components/ui/Link-preview";
import RegisterPage from "@/pages/auth/RegisterPage";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const gitPage = import.meta.env.VITE_GITHUB_PAGE_LINK || "https://github.com";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full flex justify-center p-4 transition-all duration-500">
      <div
        className={`
          flex items-center transition-all duration-500 ease-in-out px-6
          ${
            isScrolled
              ? "w-[85%] lg:w-[30%] max-w-4xl h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 justify-between gap-4"
              : "w-full max-w-7xl h-16 bg-transparent justify-between gap-8"
          }
        `}
      >
        {/* LEFT: Hamburger + Logo */}
        <div className={`flex items-center transition-all duration-500 ${isScrolled ? "gap-2" : "gap-4"}`}>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white cursor-pointer"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link to="/" className={`transition-all duration-500 ${isScrolled ? "scale-90" : "scale-100"}`}>
            <Logo />
          </Link>
        </div>

        {/* DESKTOP BUTTONS */}
        <div className={`hidden lg:flex items-center transition-all duration-500 ${isScrolled ? "gap-3" : "gap-6"}`}>
          
          {/* STAR US LINK PREVIEW */}
          <LinkPreview url={gitPage}>
            <div className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold text-white hover:bg-white/10 transition cursor-pointer uppercase tracking-wider">
              <Github size={12} />
              Star Us
            </div>
          </LinkPreview>

          {/* LOGIN LINK PREVIEW */}
          <LinkPreview url="/login" previewComponent={<LoginPage/>}>
            <div className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold text-white hover:bg-white/10 transition cursor-pointer uppercase tracking-wider">
              Sign In
            </div>
          </LinkPreview>

          {/* REGISTER LINK PREVIEW */}
          <LinkPreview url="/register" previewComponent={<RegisterPage/>}>
            <div className={`rounded-full bg-white font-semibold text-black transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center ${
                isScrolled ? "px-3 py-1 text-[10px]" : "px-3 py-1 text-xs"
              }`}>
              Sign Up
            </div>
          </LinkPreview>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[90%] lg:hidden bg-black/95 border border-white/10 rounded-2xl p-4 space-y-3 shadow-2xl">
          <Link to={gitPage} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            <button className="flex items-center justify-center gap-1.5 rounded-full border border-white/20 w-full py-2 text-xs font-semibold text-white">
              <Github size={14} />
              Star Us
            </button>
          </Link>

          <Link to="/login" onClick={() => setOpen(false)} className="block text-center">
            <span className="text-xs font-semibold text-white">Sign In</span>
          </Link>

          <Link to="/register" onClick={() => setOpen(false)}>
            <button className="w-full rounded-full bg-white py-2 text-xs font-semibold text-black mt-2">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;