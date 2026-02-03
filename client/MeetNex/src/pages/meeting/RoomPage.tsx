import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { LiveKitRoom, useTracks } from "@livekit/components-react";
import { Track, setLogLevel, LogLevel } from "livekit-client";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";

import "@livekit/components-styles";
import { useAppAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { useMedia } from "@/context/MeetingContext"; // Added for media state
import Loader from "@/components/ui/Loader";

// Import Custom Components
import { MeetingControls } from "./MeetingControls";
import { MeetingSidebar } from "./MeetingSidebar";
import { VideoTile } from "./VideoTile";
import { VideoTrack } from "@livekit/components-react";
import { Keyboard, Copy } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { RoomShortcuts } from "./RoomShortcuts";
import { CustomAudioRenderer } from "./CustomAudioRenderer";


// Types
// Types
// SidebarState type removed as it is now handled locally or inferred


const CustomRoomLayout = ({ roomName, onLeave }: { roomName: string, onLeave: () => void }) => {
  const navigate = useNavigate();
  
  // ✅ Move hooks to top level of component
  const { socket } = useSocket();
  const { user } = useAppAuth();
  
  const [leftSidebar, setLeftSidebar] = useState<"participants" | null>(null);
  const [rightSidebar, setRightSidebar] = useState<"chat" | "participant_details" | null>(null);
  
  // Message notification state
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Pagination State
  const [page, setPage] = useState(0);
  
  // Get all tracks
  const tracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }, { source: Track.Source.ScreenShare, withPlaceholder: false }],
    { onlySubscribed: false }
  );

  const screenShareTrack = tracks.find(t => t.source === Track.Source.ScreenShare);
  const cameraTracks = tracks.filter(t => t.source === Track.Source.Camera);
  const isSharing = !!screenShareTrack;
  
  const [isScreenMaximized, setIsScreenMaximized] = useState(false);
  
  // Maximized participant state
  const [maximizedParticipant, setMaximizedParticipant] = useState<string | null>(null);

  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleLeftSidebar = () => setLeftSidebar(prev => prev === "participants" ? null : "participants");
  const toggleRightSidebar = () => {
    setRightSidebar(prev => {
      const newState = prev === "chat" ? null : "chat";
      // Reset unread count when opening chat
      if (newState === "chat") {
        setUnreadCount(0);
      }
      return newState;
    });
  };

  // Utility State
  const [showShortcuts, setShowShortcuts] = useState(false);
  
  const copyRoomLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Meeting link copied!");
  };






  useEffect(() => {
    const handleActivity = () => {
      setIsControlsVisible(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => setIsControlsVisible(false), 3000);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Listen for new chat messages and show notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: any) => {
      const isMyMessage = data.senderId === user?.id;
      const isSidebarOpen = rightSidebar === "chat";
      
      // Only show notification if:
      // 1. It's not my own message
      // 2. The chat sidebar is closed
      if (!isMyMessage && !isSidebarOpen) {
        // Show toast notification
        const senderName = data.senderName || "Someone";
        const messagePreview = data.message?.substring(0, 50) || "New message";
        toast.info(`${senderName}: ${messagePreview}${data.message?.length > 50 ? '...' : ''}`);
        
        // Increment unread count
        setUnreadCount(prev => prev + 1);
      }
    };

    socket.on("chat:new", handleNewMessage);

    return () => {
      socket.off("chat:new", handleNewMessage);
    };
  }, [socket, user, rightSidebar]);





  return (
    <div className={`relative w-full h-full bg-[#1e1e24] flex flex-col overflow-hidden font-sans text-white ${!isControlsVisible ? 'cursor-none' : ''}`}>
      {/* Lighter Background with ambient light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#1e1e24] to-[#18181b] pointer-events-none" />
      

      {/* Main Content Area - 3 Column Layout - Maximized Use of Space */}
      <div className="flex flex-1 pt-0 pb-0 gap-0 overflow-hidden relative z-10 w-full h-full">
        
        {/* LEFT SIDEBAR AREA */}
        <AnimatePresence>
          {leftSidebar === "participants" && (
            <div className="absolute inset-y-0 left-0 z-[60] w-full md:w-[380px] h-full pointer-events-none">
               <div className="w-full h-full pointer-events-auto">
                 <MeetingSidebar type="participants" side="left" onClose={() => setLeftSidebar(null)} />
               </div>
            </div>
          )}
        </AnimatePresence>

        {/* CENTER STAGE (Video) */}
        <motion.div 
          layout 
          className="flex-1 h-full relative transition-all duration-500 ease-spring flex flex-col items-center justify-center bg-black/20 overflow-hidden"
        >
          {isSharing ? (
             // Presentation Mode - 85/15 Split or Full Screen
             <div className={`w-full h-full flex flex-row gap-4 transition-all duration-300 ${isScreenMaximized ? 'p-0' : 'p-6'}`}> {/* Increased padding for "reduce height a little" effect in normal mode */}
               
               {/* Left: Screen Share (Dynamic Width) */}
               <motion.div 
                 layout
                 onClick={() => setIsScreenMaximized(!isScreenMaximized)}
                 className={`relative overflow-hidden bg-black/50 rounded-2xl border border-white/5 shadow-2xl cursor-pointer hover:border-white/10 transition-all ${
                    isScreenMaximized ? 'w-full h-full absolute inset-0 z-40 rounded-none border-0' : 'w-[85%] h-full'
                 }`}
               >
                  <VideoTrack trackRef={screenShareTrack as any} className="w-full h-full object-contain" />
                  
                  {/* Badge & Controls */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 z-50">
                     <div className="px-3 py-1.5 bg-indigo-500/90 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-white shadow-lg border border-white/10">
                        {screenShareTrack.participant.name} is presenting
                     </div>
                     <div className="px-2 py-1.5 bg-black/50 backdrop-blur-md rounded-lg text-[10px] text-white/70 border border-white/10">
                        {isScreenMaximized ? "Click to minimize" : "Click to expand"}
                     </div>
                  </div>
               </motion.div>
               
               {/* Right: Participants (15%) - Hide when maximized or keep? 
                   If maximized "take whole height", typically implies full screen focus. 
                   I will hide the sidebar when maximized to give full attention. 
               */}
               {!isScreenMaximized && (
                   <motion.div 
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="w-[15%] h-full flex flex-col gap-2"
                   >
                      {/* Reuse Pagination Logic */}
                      {cameraTracks.slice(page * 4, (page + 1) * 4).map((track, _, arr) => (
                          <div 
                            key={track.participant.identity} 
                            style={{ height: `${100 / arr.length}%` }}
                            className="relative w-full rounded-xl overflow-hidden border border-white/5 bg-black/40"
                          >
                             <VideoTile trackRef={track} />
                          </div>
                      ))}
                      
                      {/* Mini Pagination Controls */}
                      {cameraTracks.length > 4 && (
                         <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-1">
                                 <button 
                                   disabled={page === 0}
                                   onClick={() => setPage(p => Math.max(0, p - 1))}
                                   className="w-8 h-8 rounded-full bg-black/50 border border-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-30 transition-all"
                                 >
                                   ↑
                                 </button>
                                 <button 
                                   disabled={(page + 1) * 4 >= cameraTracks.length}
                                   onClick={() => setPage(p => p + 1)}
                                   className="w-8 h-8 rounded-full bg-black/50 border border-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-30 transition-all"
                                 >
                                   ↓
                                 </button>
                         </div>
                      )}
                   </motion.div>
               )}
             </div>
          ) : (
            // DYNAMIC LAYOUT: 1v1 PiP or Grid (Paginated)
            <div className="w-full h-full relative p-4"> {/* Added global padding */}
               <AnimatePresence mode="popLayout">
                 {cameraTracks.length === 1 ? (
                   // CASE 1: SINGLE USER (Full Screen with padding)
                   <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative bg-black">
                      <VideoTile trackRef={cameraTracks[0]} />
                   </div>
                 ) : cameraTracks.length === 2 ? (
                   // CASE 2: 1v1 (Remote Full + Local PiP)
                   <div className="w-full h-full relative rounded-3xl overflow-hidden border border-white/5 bg-black">
                      {/* Main Video (Remote) */}
                      {cameraTracks.filter(t => !t.participant.isLocal).map(track => (
                         <div key={track.participant.identity} className="w-full h-full">
                            <VideoTile trackRef={track} />
                         </div>
                      ))}
                      
                      {/* PiP (Local) */}
                      {cameraTracks.filter(t => t.participant.isLocal).map(track => (
                         <motion.div 
                           initial={{ opacity: 0, scale: 0.8 }}
                           animate={{ opacity: 1, scale: 1 }}
                           drag
                           dragConstraints={{ left: -1000, right: 0, top: -1000, bottom: 0 }}
                           key={track.participant.identity} 
                           className="absolute bottom-6 right-6 w-64 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-30 bg-black/50 backdrop-blur-md cursor-grab active:cursor-grabbing"
                         >
                            <VideoTile trackRef={track} />
                         </motion.div>
                      ))}
                   </div>
                 ) : (
                   // CASE 3: GRID WITH MAXIMIZE SUPPORT (>2 Users)
                   <div className="w-full h-full flex flex-col items-center justify-center">
                       {maximizedParticipant ? (
                         // MAXIMIZED VIEW: Show one participant large + others in sidebar
                         <div className="w-full h-full flex flex-row gap-4 p-4">
                           {/* Main maximized video */}
                           <div className="flex-1 h-full rounded-3xl overflow-hidden border border-white/5 bg-black shadow-2xl">
                             {cameraTracks
                               .filter(track => track.participant.identity === maximizedParticipant)
                               .map(track => (
                                 <VideoTile 
                                   key={track.participant.identity} 
                                   trackRef={track}
                                   onMaximize={() => setMaximizedParticipant(null)}
                                   isMaximized={true}
                                 />
                               ))}
                           </div>
                           
                           {/* Sidebar with other participants */}
                           <div className="w-[15%] h-full flex flex-col gap-2">
                             {cameraTracks
                               .filter(track => track.participant.identity !== maximizedParticipant)
                               .slice(0, 4)
                               .map((track, _, arr) => (
                                 <div 
                                   key={track.participant.identity}
                                   style={{ height: `${100 / Math.min(arr.length, 4)}%` }}
                                   className="relative w-full rounded-xl overflow-hidden border border-white/5 bg-black/40 cursor-pointer hover:border-white/20 transition-all"
                                   onClick={() => setMaximizedParticipant(track.participant.identity)}
                                 >
                                   <VideoTile trackRef={track} />
                                 </div>
                               ))}
                           </div>
                         </div>
                       ) : (
                         // NORMAL GRID VIEW
                         <>
                           <div className="flex-1 w-full grid gap-4 grid-cols-2 grid-rows-2 p-2">
                              {cameraTracks.slice(page * 4, (page + 1) * 4).map((track) => (
                                <div 
                                  key={track.participant.identity} 
                                  className="relative w-full h-full min-h-0 rounded-2xl overflow-hidden border border-white/5 bg-black/40 shadow-lg"
                                >
                                   <VideoTile 
                                     trackRef={track}
                                     onMaximize={() => setMaximizedParticipant(track.participant.identity)}
                                     isMaximized={false}
                                   />
                                </div>
                              ))}
                           </div>
                           
                           {/* Pagination Controls */}
                           {cameraTracks.length > 4 && (
                               <div className="h-12 flex items-center justify-center gap-4 mt-2">
                                   <button 
                                     disabled={page === 0}
                                     onClick={() => setPage(p => Math.max(0, p - 1))}
                                     className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
                                   >
                                     Previous
                                   </button>
                                   <span className="text-white/50 text-xs font-mono">
                                     {page + 1} / {Math.ceil(cameraTracks.length / 4)}
                                   </span>
                                   <button 
                                     disabled={(page + 1) * 4 >= cameraTracks.length}
                                     onClick={() => setPage(p => p + 1)}
                                     className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
                                   >
                                     Next
                                   </button>
                               </div>
                           )}
                         </>
                       )}
                   </div>
                 )}
               </AnimatePresence>
            </div>
          )}

        </motion.div>

        {/* RIGHT SIDEBAR AREA */}
        <AnimatePresence>
          {rightSidebar === "chat" && (
            <div className="absolute inset-y-0 right-0 z-[60] w-full md:w-[380px] h-full pointer-events-none">
              <div className="w-full h-full pointer-events-auto">
                <MeetingSidebar type="chat" side="right" onClose={() => setRightSidebar(null)} />
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>

      {/* MOBILE HEADER: LIVE INDICATOR ONLY (No Room Name) */}
      <div className="md:hidden absolute top-4 left-4 z-50 flex items-center gap-2 pointer-events-auto">
         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
         <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider shadow-black drop-shadow-md">Live</span>
      </div>

      {/* UNIFIED BOTTOM BAR */}
      <div 
        className={`fixed bottom-0 left-0 right-0 h-14 bg-black/90 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-between px-6 transition-all duration-500 ease-in-out ${
           isControlsVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
         {/* LEFT section: Room Info (Desktop Only) */}
         <div className="hidden md:flex items-center gap-4">
            <button 
               onClick={() => navigate('/home')}
               className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 group-hover:text-white transition-colors"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-white leading-tight">{roomName || "Meeting"}</h1>
               <div className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Live</span>
               </div>
            </div>
         </div>

         {/* CENTER section: Controls */}
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
             <MeetingControls 
                sidebar={leftSidebar ? "participants" : rightSidebar ? "chat" : "none"} 
                setSidebar={(s) => {
                   if (s === "participants") toggleLeftSidebar();
                   if (s === "chat") toggleRightSidebar();
                   if (s === "none") { setLeftSidebar(null); setRightSidebar(null); }
                }} 
                onLeave={onLeave}
                onCopyLink={copyRoomLink}
                onOpenShortcuts={() => setShowShortcuts(true)}
                visible={isControlsVisible}
                unreadCount={unreadCount}
             />
         </div>

         {/* RIGHT section: Utilities (Desktop Only) */}
         <div className="hidden md:flex items-center gap-3">
             <button 
                onClick={copyRoomLink}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all font-semibold text-sm"
              >
                <Copy size={16} />
                <span>Copy Link</span>
              </button>
              <button 
               onClick={() => setShowShortcuts(true)}
               className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
               title="Keyboard Shortcuts"
            >
              <Keyboard size={20} />
            </button>
         </div>
      </div>

      <CustomAudioRenderer />
      <RoomShortcuts 
        onLeave={onLeave} 
        toggleChat={toggleRightSidebar} 
        toggleParticipants={toggleLeftSidebar} 
      />


      {/* SHORTCUTS MODAL */}
      <Modal 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
        title="Keyboard Shortcuts" 
        classNames={{
           content: "bg-[#1e1e24] text-white border border-white/10 ring-1 ring-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]",
           header: "border-white/10",
           title: "text-white",
           closeBtn: "text-neutral-400 hover:text-white hover:bg-white/10",
           body: "text-neutral-300"
        }}
      >
          <div className="grid gap-4 py-2">
             <div className="flex items-center justify-between">
                <span className="text-neutral-400">Toggle Microphone</span>
                <kbd className="px-2 py-1 rounded bg-white/10 border border-white/5 text-xs font-mono w-8 h-8 flex items-center justify-center">m</kbd>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-neutral-400">Toggle Camera</span>
                <kbd className="px-2 py-1 rounded bg-white/10 border border-white/5 text-xs font-mono w-8 h-8 flex items-center justify-center">v</kbd>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-neutral-400">Share Screen</span>
                <kbd className="px-2 py-1 rounded bg-white/10 border border-white/5 text-xs font-mono w-8 h-8 flex items-center justify-center">s</kbd>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-neutral-400">Chat</span>
                <kbd className="px-2 py-1 rounded bg-white/10 border border-white/5 text-xs font-mono w-8 h-8 flex items-center justify-center">c</kbd>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-neutral-400">Participants</span>
                <kbd className="px-2 py-1 rounded bg-white/10 border border-white/5 text-xs font-mono w-8 h-8 flex items-center justify-center">p</kbd>
             </div>
             <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                <span className="text-red-400">End Call</span>
                <kbd className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono w-8 h-8 flex items-center justify-center">e</kbd>
             </div>
          </div>
      </Modal>
    </div>
  );
};

// ================= ENTRY POINT =================
const RoomPage = () => {
  const { roomId } = useParams();
  const { user } = useAppAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { socket, joinRoom, leaveRoom } = useSocket();
  const { isMuted, isCamOff } = useMedia(); // Get media state from context
  const [token, setToken] = useState("");

  // Suppress LiveKit debug logs
  useEffect(() => {
    setLogLevel(LogLevel.warn);
  }, []);

  // Token Logic
  useEffect(() => {
    if (!roomId || roomId === "undefined") {
      toast.error("Invalid Room ID");
      navigate("/home");
      return;
    }
    
    if (!location.state?.joined) {
       navigate(`/join/${roomId}`, { replace: true });
       return;
    }

    const participantName = user?.fullName || `Guest-${Math.floor(Math.random() * 1000)}`;
    
    (async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "https://meetnex.onrender.com";
        const { data } = await axios.post(`${API_URL}/api/livekit/token`, {
          roomName: roomId,
          participantName,
          identity: user?.id || `user-${Math.random().toString(36).substr(2, 9)}`,
          image: user?.imageUrl, // Pass profile image
        });
        setToken(data.token);
      } catch (e) {
        // console.error(e);
        toast.error("Failed to connect to room");
        navigate("/home");
      }
    })();
  }, [roomId, user, navigate, location.state?.joined]);

  // Socket Events
  useEffect(() => {
    if (!socket) return;
    socket.on("user-joined", ({ userProfile }) => toast.success(`${userProfile?.fullName || "Someone"} joined`));
    socket.on("userLeft", () => toast.info("User left"));
    
    // Join the socket room ensuring we can receive chat messages
    if (roomId && user) {
        joinRoom(roomId, user.id, { 
            fullName: user.fullName || "Guest", 
            imageUrl: user.imageUrl 
        }).catch(() => {
            // console.error("Failed to join socket room:", err);
            // toast.error("Failed to connect to chat");
        });
    }

    return () => { 
        socket.off("user-joined"); 
        socket.off("userLeft"); 
        leaveRoom();
    };
  }, [socket, roomId, user, joinRoom, leaveRoom]);

  if (!token) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#050505]">
        <Loader />
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={!isCamOff} // Use dynamic value from context
      audio={!isMuted}  // Use dynamic value from context
      token={token}
      serverUrl={import.meta.env.VITE_LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: "100vh" }}
      onDisconnected={() => {
        // Stop all local tracks to turn off camera/mic lights
        if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
          navigator.mediaDevices.getUserMedia({ video: false, audio: false }).catch(() => {});
        }
      }}
    >
      <CustomRoomLayout roomName={roomId || "Meeting"} onLeave={() => navigate('/home')} />
    </LiveKitRoom>
  );
};

export default RoomPage;