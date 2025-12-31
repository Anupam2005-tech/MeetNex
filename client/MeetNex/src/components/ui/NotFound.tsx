import { motion } from "framer-motion";
import { ShieldAlert, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";


export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f0f2] p-6 font-outfit antialiased">
      {/* BACKGROUND DECOR - Keeping it consistent with your Login Page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-zinc-400/[0.05] blur-[150px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[520px] rounded-[40px] bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-white p-12 overflow-hidden z-10"
      >
        {/* THE "SASSY" ACCENT: A thin, elegant scanning line */}
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-24 bg-zinc-900 rounded-b-full"
        />

        <div className="flex flex-col items-center text-center gap-8">
          {/* ICON SECTION */}
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="flex items-center justify-center h-20 w-20 rounded-[24px] bg-zinc-50 border border-zinc-100 shadow-inner"
            >
              <ShieldAlert className="h-9 w-9 text-zinc-900 stroke-[1.5]" />
            </motion.div>
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white" />
          </div>

          {/* TEXT SECTION */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-bold">
              Status: 404 • Page Not Found
            </div>
            <h1 className="text-4xl font-semibold text-zinc-900 tracking-tight leading-tight">
              Protocol <br />
              <span className="text-zinc-400">Suspended.</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
              No page matches the route
            </p>
          </div>

          {/* ACTION SECTION */}
          <div className="flex justify-center  w-full gap-3 pt-4">

            <button 
              onClick={() => navigate("/")}
              className="w-fit h-fit bg-transparent text-zinc-400 hover:text-zinc-900 text-[10px] font-bold uppercase tracking-widest transition-colors flex  gap-2 hover:cursor-pointer hover:underline"
            >
              <Home size={12} />
              Return to Core
            </button>
          </div>
        </div>

        {/* FOOTER LOGO */}
        <div className="mt-12 flex justify-center ">
           <Logo/>
        </div>
      </motion.div>
    </div>
  );
}