import React from "react";
import { Github, Linkedin, Twitter, Youtube } from "lucide-react";
import StyledButton from "@/components/ui/buttons/StyledButton";

function Footer() {
  return (
    <footer className="relative bg-[#0b0b0f] text-white overflow-hidden">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      {/* CTA SECTION */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Graphic Placeholder */}
          <div className="relative hidden lg:block">
            <div className="h-[320px] w-[320px] rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-2xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-40 w-40 rounded-2xl bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center text-4xl font-bold">
                NX
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Join the <br /> Movement
            </h2>

            <p className="mt-6 max-w-xl text-gray-400 text-base sm:text-lg">
              Unlock the future of collaboration with MeetNX.
              Build, meet, and connect — all in one powerful virtual workspace.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
             <StyledButton text="See in Action" />

              <button className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition flex items-center gap-2">
                <span className="text-sm">Join our community</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left */}
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} MeetNeX. All rights reserved.
          </p>

          {/* Center Links */}
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Security</a>
          </div>

          {/* Right Socials */}
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-white transition">
              <Github size={18} />
            </a>
            <a href="#" className="hover:text-white transition">
              <Linkedin size={18} />
            </a>
            <a href="#" className="hover:text-white transition">
              <Twitter size={18} />
            </a>
            <a href="#" className="hover:text-white transition">
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
