export default function Logo() {
  return (
    <div className="relative flex items-center select-none antialiased group cursor-pointer">
      <div className="flex items-center tracking-[-0.06em] transition-all duration-300">
        {/* "Meet" - Adapts to Light/Dark text colors */}
        <span className="text-zinc-900 dark:text-zinc-50 inline-block font-medium tracking-tighter">
          Meet
        </span>

        {/* "Nex" - Refined Monotonic Gradient */}
        <span 
          className="font-black ml-[1px] transform scale-x-[0.96] bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(180deg, 
              #71717a 0%, 
              #18181b 100%)`, // For Light mode
          }}
        >
          Nex
        </span>
      </div>
      
     
    </div>
  );
}