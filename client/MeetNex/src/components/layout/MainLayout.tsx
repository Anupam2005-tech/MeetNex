import { useEffect, useState, lazy, Suspense } from "react";
import { Sidebar, SidebarBody } from "./Sidebar";
import {
  IconVideo,
  IconPlus,
  IconClock,
  IconMessage2Bolt,
  IconUser,
  IconUsers,
  IconChevronDown,
  IconSettings,
  IconLink,
  IconArrowRight,
  IconKeyboard,
  IconHome 
} from "@tabler/icons-react";
import MainLayoutText from "./MainLayoutText";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { UserButton } from "@clerk/clerk-react";
import { Modal } from "../ui/Modal"; 
import RoomID from "@/pages/meeting/RoomID";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../ui/Logo";
import AIChat from "../chat/AI/AIChat";
import { useAppAuth } from "@/context/AuthContext"; // Import Auth
import { createMeeting } from "@/utils/api";
import axios from "axios"; // Import Axios

const Setting = lazy(() => import("./Settings"));

interface SidebarLink {
  label: string;
  icon: any;
  to?: string;
  onClick?: () => void;
  dropdown?: { label: string; icon: any }[];
}

const BrandLogo = () => (
    <Logo/>
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
      <span className="text-zinc-300 hidden sm:inline">|</span>
      <span className="text-zinc-500 hidden sm:inline">{now.toLocaleDateString([], { day: '2-digit', month: 'short' })}</span>
    </div>
  );
};

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLumiPage = location.pathname === "/lumi";
  
  // Desktop Sidebar State
  const [open, setOpen] = useState(false);
  const [meetingDropdownOpen, setMeetingDropdownOpen] = useState<string | null>(null);
  
  // MAIN STATE: Controls what is shown in the center (Home text vs Lumi)
  const [selected, setSelected] = useState<string | null>(isLumiPage ? "Lumi AI" : "Home");
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  
  // Mobile Specific State
  const [isMobileMeetingMenuOpen, setIsMobileMeetingMenuOpen] = useState(false);
  
  // Modal States
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [, setSelectedMeetingType] = useState<"p2p" | "sfu" | null>(null);
  const [joinUrl, setJoinUrl] = useState("");
  const [scheduledRoomId, setScheduledRoomId] = useState<string>("");

  const { user } = useAppAuth(); // Get User
  const [history, setHistory] = useState<any[]>([]); // History State

  // Fetch History for Sidebar
  useEffect(() => {
    if (selected === "Lumi AI" && user?.id) {
       const fetchHistory = async () => {
         try {
             const API_URL = import.meta.env.VITE_API_URL || "https://meetnex.onrender.com";
             const { data } = await axios.get(`${API_URL}/api/history/${user.id}`);
             // Filter for user messages only for "Recent Activity" list
             const userHistory = Array.isArray(data) ? data.filter((msg: any) => msg.sender === "me").reverse() : [];
             setHistory(userHistory);
         } catch(e) { }
       };
       fetchHistory();
    }
  }, [selected, user]);

  const handleScheduleMeeting = async () => {
    try {
      setScheduledRoomId("");
      const response = await createMeeting({
        type: 'SFU',
        visibility: 'OPEN'
      });
      setScheduledRoomId(response.roomId);
    } catch (error) {
      // console.error("Failed to create scheduled meeting:", error);
    }
  };

  const handleSubLinkClick = (subLabel: string) => {
    setIsMobileMeetingMenuOpen(false);
    if (subLabel === "Instant Meeting") {
      setPendingRoute("instant");
    } else if (subLabel === "Schedule") {
      setIsScheduleModalOpen(true);
      handleScheduleMeeting();
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinUrl) return;
    if (joinUrl.startsWith("http")) {
      window.location.href = joinUrl;
    } else {
      navigate(`/meeting/${joinUrl}`);
    }
    setIsJoinModalOpen(false);
  };

  // --- CONFIGURATION ---

  const links: SidebarLink[] = [
    {
      label: "Home",
      icon: <IconHome className="h-5 w-5" />,
      onClick: () => { setSelected("Home"); navigate("/"); }
    },
    {
      label: "Meetings",
      icon: <IconVideo className="h-5 w-5" />,
      dropdown: [
        { label: "Instant Meeting", icon: <IconPlus className="h-4 w-4" /> },
        { label: "Schedule", icon: <IconClock className="h-4 w-4" /> },
      ],
    },
    { 
      label: "Join Meeting", 
      icon: <IconLink className="h-5 w-5" />, 
      onClick: () => setIsJoinModalOpen(true) 
    },
    // CHANGED: This now just sets the 'selected' state to "Lumi AI"
    { 
      label: "Lumi AI", 
      icon: <IconMessage2Bolt className="h-5 w-5" />,
      to: "/lumi"
    },
    { 
      label: "Settings", 
      icon: <IconSettings className="h-5 w-5" />, 
      onClick: () => setIsSettingsOpen(true) 
    },
  ];

  const mobileNavItems = [
    { 
      label: "Home", 
      icon: <IconHome className="h-6 w-6" />, 
      onClick: () => { setSelected("Home"); navigate("/"); }
    },
    { 
      label: "Meetings", 
      icon: <IconVideo className="h-6 w-6" />, 
      onClick: () => setIsMobileMeetingMenuOpen(true) 
    },
    // CHANGED: This now just sets the 'selected' state to "Lumi AI"
    { 
      label: "Lumi", 
      icon: <IconMessage2Bolt className="h-6 w-6" />, 
      onClick: () => { setSelected("Lumi AI"); navigate("/lumi"); }
    },
    { 
      label: "Join", 
      icon: <IconLink className="h-6 w-6" />, 
      onClick: () => setIsJoinModalOpen(true)
    },
  ];

  return (
    <div className="flex h-[100dvh] w-full bg-[#F9F9FB] overflow-hidden antialiased">
      
      {/* GLOBAL SETTINGS MODAL */}
      <Suspense fallback={null}>
        {isSettingsOpen && (
          <Setting isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        )}
      </Suspense>

      {/* ======================= DESKTOP SIDEBAR (FIXED LEFT) ======================= */}
      <div className="hidden lg:flex h-full shrink-0 z-30 relative">
        <Sidebar open={open} setOpen={setOpen} animate={false}>
          <SidebarBody className="justify-between gap-8 bg-white border-r border-zinc-200/50 h-full">
            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-8">
              <div onClick={() => setSelected("Home")} className="cursor-pointer">
                 <BrandLogo />
              </div>
              <div className="mt-12 flex flex-col gap-1.5">
                {links.map((link, idx) => {
                  const isActive = selected === link.label;
                  const isDropdownOpen = meetingDropdownOpen === link.label;
                  
                  if (link.to) {
                    return (
                      <Link
                        key={idx}
                        to={link.to}
                        onClick={() => setSelected(link.label)}
                        className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 no-underline
                          ${isActive ? "bg-zinc-900 text-white shadow-lg" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"}`}
                      >
                        <div className="flex items-center gap-3">
                          {link.icon}
                          <span className="text-sm font-semibold">{link.label}</span>
                        </div>
                      </Link>
                    );
                  }
                  return (
                    <div key={idx} className="w-full">
                      <button
                        onClick={() => {
                          if (link.onClick) link.onClick();
                          else if (link.dropdown) setMeetingDropdownOpen(isDropdownOpen ? null : link.label);
                          
                          // Only set selected if it's not a dropdown toggle or if it is a direct action
                          if (!link.dropdown) setSelected(link.label);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                          ${isActive ? "bg-zinc-900 text-white shadow-lg" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"}`}
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
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: "auto" }} 
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-6 mt-1.5 flex flex-col gap-1 border-l-2 border-zinc-100 pl-4 py-1 bg-white rounded-lg"
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

                {/* RECENT ACTIVITY - LUMI HISTORY */}
                {selected === "Lumi AI" && history.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-zinc-100 animate-in fade-in slide-in-from-left-4 duration-500">
                    <h4 className="px-4 text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Recent Activity</h4>
                    <div className="flex flex-col gap-1">
                      {history.slice(0, 5).map((item: any, i) => (
                        <div key={i} className="px-4 py-2 text-[13px] text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg cursor-pointer truncate transition-colors">
                          {item.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="px-4 pb-4">
            <UserButton 
  showName 
  appearance={{ 
    elements: { 
      // The clickable button container
      userButtonTrigger: "flex flex-row items-center gap-2.5 p-1 pr-3 rounded-full hover:bg-zinc-100 transition-all duration-200 border border-transparent hover:border-zinc-200",
      
      // The Avatar (Force it to be first)
      userButtonAvatarBox: "order-1 h-7 w-7 border border-zinc-200",
      
      // The Name (Force it to be second)
      userButtonOuterIdentifier: "order-2 text-xs font-semibold text-zinc-700 tracking-tight"
    } 
  }} 
/>
            </div>
          </SidebarBody>
        </Sidebar>
      </div>

      {/* ======================= MOBILE LAYOUT CONTAINER ======================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* 1. Mobile Top Bar (FIXED TOP) */}
        <div className="lg:hidden absolute top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-200 px-4 h-16 flex items-center justify-between shrink-0">
            <div className="scale-75 origin-left" onClick={() => setSelected("Home")}>
                <BrandLogo />
            </div>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "h-7 w-7" } }} />
        </div>

        {/* ======================= SCROLLABLE CONTENT AREA ======================= */}
        <main 
          className="flex-1 overflow-y-auto overflow-x-hidden bg-white relative w-full pt-16 lg:pt-0 pb-[80px] lg:pb-0"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            touchAction: 'pan-y'
          }}
        >
          
          {/* Date Time Widget (Desktop Only) */}
          <div className="hidden lg:block absolute right-12 top-10 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-zinc-200/60 text-[11px] font-bold text-zinc-500 tracking-widest uppercase shadow-sm z-10">
            <CurrentDateTime />
          </div>
          
          <div className="flex flex-col items-center justify-center min-h-full p-4 lg:p-8">
            {isLumiPage ? (
               <div className="w-full h-full mx-auto bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden" style={{ height: "calc(100vh - 120px)" }}>
                 <AIChat />
               </div>
            ) : (
               <MainLayoutText />
            )}
          </div>
        </main>

        {/* 2. Mobile Bottom Navigation (FIXED BOTTOM) */}
        <div className="lg:hidden absolute bottom-0 left-0 w-full z-50 bg-white border-t border-zinc-100 pb-safe shrink-0">
          <div className="flex items-center justify-around h-16 px-1">
            {mobileNavItems.map((item, index) => {
              // Active state logic
              const isActive = selected === item.label || 
                              (item.label === "Meetings" && isMobileMeetingMenuOpen) ||
                              (item.label === "Lumi" && selected === "Lumi AI");
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    setSelected(item.label);
                    if (item.onClick) item.onClick();
                  }}
                  className="flex-1 flex flex-col items-center justify-center h-full gap-1 active:scale-95 transition-transform"
                >
                  <div className={`transition-colors duration-200 ${isActive ? "text-zinc-900" : "text-zinc-400"}`}>
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-medium tracking-wide ${isActive ? "text-zinc-900 font-bold" : "text-zinc-400"}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex-1 flex flex-col items-center justify-center h-full gap-1 active:scale-95 transition-transform"
            >
              <div className="transition-colors duration-200 text-zinc-400">
                <IconSettings className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-medium tracking-wide text-zinc-400">
                Settings
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* ======================= MOBILE DRAWER & MODALS ======================= */}

      {/* Mobile Meeting Drawer */}
      <AnimatePresence>
        {isMobileMeetingMenuOpen && (
           <>
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsMobileMeetingMenuOpen(false)}
               className="lg:hidden fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
             />
             <motion.div 
               initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 300 }}
               className="lg:hidden fixed bottom-0 left-0 right-0 bg-white z-[70] rounded-t-[32px] p-6 pb-24 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
             >
               <div className="w-12 h-1 bg-zinc-200 rounded-full mx-auto mb-6" />
               <h3 className="text-xl font-bold text-zinc-900 mb-6 px-2">Create Meeting</h3>
               
               <div className="space-y-3">
                 <button 
                   onClick={() => handleSubLinkClick("Instant Meeting")}
                   className="w-full flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 active:bg-zinc-100 transition-colors"
                 >
                   <div className="h-12 w-12 bg-zinc-900 rounded-full flex items-center justify-center text-white shadow-lg">
                     <IconPlus size={24} />
                   </div>
                   <div className="text-left">
                     <div className="font-bold text-lg text-zinc-900">Instant Meeting</div>
                     <div className="text-xs text-zinc-500">Start a new session immediately</div>
                   </div>
                 </button>

                 <button 
                   onClick={() => handleSubLinkClick("Schedule")}
                   className="w-full flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 active:bg-zinc-100 transition-colors"
                 >
                   <div className="h-12 w-12 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                     <IconClock size={24} />
                   </div>
                   <div className="text-left">
                     <div className="font-bold text-lg text-zinc-900">Schedule</div>
                     <div className="text-xs text-zinc-500">Plan for later</div>
                   </div>
                 </button>
               </div>
             </motion.div>
           </>
        )}
      </AnimatePresence>

      {/* Architecture Selection (Instant Meeting) */}
      <AnimatePresence>
        {pendingRoute === "instant" && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-xl p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center max-w-2xl w-full"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-8 md:mb-10 tracking-tighter text-center">Select Architecture</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                {[
                  { mode: "p2p", label: "Direct 1:1", desc: "Peer-to-Peer Mesh", icon: <IconUser size={24}/>, visibility: "OPEN" },
                  { mode: "sfu", label: "Group Call", desc: "Global SFU Relay", icon: <IconUsers size={24}/>, visibility: "OPEN" }
                ].map((opt) => (
                  <Link
                    key={opt.mode}
                    to={`/join?type=${opt.mode}&visibility=${opt.visibility}`}
                    onClick={() => { setPendingRoute(null); setSelectedMeetingType(opt.mode as "p2p" | "sfu"); }}
                    className="flex flex-col items-start gap-3 md:gap-4 p-6 md:p-8 bg-white border border-zinc-200 rounded-[24px] md:rounded-[32px] hover:border-zinc-900 transition-all group shadow-sm hover:shadow-xl no-underline"
                  >
                    <div className="p-3 rounded-xl bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white transition-colors">{opt.icon}</div>
                    <div className="text-left">
                        <div className="font-bold text-lg md:text-xl text-zinc-900">{opt.label}</div>
                        <div className="text-xs text-zinc-400 uppercase tracking-widest mt-1">{opt.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <button onClick={() => setPendingRoute(null)} className="mt-8 md:mt-12 text-zinc-400 hover:text-zinc-900 font-bold uppercase text-[10px] tracking-widest border-b border-zinc-200 pb-1">Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Modal */}
      <Modal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} title="Schedule Session" className="max-w-md w-full bg-white/90 backdrop-blur-xl border border-white shadow-2xl rounded-[32px]">
        <div className="px-6 py-8 flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6"><IconClock className="h-8 w-8 text-indigo-600" /></div>
          <div className="space-y-2 mb-8">
            <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">Your Meeting is Ready</h3>
            <p className="text-zinc-500 text-sm">Share this unique Room ID.</p>
          </div>
          <div className="w-full bg-zinc-50 rounded-2xl p-4 border border-zinc-100 mb-6"><RoomID roomId={scheduledRoomId} /></div>
          <button onClick={() => setIsScheduleModalOpen(false)} className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 shadow-lg">Done</button>
        </div>
      </Modal>

      {/* Join Modal */}
      <Modal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} title="Join Session" className="max-w-md w-full bg-white/95 backdrop-blur-xl border border-white shadow-2xl rounded-[32px]">
        <div className="px-6 pb-8 pt-4 flex flex-col items-center">
          <div className="h-16 w-16 bg-zinc-50 rounded-full flex items-center justify-center mb-6 border border-zinc-100 shadow-inner"><IconLink className="h-8 w-8 text-zinc-900" stroke={1.5} /></div>
          <div className="text-center space-y-1 mb-8">
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Enter Room Details</h3>
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">Paste link or ID below</p>
          </div>
          <form onSubmit={handleJoinSubmit} className="w-full relative">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><IconKeyboard className="h-5 w-5 text-zinc-300" /></div>
                <input autoFocus type="text" value={joinUrl} onChange={(e) => setJoinUrl(e.target.value)} placeholder="meeting-id-or-url" className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 text-sm font-semibold rounded-2xl pl-11 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 focus:bg-white transition-all placeholder:text-zinc-400"/>
            </div>
            <button type="submit" disabled={!joinUrl} className="w-full mt-6 py-4 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2">Connect Now <IconArrowRight className="h-4 w-4" /></button>
          </form>
        </div>
      </Modal>

    </div>
  );
}