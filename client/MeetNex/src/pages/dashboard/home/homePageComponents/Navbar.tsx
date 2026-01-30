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

      {/* MOBILE MENU - LinkedIn Style Horizontal Bar */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-black/95 border-b border-white/10 p-4 shadow-2xl lg:hidden">
          <div className="flex items-center justify-around gap-4 px-2">
            
            <Link to={gitPage} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="flex flex-col items-center gap-1">
              <div className="h-10 w-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white">
                <Github size={20} />
              </div>
              <span className="text-[10px] font-medium text-zinc-400">Star Us</span>
            </Link>

            <Link to="/login" onClick={() => setOpen(false)} className="flex flex-col items-center gap-1">
              <div className="h-10 w-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white">
                <span className="text-xs font-bold">IN</span>
              </div>
              <span className="text-[10px] font-medium text-zinc-400">Sign In</span>
            </Link>

            <Link to="/register" onClick={() => setOpen(false)} className="flex flex-col items-center gap-1">
               <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-black">
                 <span className="text-xs font-bold">UP</span>
               </div>
               <span className="text-[10px] font-medium text-zinc-400">Sign Up</span>
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;