export default function Logo() {
  return (
    <div className="relative flex items-center gap-2.5 px-2 py-1.5 w-fit group cursor-default select-none transition-all duration-300">
      
      {/* 1. BACKGROUND SCHEMATIC GRID */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_0.5px,transparent_0.5px)] dark:bg-[radial-gradient(#3f3f46_0.5px,transparent_0.5px)] [background-size:6px_6px] opacity-20" />
        <div className="absolute left-[40px] top-0 bottom-0 w-[0.5px] bg-gradient-to-b from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
      </div>

      {/* 2. ICON WITH LAYERED ELEVATION */}
      <div className="relative flex h-8 w-8 items-center justify-center z-10">
        {/* Main Icon Shadow - Deep but soft for hardware feel */}
        <div className="absolute inset-0 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-shadow duration-300" />
        
        {/* Outer Housing */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-800 dark:to-zinc-950 border-[0.5px] border-zinc-200 dark:border-zinc-700 shadow-[inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
        
        {/* Internal Aperture Ring */}
        <div className="absolute inset-[3px] rounded-full border-[0.5px] border-zinc-300/50 dark:border-zinc-700/30 bg-zinc-100/50 dark:bg-zinc-900/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]" />

        {/* AI Sensor Chip */}
        <div className="relative h-4 w-4 bg-zinc-950 rounded-[1px] overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center border-[0.5px] border-zinc-700">
          <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#555_0.5px,transparent_0.5px),linear-gradient(to_bottom,#555_0.5px,transparent_0.5px)] bg-[size:2px_2px]" />
          <div className="relative z-20">
            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M7 17V7l10 10V7" className="drop-shadow-[0_0_3px_rgba(255,255,255,0.6)]" />
            </svg>
          </div>
          <div className="absolute inset-0 z-30 bg-[linear-gradient(120deg,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
        </div>

        {/* Focus Brackets */}
        <div className="absolute inset-[1px] pointer-events-none opacity-60 dark:opacity-40">
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-[0.5px] border-l-[0.5px] border-zinc-900 dark:border-zinc-400" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-[0.5px] border-r-[0.5px] border-zinc-900 dark:border-zinc-400" />
          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-[0.5px] border-l-[0.5px] border-zinc-900 dark:border-zinc-400" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-[0.5px] border-r-[0.5px] border-zinc-900 dark:border-zinc-400" />
        </div>
      </div>

      {/* 3. TYPOGRAPHY SECTION WITH SHADOW */}
      <div className="relative flex flex-col -space-y-1 z-10">
        <div className="flex items-center gap-1.5">
          {/* Added 'drop-shadow-sm' to make text crisp on light/dark colors */}
          <span className="text-[18px] font-extrabold tracking-[-0.05em] text-zinc-900 dark:text-white leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            Meet<span className="text-zinc-400 dark:text-zinc-500 font-bold">NeX</span>
          </span>
          
          <div className="flex flex-col justify-center">
            <span className="text-[4px] font-mono text-zinc-400 dark:text-zinc-600 leading-none tracking-tight uppercase">AI-CORE</span>
            <div className="flex items-center gap-0.5">
               <div className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] animate-pulse" />
               <span className="text-[4px] font-mono text-emerald-600 dark:text-emerald-500 leading-none tracking-tight font-bold">READY</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[6px] font-extrabold tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
            video calling
          </span>
          <div className="h-[1px] w-full bg-zinc-100 dark:bg-zinc-800/50 flex-1 min-w-[12px]" />
          <span className="text-[5px] font-mono text-zinc-300 dark:text-zinc-700">v2.1</span>
        </div>
      </div>
    </div>
  );
}