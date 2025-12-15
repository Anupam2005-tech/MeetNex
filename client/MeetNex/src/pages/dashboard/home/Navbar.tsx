import { useState } from "react";
import { Menu, X,Github } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

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

            <span className="text-2xl font-bold text-white tracking-tight cursor-pointer">
              Meet<span className="text-indigo-400">Nex</span>
            </span>
          </div>

          {/* DESKTOP BUTTONS */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10 transition cursor-pointer"
            >
                <Github size={14} />
             
              Star Us
            </button>

            <button
              className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10 transition cursor-pointer"
            >
              Sign In
            </button>

            <button
              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black hover:bg-white/90 transition cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="lg:hidden bg-black/90 border-t border-white/10 px-4 py-3 space-y-2">
          <button className="flex items-center gap-1.5 text-xs font-semibold text-white cursor-pointer">
            <Github size={14} />
            Star Us
          </button>

          <button className="block text-xs font-semibold text-white cursor-pointer">
            Sign In
          </button>

          <button className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-black cursor-pointer">
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
