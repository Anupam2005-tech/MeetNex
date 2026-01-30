import { useEffect } from "react";
import { useMedia } from "./MeetingContext";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/components/ui/Toast";

export const useRoomShortcuts = () => {
    const navigate=useNavigate()
    const { 
        handleToggleMic, 
        handleToggleCam, 
        handleLeaveCall, 
        handleToggleScreenShare,
        isCamOff, 
        isMuted,
    } = useMedia();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
                return;
            }

            const key = event.key.toLowerCase();

            switch (key) {
                case "m":
                    event.preventDefault();
                    handleToggleMic(); 
                    if(isMuted){
                        showToast.success("Microphone Unmuted, Everyone can hear you now.")
                    }
                    else{
                        showToast.error("Microphone Muted ,Your audio is now off.");
                    }
                    break;
                case "v":
                    event.preventDefault();
                    handleToggleCam();
                    if(isCamOff){
                        showToast.success("Camera on, Everyone can see you")
                    }
                    else{
                        showToast.error("Camera off, NoOne can see you")
                    }
                    break;
                case "s":
                    event.preventDefault();
                    handleToggleScreenShare();
                    showToast.info("Screen sharing started")
                    break;
                case "e":
                    event.preventDefault();
                    handleLeaveCall();
                    navigate("/")
                    break;
                default:
                    break;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleToggleMic, handleToggleCam, handleToggleScreenShare, handleLeaveCall]);
};