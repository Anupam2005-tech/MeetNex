"use client";
import { motion } from "framer-motion";
import { PhoneMockup } from "@/components/ui/PhoneMockUp";
import BounceCards from "@/components/ui/BounceCards";

const bounceImages = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400",
 
];

const bounceTransforms = [
  "rotate(5deg) translate(-100px)",
  "rotate(0deg) translate(-50px)",
  "rotate(-5deg)",
  "rotate(5deg) translate(50px)",
  "rotate(-5deg) translate(100px)"
];

// Reusable animation preset
const scrollReveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.8, ease: "easeOut" }
};

export function FeatureSection() {
  return (
    <section className="relative min-h-screen w-full bg-white flex flex-col items-center py-24 px-4 overflow-hidden">
      
      {/* GLOBAL DOTTED CONTAINER */}
      <div className="relative w-full max-w-7xl mx-auto border-x border-slate-500 border-dashed">
        
        {/* TOP ROW: HEADER */}
        <div className="relative py-20 px-8 text-center border-b border-slate-500 border-dashed overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(50%_50%_at_50%_0%,rgba(99,102,241,0.05)_0%,transparent_100%)]" />
          <motion.h1 
            {...scrollReveal}
            className="text-4xl md:text-6xl font-bold tracking-tight text-slate-950 mb-4 relative z-10"
          >
            MeetNex <span className="text-slate-400 font-medium tracking-tighter not-italic">Collaborative Power</span>
          </motion.h1>
          <motion.p 
            {...scrollReveal}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-slate-500 max-w-xl mx-auto text-base font-light relative z-10 leading-relaxed"
          >
            More than just a video call. A workspace that breathes with your team, 
            built for high-intensity file sharing and real-time AI assistance.
          </motion.p>
        </div>

        {/* MIDDLE ROW: 2-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
          
          {/* LEFT: FILE SHARING & DYNAMIC MEDIA GALLERY */}
          <div className="relative flex flex-col p-8 md:p-16 lg:border-r border-slate-200 border-dashed group overflow-hidden min-h-[700px]">
            <motion.div 
              {...scrollReveal}
              className="space-y-3 mb-12 flex-none relative z-20"
            >
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight ">Share & Collaborate.</h3>
              <p className="text-slate-500 text-sm max-w-xs font-light leading-relaxed">
                Experience seamless collaboration. Share media and assets directly within your <span className="text-indigo-600 font-medium">MeetNex</span> video call.
              </p>
            </motion.div>
            
            {/* COLLABORATION STACK */}
            <div className="flex-1 flex flex-col items-center space-y-8 relative z-10">
               
               {/* 1. TOP UI: FILE TRANSFER CARD */}
               <div className="w-full max-w-[320px]">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="bg-white p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-slate-100 flex items-center gap-4 relative"
                  >
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xs ring-1 ring-indigo-100">PDF</div>
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-slate-900">MeetNex_Project.pdf</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest">4.2 MB • Uploading</p>
                        <span className="text-[9px] font-bold text-indigo-600">85%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "85%" }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className="h-full bg-indigo-500"
                        />
                      </div>
                    </div>
                    {/* Floating Participant Preview */}
                    <div className="absolute -right-3 -top-3 w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-md">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user" />
                    </div>
                  </motion.div>
               </div>

               {/* 2. BOTTOM UI: BOUNCE CARDS GALLERY */}
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="w-full flex flex-col items-center"
                >
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">Recent Media Shared</p>
                  <div className="relative h-[250px] w-full flex items-center justify-center scale-90 sm:scale-100">
                    <BounceCards
                      images={bounceImages}
                      containerWidth={500}
                      containerHeight={250}
                      animationDelay={0.8}
                      animationStagger={0.08}
                      easeType="elastic.out(1, 0.5)"
                      transformStyles={bounceTransforms}
                      enableHover={true}
                    />
                  </div>
               </motion.div>
            </div>

            {/* Subtle Gradient Leak */}
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full" />
          </div>

          {/* RIGHT: AI CHATBOT SYSTEM */}
          <div className="relative flex flex-col p-8 md:p-16 bg-slate-50/40">
            <motion.div 
              {...scrollReveal}
              className="space-y-3 mb-12 flex-none"
            >
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight ">Neural Assistant.</h3>
              <p className="text-slate-500 text-sm max-w-xs font-light leading-relaxed">
                MeetNex AI integrates directly into your workflow to summarize meetings, 
                track tasks, and answer complex queries instantly.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative flex-1 flex items-end justify-center min-h-[500px]"
            >
              {/* Added a secondary glow for the phone */}
              <div className="absolute bottom-20 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full" />
              <PhoneMockup />
            </motion.div>
          </div>
        </div>

        {/* BOTTOM ROW: SUB-FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-slate-500 border-dashed bg-white">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-12 lg:border-r border-slate-500 border-dashed hover:bg-slate-50/50 transition-all group"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform" />
                    <h4 className="font-bold text-slate-900 tracking-tight text-sm uppercase">Global Infrastructure</h4>
                </div>
                <p className="text-slate-400 text-sm font-light leading-relaxed">Low-latency WebRTC nodes across 40+ regions for crystal clear video quality.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-12 hover:bg-slate-50/50 transition-all group"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-150 transition-transform" />
                    <h4 className="font-bold text-slate-900 tracking-tight text-sm uppercase">End-to-End Encryption</h4>
                </div>
                <p className="text-slate-400 text-sm font-light leading-relaxed">Your data and files never touch our servers unencrypted. Private and secure by design.</p>
            </motion.div>
        </div>
      </div>
    </section>
  );
}