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
              ? "w-[85%] lg:w-[30%] max-w-4xl h-12 rounded-full bg-black/90 border border-zinc-800 justify-between gap-4"
              : "w-full max-w-7xl h-16 bg-black/80 justify-between gap-8"
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

      {/* MOBILE MENU - Sleek Monochromatic Drawer */}
      {open && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 lg:hidden z-40"
            onClick={() => setOpen(false)}
            style={{
              animation: 'fadeIn 0.2s ease-out'
            }}
          />
          
          {/* Drawer */}
          <div 
            className="fixed top-0 left-0 h-full w-[240px] bg-black border-r border-zinc-800 lg:hidden z-50"
            style={{
              animation: 'slideInLeft 0.25s ease-out'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-end px-4 py-3 border-b border-zinc-800">
              <button
                onClick={() => setOpen(false)}
                className="h-7 w-7 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col p-3 gap-1">
              
              {/* Star Us */}
              <Link 
                to={gitPage} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-zinc-900 transition-colors group"
              >
                <Github size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Star on GitHub</span>
              </Link>

              {/* Sign In */}
              <Link 
                to="/login" 
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-zinc-900 transition-colors group"
              >
                <div className="h-4 w-4 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white transition-colors">IN</span>
                </div>
                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Sign In</span>
              </Link>

              {/* Divider */}
              <div className="h-px bg-zinc-800 my-1" />

              {/* Sign Up - Emphasized */}
              <Link 
                to="/register" 
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-white text-black hover:bg-zinc-200 transition-colors"
              >
                <span className="text-[10px] font-bold">UP</span>
                <span className="text-sm font-medium">Sign Up</span>
              </Link>

            </div>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @keyframes slideInLeft {
              from { transform: translateX(-100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </>
      )}
    </nav>
  );
};

export default Navbar;