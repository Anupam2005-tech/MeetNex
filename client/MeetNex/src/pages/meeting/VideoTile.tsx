import { VideoTrack, useParticipantInfo, type TrackReferenceOrPlaceholder } from "@livekit/components-react";
import { Track } from "livekit-client";
import { User, Maximize2, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";

interface VideoTileProps {
  trackRef: TrackReferenceOrPlaceholder;
  onMaximize?: () => void;
  isMaximized?: boolean;
}

export const VideoTile = ({ trackRef, onMaximize, isMaximized }: VideoTileProps) => {
  const { participant, source } = trackRef;
  // Use hooks to get reactive updates
  const { identity, name } = useParticipantInfo({ participant });
  const isSpeaking = participant.isSpeaking;
  const isCameraEnabled = participant.isCameraEnabled;
  const isMicrophoneEnabled = participant.isMicrophoneEnabled;

  // Parse metadata for avatar
  let avatarUrl = "";
  try {
    if (participant.metadata) {
      const data = JSON.parse(participant.metadata);
      avatarUrl = data.avatarUrl || data.picture || data.image || "";
    }
  } catch {
    // console.error("Failed to parse metadata", e);
  }

  // Determine if we should show the avatar (camera off or muted video track)
  const isCameraOff = source === Track.Source.Camera && !isCameraEnabled;
  const isScreenShare = source === Track.Source.ScreenShare;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative group w-full h-full bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all ${isMaximized ? 'z-50' : 'z-auto'}`}
    >
      {/* VIDEO TRACK */}
      {!isCameraOff ? (
        <VideoTrack
          trackRef={trackRef as any}
          className={`w-full h-full object-cover ${!isScreenShare && participant.isLocal ? 'scale-x-[-1]' : ''} rounded-2xl`}
        />
      ) : (
        /* AVATAR FALLBACK */
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 z-10">
          {/* Speaking Ripple Effect */}
          {isSpeaking && (
            <div className="absolute h-32 w-32 rounded-full border-2 border-emerald-500 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
          )}
          
             <div className={`relative h-28 w-28 rounded-full bg-neutral-800 border-2 items-center justify-center shadow-inner overflow-hidden ${isSpeaking ? 'border-emerald-500' : 'border-white/5'}`}>
              {avatarUrl ? (
                 <img src={avatarUrl} alt={name || identity} className="w-full h-full object-cover" />
              ) : name ? (
                 <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white/50">{name.charAt(0).toUpperCase()}</span>
                 </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                   <User size={40} className="text-neutral-600" />
                </div>
              )}
           </div>
         </div>
       )}

      {/* OVERLAY INFO */}
      <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/5 flex items-center gap-2 z-20">
         <div className={`h-2 w-2 rounded-full transition-colors duration-300 ${isSpeaking ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-white/30'}`} />
         <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest truncate max-w-[120px]">
            {name || identity} {participant.isLocal ? '(You)' : ''}
         </span>
         {!isMicrophoneEnabled && (
            <div className="w-1 h-3 bg-red-500/50 rounded-full ml-1" />
         )}
      </div>

      {/* MAXIMIZE BUTTON (Optional) */}
      {onMaximize && (
        <button
          onClick={(e) => { e.stopPropagation(); onMaximize(); }}
          className="absolute top-3 right-3 p-2 rounded-xl bg-black/20 opacity-0 group-hover:opacity-100 hover:bg-white/10 text-white transition-all backdrop-blur-md border border-white/5 z-20"
        >
          {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      )}
    </motion.div>
  );
};