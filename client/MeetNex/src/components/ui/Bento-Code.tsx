import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Terminal, Play, Sparkles, Check, RefreshCcw } from "lucide-react";

const SNIPPETS = [
  {
    title: "auth_protocol.ts",
    code: `const secureAuth = async (user) => {\n  const token = await Shield.gen(user.id);\n  return { status: "Verified", token };\n};`,
    output: "Key Generated: AES-512",
    color: "text-indigo-400"
  },
  {
    title: "neural_mesh.py",
    code: `def sync_nodes(nodes):\n    for node in nodes:\n        node.propagate(gradient=0.98)\n    return "Sync Complete"`,
    output: "Mesh Integrity: 100%",
    color: "text-emerald-400"
  },
  {
    title: "latency_fix.go",
    code: `func Optimize() {\n  edge.Route(FastestPath)\n  cache.WarmUp(Global)\n}`,
    output: "Latency: 0.42ms",
    color: "text-amber-400"
  }
];

export default function BentoCodeSystem() {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState("");
  const [isTyping, setIsTyping] = useState(true); // true = typing, false = erasing
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const currentFullCode = SNIPPETS[snippetIndex].code;
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      // TYPING LOGIC
      if (displayedCode.length < currentFullCode.length) {
        timeout = setTimeout(() => {
          setDisplayedCode(currentFullCode.slice(0, displayedCode.length + 1));
        }, 30); // Typing speed
      } else {
        // Finished typing
        setIsComplete(true);
        timeout = setTimeout(() => {
          setIsComplete(false);
          setIsTyping(false); // Switch to erasing after a delay
        }, 2000); // Pause to show the finished code
      }
    } else {
      // ERASING LOGIC
      if (displayedCode.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedCode(currentFullCode.slice(0, displayedCode.length - 1));
        }, 15); // Erasing speed (usually faster)
      } else {
        // Finished erasing
        setIsTyping(true);
        setSnippetIndex((prev) => (prev + 1) % SNIPPETS.length); // Next snippet
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedCode, isTyping, snippetIndex]);

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-transparent text-white">
      
      {/* 1. THE DYNAMIC TERMINAL */}
      <div className="md:col-span-2 relative group rounded-3xl border border-white/10 bg-[#050508]/60 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/40" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
              <div className="w-2 h-2 rounded-full bg-green-500/40" />
            </div>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <div className="flex items-center gap-2 text-[9px] font-mono tracking-[0.2em] text-neutral-500 uppercase italic">
              <Terminal size={12} className="text-indigo-500" />
              {SNIPPETS[snippetIndex].title}
            </div>
          </div>
          <div className="flex items-center gap-2">
             <RefreshCcw size={10} className={`text-neutral-600 ${!isComplete ? 'animate-spin' : ''}`} />
             <div className="text-[10px] font-mono text-neutral-500">v4.0.alpha</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 h-full min-h-[300px]">
          {/* Code Area */}
          <div className="lg:col-span-3 p-8 font-mono text-sm leading-relaxed bg-black/40">
            <div className="relative">
              <pre className={`${SNIPPETS[snippetIndex].color} transition-colors duration-500`}>
                <code>
                  {displayedCode}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-2 h-4 bg-white/50 ml-1 translate-y-0.5"
                  />
                </code>
              </pre>
            </div>
          </div>

          {/* Real-time Status Area */}
          <div className="lg:col-span-2 p-8 flex flex-col justify-center border-l border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
            <AnimatePresence mode="wait">
              {isComplete ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 text-indigo-400">
                    <div className="p-2 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                      <Check size={14} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Compiled Successfully</span>
                  </div>
                  
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-shimmer" />
                    <div className="text-[9px] text-neutral-500 mb-2 uppercase tracking-widest font-mono">Return_Output</div>
                    <div className="text-lg font-medium tracking-tight text-white drop-shadow-2xl">
                      {SNIPPETS[snippetIndex].output}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-neutral-600 gap-4"
                >
                  <div className="relative">
                    <Play size={20} className="text-indigo-500/50" />
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-indigo-500 rounded-full blur-xl"
                    />
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-[0.3em] animate-pulse">Processing Stream...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 2. SIDE CARD: PERSISTENT METRIC */}
      <div className="rounded-3xl border border-white/10 bg-[#050508]/60 backdrop-blur-xl p-8 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-[50px] group-hover:bg-indigo-500/20 transition-all duration-700" />
        
        <div className="relative z-10">
          <div className="p-3 w-fit rounded-xl bg-white/5 border border-white/10 text-indigo-400 mb-8 group-hover:rotate-12 transition-transform duration-500">
            <Sparkles size={20} />
          </div>
          <h3 className="text-xl font-medium tracking-tight mb-3">Live Propagation</h3>
          <p className="text-xs text-neutral-500 leading-relaxed font-light">
            Automated deployment sync across decentralized clusters.
          </p>
        </div>

        <div className="relative z-10 pt-10">
          <div className="flex justify-between items-end mb-3">
            <div className="space-y-1">
              <span className="block text-[9px] font-mono text-neutral-600 uppercase">Load Balance</span>
              <span className="text-xl font-mono text-white">0.0042<span className="text-[10px] text-indigo-500">ms</span></span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [8, 16, 8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1 bg-indigo-500/40 rounded-full"
                />
              ))}
            </div>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div 
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" 
             />
          </div>
        </div>
      </div>
    </div>
  );
}