import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Github, ArrowRight } from "lucide-react";
import Logo from "@/components/ui/Logo";
import LoginPage from "@/pages/auth/LoginPage";
import LinkPreview from "@/components/ui/Link-preview";
import RegisterPage from "@/pages/auth/RegisterPage";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const gitPage = import.meta.env.VITE_GITHUB_PAGE_LINK || "https://github.com";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full flex justify-center pt-6 px-4 transition-all duration-500">
        <div
          className={`
            relative flex items-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
            backdrop-blur-xl border shadow-lg
            ${
              isScrolled
                ? "w-[90%] md:w-[70%] lg:w-[35%] h-14 rounded-full bg-black/40 border-white/10 justify-between px-2 pl-6"
                : "w-full max-w-7xl h-20 rounded-2xl bg-black/0 border-transparent justify-between px-2 md:px-6"
            }
          `}
        >
          {/* --- LEFT: Logo --- */}
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className={`transition-all duration-500 ${isScrolled ? "scale-90" : "scale-100"}`}
            >
              <Logo />
            </Link>
          </div>

          {/* --- RIGHT (Desktop): Buttons --- */}
          <div className={`hidden lg:flex items-center transition-all duration-500 ${isScrolled ? "gap-2" : "gap-4"}`}>
            
            {/* Github Star */}
            <LinkPreview url={gitPage}>
              <div className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold text-zinc-300 hover:bg-white/10 hover:text-white hover:border-white/30 transition-all cursor-pointer uppercase tracking-widest backdrop-blur-md">
                <Github size={12} className="group-hover:rotate-12 transition-transform duration-300" />
                <span className="hidden xl:block">Star Us</span>
              </div>
            </LinkPreview>

            {/* Login */}
            <LinkPreview url="/login" previewComponent={<LoginPage />}>
              <div className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-bold text-white/80 hover:text-white transition-colors cursor-pointer uppercase tracking-widest">
                Sign In
              </div>
            </LinkPreview>

            {/* Register */}
            <LinkPreview url="/register" previewComponent={<RegisterPage />}>
              <div 
                className={`
                  rounded-full bg-white font-bold text-black transition-all cursor-pointer uppercase tracking-widest flex items-center justify-center hover:scale-105 active:scale-95
                  ${isScrolled ? "px-5 py-2 text-[10px]" : "px-6 py-2.5 text-xs"}
                `}
              >
                Join
              </div>
            </LinkPreview>
          </div>

          {/* --- RIGHT (Mobile/Tab): Hamburger --- */}
          <div className="lg:hidden pr-2">
            <button
              onClick={() => setOpen(!open)}
              className={`
                relative group flex items-center justify-center w-10 h-10 rounded-full 
                transition-all duration-300 
                ${open ? "bg-white text-black rotate-90" : "bg-white/10 text-white hover:bg-white/20"}
              `}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE OVERLAY (Sassy Full Screen) --- */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-2xl lg:hidden flex flex-col justify-center items-center"
          style={{ animation: 'fadeIn 0.4s ease-out' }}
        >
          {/* Background Decorative Gradient */}
          <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="w-full max-w-sm px-8 flex flex-col gap-6 z-50">
            
            {/* Menu Links */}
            <div className="flex flex-col gap-6 text-center">
              <Link 
                to="/login" 
                onClick={() => setOpen(false)}
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 hover:to-white transition-all tracking-tight animate-slide-up"
                style={{ animationDelay: '0.1s' }}
              >
                Sign In
              </Link>
              
              <Link 
                to="/register" 
                onClick={() => setOpen(false)}
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 hover:to-white transition-all tracking-tight animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              >
                Sign Up
              </Link>

              <Link 
                to={gitPage}
                target="_blank"
                onClick={() => setOpen(false)}
                className="text-3xl font-bold text-zinc-500 hover:text-white transition-colors tracking-tight animate-slide-up flex items-center justify-center gap-3"
                style={{ animationDelay: '0.3s' }}
              >
                <Github size={24} />
                <span>GitHub</span>
              </Link>
            </div>

            <div className="w-full h-px bg-white/10 my-4 animate-scale-x" />

            {/* Premium CTA Card */}
            <Link 
              to="/register" 
              onClick={() => setOpen(false)}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 animate-slide-up"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="relative z-10 flex justify-between items-center text-black">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60">Get Started</span>
                  <span className="text-xl font-bold">Create Account</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight size={18} />
                </div>
              </div>
              {/* Hover splash effect */}
              <div className="absolute inset-0 bg-zinc-100 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 -z-0" />
            </Link>
            
          </div>
        </div>
      )}

      {/* --- CUSTOM ANIMATIONS --- */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-x {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0; /* Start hidden for delay to work */
        }
        .animate-scale-x {
          animation: scale-x 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
};

export default Navbar;