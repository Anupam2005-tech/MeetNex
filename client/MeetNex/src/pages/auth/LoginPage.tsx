import { useEffect, useRef } from "react";
import LoginForm from "@/components/forms/LoginForm";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { Zap, Shield } from "lucide-react";
import { showToast } from "@/components/ui/Toast";

function LoginPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toastFired = useRef(false); 

  useEffect(() => {
    if (isLoaded && isSignedIn) navigate("/home");

    if (isLoaded && !isSignedIn && !toastFired.current) {
      const reason = searchParams.get("reason");
      
      if (reason === "auth") {
        showToast.error(
          "ACCESS RESTRICTED", 
          "Identity verification required for secure meeting links."
        );
        toastFired.current = true;
      }
    }
  }, [isLoaded, isSignedIn, navigate, searchParams]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen w-full bg-[#f0f0f2] p-4 lg:p-8 flex items-center justify-center font-outfit">
      {/* MAIN CONTAINER */}
      <div className="w-full max-w-[1440px] h-full lg:h-[85vh] bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col lg:flex-row border border-white relative">
        
        {/* ================= LEFT: THE FEATURE BLADE (38%) ================= */}
        <div className="lg:w-[38%] bg-[#0a0a0b] p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden z-10">
          
          <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-20">
            <Logo />
          </div>

          <div className="relative z-20 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-zinc-500 text-[10px] uppercase tracking-[0.25em] font-bold"
            >
              <Zap size={12} className="text-zinc-400" />
              Core Protocol v1.0
            </motion.div>
            
            <h1 className="text-6xl font-bold tracking-tighter text-white leading-[0.95]">
              Beyond <br />
              <span className="text-zinc-600">Sync.</span>
            </h1>
            
            <div className="space-y-5 pt-4">
              {[
                { icon: <Shield size={18}/>, text: "End-to-End Encryption" },
                { icon: <Zap size={18}/>, text: "Sub-10ms Global Latency" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-zinc-500 hover:text-zinc-300 transition-colors cursor-default group">
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 group-hover:border-indigo-500/50 transition-all">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium tracking-tight">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-20 flex items-center gap-4">
             <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[10px] text-zinc-700 uppercase tracking-widest font-bold">
               Gateway Secured
             </p>
          </div>
        </div>

        {/* ================= THE BLENDING PARTITION ================= */}
        <div className="hidden lg:block absolute left-[38%] top-0 bottom-0 w-32 z-20 pointer-events-none">
            <div className="absolute inset-0 bg-[#0a0a0b] origin-top-left -skew-x-[4deg] transform translate-x-[-50%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b] to-transparent opacity-20 blur-xl translate-x-[-20%]" />
        </div>

        {/* ================= RIGHT: THE ACTION SPACE (62%) ================= */}
        <div className="flex-1 bg-white relative flex flex-col items-center justify-center p-8 lg:p-20 z-10">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-[420px] lg:ml-20"
          >
        
            <div className="relative group">
              <div className="absolute -inset-6 bg-zinc-50/50 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
              <LoginForm />
            </div>

            <div className="mt-12 flex items-center justify-between border-t border-zinc-100 pt-8">
              <span className="text-xs text-zinc-400">Secure Node Login</span>
              <span className="text-[10px] font-black text-zinc-300 tracking-[0.2em] uppercase">MeetNeX Systems v.25</span>
            </div>
          </motion.div>

          <div className="absolute top-16 right-16 hidden xl:block overflow-hidden h-32">
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="text-[9px] font-bold text-zinc-200 uppercase tracking-[0.6em] [writing-mode:vertical-lr]"
            >
              LUMI ENCRYPTED LINK
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;