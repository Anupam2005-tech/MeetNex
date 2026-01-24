import RegisterForm from "@/components/forms/RegisterForm";
import Logo from "@/components/ui/Logo";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";

function RegisterPage() {
  const features = [
    { icon: <Zap size={18} />, text: "<5ms latency infrastructure" },
    { icon: <ShieldCheck size={18} />, text: "End-to-end encryption" },
    { icon: <CheckCircle2 size={18} />, text: "Seamless multi-platform synchronization" },
  ];

  return (
    <div className="min-h-screen w-full flex bg-neutral-50">
      {/* ================= LEFT BRAND SECTION (SaaS Aesthetic) ================= */}
      <div className="hidden lg:flex relative w-[45%] flex-col justify-between px-20 py-16 bg-neutral-200 border-r border-zinc-200/60">
        
        {/* Sublte Background Element */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none " 
             style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

        {/* TOP LOGO */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <Logo />
        </motion.div>

        {/* CENTER CONTENT */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-6">
              Platform Access v1.0
            </span>
            <h1 className="text-6xl font-semibold tracking-tight text-zinc-900 leading-[0.95]">
              Design your <br />
              <span className="text-zinc-400">digital workspace.</span>
            </h1>
            <p className="mt-8 text-zinc-500 text-lg font-light leading-relaxed max-w-sm">
              Connect with teams globally through our distributed meeting protocol. Simple, fast, and remarkably secure.
            </p>
          </motion.div>

          {/* Feature List */}
          <div className="mt-12 space-y-5">
            {features.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="flex items-center gap-4 text-zinc-600"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-200/50 text-zinc-900">
                  {item.icon}
                </div>
                <span className="text-sm font-medium tracking-tight">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="relative z-10 flex items-center justify-between">
          <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
            © {new Date().getFullYear()} MeetNeX Protocol
          </p>
          
        </div>
      </div>

      {/* ================= RIGHT REGISTER SECTION (Monotonic Clean) ================= */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 relative overflow-hidden">
        
        {/* Floating Ambient Glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-200/40 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
            <RegisterForm />

        </motion.div>
      </div>
    </div>
  );
}

export default RegisterPage;