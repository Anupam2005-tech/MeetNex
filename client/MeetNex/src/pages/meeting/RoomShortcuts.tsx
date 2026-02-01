import { useEffect } from "react";
import { useLocalParticipant } from "@livekit/components-react";
import { toast } from "sonner";

interface RoomShortcutsProps {
  onLeave: () => void;
  toggleChat: () => void;
  toggleParticipants: () => void;
}

export const RoomShortcuts = ({ onLeave, toggleChat, toggleParticipants }: RoomShortcutsProps) => {
  const { localParticipant } = useLocalParticipant();

  useEffect(() => {
    const handleShortcuts = async (e: KeyboardEvent) => {
      // Ignore if typing in an input
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable) {
         return;
      }

      const key = e.key.toLowerCase();

      switch (key) {
         case 'm': // TOGGLE MIC
           localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled);
           toast.info(localParticipant.isMicrophoneEnabled ? "Microphone Muted" : "Microphone Unmuted");
           break;
         case 'v': // TOGGLE CAM
           {
             const newState = !localParticipant.isCameraEnabled;
             await localParticipant.setCameraEnabled(newState);
             toast.info(newState ? "Camera On" : "Camera Off");
           }
           break;
         case 's': // TOGGLE SCREEN SHARE
           localParticipant.setScreenShareEnabled(!localParticipant.isScreenShareEnabled);
           break;
         case 'e': // END CALL
           onLeave(); // Trigger leave logic
           break;
         case 'c': // TOGGLE CHAT
           toggleChat();
           break;
         case 'p': // TOGGLE PARTICIPANTS
           toggleParticipants();
           break;
      }
    };

    window.addEventListener("keydown", handleShortcuts);
    return () => window.removeEventListener("keydown", handleShortcuts);
  }, [localParticipant, onLeave, toggleChat, toggleParticipants]);

  return null;
};
