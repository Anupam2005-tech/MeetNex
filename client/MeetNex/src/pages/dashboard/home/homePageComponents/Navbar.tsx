import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Github } from "lucide-react";
import { LinkPreview } from "@/components/ui/Link-preview";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const gitPage=import.meta.env.VITE_GITHUB_PAGE_LINK;

  return (
    <nav className="fixed top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">

          {/* LEFT: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden text-white cursor-pointer"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link
              to="/"
              className="text-2xl font-bold text-white tracking-tight"
            >
              Meet<span className="text-indigo-400">Nex</span>
            </Link>
          </div>

          {/* DESKTOP BUTTONS */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to={gitPage} target="_blank" rel="noopener noreferrer">
              <button
                className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10 transition cursor-pointer"
              >
                <Github size={14} />
                Star Us
              </button>
            </Link>

            {/* LOGIN */}
            <Link to="/login">
              <button
                className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10 transition cursor-pointer"
              >
                Sign In
              </button>
            </Link>

            {/* REGISTER */}
            <Link to="/register">
              <button
                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black hover:bg-white/90 transition cursor-pointer"
              >
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="lg:hidden bg-black/90 border-t border-white/10 px-4 py-3 space-y-2">
       <Link to={gitPage} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
          <button className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10 transition cursor-pointer">
            <Github size={14} />
            Star Us
          </button>
        </Link>

          {/* LOGIN */}
          <Link to="/login" onClick={() => setOpen(false)}>
            <button className="block text-xs font-semibold text-white cursor-pointer">
              Sign In
            </button>
          </Link>

          {/* REGISTER */}
          <Link to="/register" onClick={() => setOpen(false)}>
            <button className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-black cursor-pointer">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
