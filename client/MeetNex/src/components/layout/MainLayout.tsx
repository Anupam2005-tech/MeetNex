import { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./Sidebar";
import {
  IconVideo,
  IconPlus,
  IconClock,
  IconMessage2Bolt,
  IconUser,
  IconUsers,
  IconChevronDown
} from "@tabler/icons-react";
import MainLayoutText from "./MainLayoutText";
import { Link, useNavigate } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { Modal } from "../ui/Modal"; 
import RoomID from "@/pages/meeting/RoomID";
import { motion, AnimatePresence } from "framer-motion";

// FIXED LOGO: Standard structure to prevent recursion errors
const BrandLogo = () => (
  <Link to="/" className="flex items-center gap-3 px-2 group">
    <div className="h-9 w-9 rounded-xl bg-zinc-900 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
      <span className="text-white font-bold text-xl select-none">*</span>
    </div>
    <span className="text-xl font-bold tracking-tighter text-zinc-900">MeetNeX</span>
  </Link>
);

const CurrentDateTime = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  
  return (
    <div className="flex items-center gap-2 font-medium">
      <span className="text-zinc-900">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      <span className="text-zinc-300">|</span>
      <span className="text-zinc-500">{now.toLocaleDateString([], { day: '2-digit', month: 'short' })}</span>
    </div>
  );
};

export function MainLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [meetingDropdownOpen, setMeetingDropdownOpen] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>("Home");
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const links = [
    {
      label: "Meetings",
      icon: <IconVideo className="h-5 w-5" />,
      dropdown: [
        { label: "Instant Meeting", icon: <IconPlus className="h-4 w-4" /> },
        { label: "Schedule", icon: <IconClock className="h-4 w-4" /> },
      ],
    },
    { label: "Lumi AI", to: "/lumi/chat", icon: <IconMessage2Bolt className="h-5 w-5" /> },
  ];

  const handleSubLinkClick = (subLabel: string) => {
    if (subLabel === "Instant Meeting") setPendingRoute("instant");
    else if (subLabel === "Schedule") setIsScheduleModalOpen(true);
  };

  const createMeetingAndNavigate = (mode: "p2p" | "sfu") => {
    const backendRoomId = Math.random().toString(36).substring(2, 10).toUpperCase(); 
    navigate(`/room/${backendRoomId}?type=${mode}`);
    setPendingRoute(null);
  };

  return (
    <div className="flex h-screen w-full bg-[#F9F9FB] overflow-hidden relative font-sans antialiased">
      
      {/* SELECTION OVERLAY (Architecture Choice) */}
      <AnimatePresence>
        {pendingRoute === "instant" && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center max-w-2xl w-full px-8"
            >
              <h2 className="text-4xl font-bold text-zinc-900 mb-10 tracking-tighter">Select Architecture</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {[
                  { mode: "p2p", label: "Direct 1:1", desc: "Peer-to-Peer Mesh", icon: <IconUser size={24}/> },
                  { mode: "sfu", label: "Group Call", desc: "Global SFU Relay", icon: <IconUsers size={24}/> }
                ].map((opt) => (
                  <button
                    key={opt.mode}
                    onClick={() => createMeetingAndNavigate(opt.mode as any)}
                    className="flex flex-col items-start gap-4 p-8 bg-white border border-zinc-200 rounded-[32px] hover:border-zinc-900 transition-all group shadow-sm hover:shadow-xl"
                  >
                    <div className="p-3 rounded-xl bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                        {opt.icon}
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-xl text-zinc-900">{opt.label}</div>
                        <div className="text-xs text-zinc-400 uppercase tracking-widest mt-1">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setPendingRoute(null)} className="mt-12 text-zinc-400 hover:text-zinc-900 font-bold uppercase text-[10px] tracking-widest transition-colors border-b border-zinc-200 pb-1">
                Back to Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-8 bg-white border-r border-zinc-200/50">
          <div className="flex flex-1 flex-col overflow-y-auto px-4 py-8">
            <BrandLogo />
            
            <div className="mt-12 flex flex-col gap-1.5">
              {links.map((link, idx) => {
                const isActive = selected === link.label;
                const isDropdownOpen = meetingDropdownOpen === link.label;

                return (
                  <div key={idx} className="w-full">
                    <button
                      onClick={() => {
                        if (link.dropdown) setMeetingDropdownOpen(isDropdownOpen ? null : link.label);
                        setSelected(link.label);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                        ${isActive 
                          ? "bg-zinc-900 text-white shadow-lg" 
                          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {link.icon}
                        <span className="text-sm font-semibold">{link.label}</span>
                      </div>
                      {link.dropdown && (
                        <IconChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      )}
                    </button>

                    <AnimatePresence>
                      {link.dropdown && isDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                          className="ml-6 mt-1.5 flex flex-col gap-1 border-l-2 border-zinc-100 pl-4 py-1"
                        >
                          {link.dropdown.map((sub, i) => (
                            <button
                              key={i}
                              onClick={() => handleSubLinkClick(sub.label)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all text-left"
                            >
                              {sub.icon}
                              {sub.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* USER PROFILE SECTION */}
          <div className="px-4 pb-8">
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center hover:bg-zinc-100 transition-colors">
              <UserButton 
                showName 
                appearance={{ 
                  elements: { 
                    userButtonOuterIdentifier: "text-[13px] font-bold text-zinc-800",
                    userButtonBox: "flex-row-reverse"
                  } 
                }} 
              />
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* MAIN CONTENT STAGE */}
      <main className="relative flex-1 flex flex-col p-8 overflow-hidden bg-white">
        <div className="absolute right-12 top-10 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-zinc-200/60 text-[11px] font-bold text-zinc-500 tracking-widest uppercase shadow-sm z-50">
          <CurrentDateTime />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <MainLayoutText />
        </div>
      </main>

    <Modal 
  isOpen={isScheduleModalOpen} 
  onClose={() => setIsScheduleModalOpen(false)} 
  title="Schedule Session"
  // These classes assume your Modal component passes props to the underlying container
  className="max-w-md w-full bg-white/90 backdrop-blur-xl border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[32px] overflow-hidden"
>
  <div className="px-6 py-8 flex flex-col items-center text-center">
    {/* Decorative Icon */}
    <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
      <IconClock className="h-8 w-8 text-indigo-600" />
    </div>
    
    <div className="space-y-2 mb-8">
      <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">Your Meeting is Ready</h3>
      <p className="text-zinc-500 text-sm">Share this unique Room ID with your participants to start the secure session.</p>
    </div>

    {/* The RoomID component container */}
    <div className="w-full bg-zinc-50 rounded-2xl p-4 border border-zinc-100 mb-6">
      <RoomID />
    </div>

    <button 
      onClick={() => setIsScheduleModalOpen(false)}
      className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 active:scale-[0.98]"
    >
      Done
    </button>
  </div>
</Modal>
    </div>
  );
}