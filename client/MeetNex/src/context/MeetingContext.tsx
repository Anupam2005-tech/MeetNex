import React, {
  useCallback,
  useRef,
  createContext,
  useEffect,
  useState,
  useMemo,
  useContext,
} from "react";
import { toast } from "sonner";

/* ===================== TYPES ===================== */

export interface MediaDeviceOption {
  deviceId: string;
  label: string;
}

interface DeviceLists {
  mics: MediaDeviceOption[];
  speakers: MediaDeviceOption[];
  cam: MediaDeviceOption[];
}

interface SelectedDevices {
  micId: string;
  camId: string;
  speakerId: string;
}

interface MediaContextType {
  isMuted: boolean;
  isCamOff: boolean;
  isMediaActive: boolean;
  stream: MediaStream | null;
  selectedDevice: SelectedDevices;
  deviceList: DeviceLists;
  ghostMode: boolean; // Added for Ghost Mode

  startStream: () => Promise<void>;
  handleToggleMic: () => Promise<void>;
  handleToggleCam: () => Promise<void>;
  handleToggleScreenShare: () => Promise<void>; // Added
  handleLeaveCall: () => void;
  updateSelectedDevice: (type: keyof SelectedDevices, id: string) => void;
  saveConfig: () => Promise<void>;
  setGhostMode: (enabled: boolean) => void; // Added for Ghost Mode
  isScreenSharing: boolean; // Added
}

const MediaContext = createContext<MediaContextType | null>(null);

/* ===================== PROVIDER ===================== */

export const MediaProvider = ({ children }: { children: React.ReactNode }) => {
  const streamRef = useRef<MediaStream | null>(null);
  const isLeavingRef = useRef(false);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null); // Added

  const [isMediaActive, setIsMediaActive] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false); // Added
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const getStoredValue = (key: string, defaultValue: any) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [isMuted, setIsMuted] = useState(() => getStoredValue("meet_is_muted", false));
  const [isCamOff, setIsCameraOff] = useState(() => getStoredValue("meet_is_cam_off", false));
  const [ghostMode, setGhostModeState] = useState(() => getStoredValue("meet_ghost_mode", false));

  const [deviceList, setDeviceList] = useState<DeviceLists>({
    mics: [],
    speakers: [],
    cam: [],
  });

  const [selectedDevices, setSelectedDevices] = useState<SelectedDevices>(() =>
    getStoredValue("meet_selected_devices", {
      micId: "",
      camId: "",
      speakerId: "",
    })
  );

  /* ===================== PERSISTENCE ===================== */

  useEffect(() => {
    localStorage.setItem("meet_selected_devices", JSON.stringify(selectedDevices));
  }, [selectedDevices]);

  useEffect(() => {
    localStorage.setItem("meet_is_muted", JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem("meet_is_cam_off", JSON.stringify(isCamOff));
  }, [isCamOff]);

  useEffect(() => {
    localStorage.setItem("meet_ghost_mode", JSON.stringify(ghostMode));
  }, [ghostMode]);

  /* ===================== DEVICE ENUMERATION ===================== */

  const refreshDevice = useCallback(async () => {
    try {
      // Ensure permissions first
      // await navigator.mediaDevices.getUserMedia({ audio: true, video: true }); 
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      const mics = devices.filter(d => d.kind === 'audioinput').map(d => ({ deviceId: d.deviceId, label: d.label || 'Microphone' }));
      const speakers = devices.filter(d => d.kind === 'audiooutput').map(d => ({ deviceId: d.deviceId, label: d.label || 'Speaker' }));
      const cameras = devices.filter(d => d.kind === 'videoinput').map(d => ({ deviceId: d.deviceId, label: d.label || 'Camera' }));

      setDeviceList({ mics, speakers, cam: cameras });

      setSelectedDevices((prev) => ({
        micId: prev.micId || mics[0]?.deviceId || "",
        camId: prev.camId || cameras[0]?.deviceId || "",
        speakerId: prev.speakerId || speakers[0]?.deviceId || "",
      }));
    } catch (e) {
      // console.error("Device enumeration failed", e);
    }
  }, []);

  useEffect(() => {
    refreshDevice();
    navigator.mediaDevices.addEventListener('devicechange', refreshDevice);
    return () => navigator.mediaDevices.removeEventListener('devicechange', refreshDevice);
  }, [refreshDevice]);

  /* ===================== START MEDIA ===================== */

  const stopAllMedia = (mediaStream: MediaStream) => {
    mediaStream.getTracks().forEach((track) => {
      track.stop();
    });
  };

  const startStream = useCallback(async () => {
    if (isLeavingRef.current) return;

    try {
      let constraints: MediaStreamConstraints = {
        audio: selectedDevices.micId ? { deviceId: { ideal: selectedDevices.micId } } : true,
        video: !isCamOff ? (selectedDevices.camId ? { deviceId: { ideal: selectedDevices.camId }, width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 1280 }, height: { ideal: 720 } }) : false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);

      // Apply mute state
      newStream.getAudioTracks().forEach(t => t.enabled = !isMuted);

      if (streamRef.current) stopAllMedia(streamRef.current);

      streamRef.current = newStream;
      setStream(newStream);
      setIsMediaActive(true);
    } catch (err) {
      // console.error("❌ Failed to get media:", err);
    }
  }, [selectedDevices, isCamOff, isMuted]);

  useEffect(() => {
    if (isMediaActive) startStream();
  }, [selectedDevices.micId, selectedDevices.camId]);

  /* ===================== ACTIONS ===================== */

  const handleToggleMic = async () => {
    if (!streamRef.current) return;
    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    } else {
      // If stream has no audio track (due to constraints), restart with audio
       if (isMuted) { // attempting to unmute
          setIsMuted(false);
          startStream();
       } else {
          setIsMuted(true); 
       }
    }
  };

  const handleToggleCam = async () => {
    // Toggling off -> Stop video track/re-request
    // Toggling on -> Request video
    if (isCamOff) {
        setIsCameraOff(false);
        // Will auto-trigger useEffect to startStream
        // Note: We depend on startStream to pick up the new isCamOff state
        // and re-request gum with video: true
    } else {
        setIsCameraOff(true);
        if (streamRef.current) {
           streamRef.current.getVideoTracks().forEach(t => t.stop());
           // Force update stream state
           const newStream = new MediaStream(streamRef.current.getAudioTracks());
           setStream(newStream);
           streamRef.current = newStream;
        }
    }
  };

  const updateSelectedDevice = (type: keyof SelectedDevices, id: string) => {
    setSelectedDevices((prev) => ({ ...prev, [type]: id }));
  };

  const saveConfig = async () => new Promise<void>((r) => setTimeout(r, 500));

  const setGhostMode = (enabled: boolean) => {
    setGhostModeState(enabled);
    if (enabled) {
      // When Ghost Mode is enabled, turn off camera and mic
      setIsMuted(true);
      setIsCameraOff(true);
      
      // Immediately disable tracks if stream exists to prevent any delay
      if (streamRef.current) {
        // Disable audio tracks
        streamRef.current.getAudioTracks().forEach(t => t.enabled = false);
        // Stop and remove video tracks to turn off camera light
        streamRef.current.getVideoTracks().forEach(t => {
          t.stop();
          streamRef.current?.removeTrack(t);
        });
        // Update stream state
        setStream(new MediaStream(streamRef.current.getTracks()));
      }
    }
  };

  /* ===================== SCREEN SHARE ===================== */

  const stopScreenShare = useCallback(() => {
    if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
    }
    setIsScreenSharing(false);
    
    // Revert to camera if it was on, or just stop video
    if (streamRef.current) {
        // If we were using camera before, we should try to restore it
        // Or if we just want to return to "camera state" (which might be off)
        
        // Simplest approach: Restart stream to respect isCamOff / isMuted state
        // This will pick up the correct video device or no video
        startStream(); 
    }
  }, [startStream]);

  const handleToggleScreenShare = async () => {
    // Check if getDisplayMedia is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        toast.error("Screen sharing is not supported in this browser");
        return;
    }

    if (isScreenSharing) {
        stopScreenShare();
    } else {
        try {
            const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
            const screenTrack = displayStream.getVideoTracks()[0];
            
            screenTrackRef.current = screenTrack;
            setIsScreenSharing(true);

            // Handle user clicking "Stop sharing" validation bar
            screenTrack.onended = () => {
                stopScreenShare();
            };

            if (streamRef.current) {
                // Replace video track in current stream
                const videoTracks = streamRef.current.getVideoTracks();
                videoTracks.forEach(t => {
                    t.stop(); // Stop camera track temporarily
                    streamRef.current?.removeTrack(t);
                });
                streamRef.current.addTrack(screenTrack);
                
                // Force update to notify consumers
                setStream(new MediaStream(streamRef.current.getTracks()));
            } else {
                // If no stream exists, create one with screen track
                // (and audio if needed, though usually you'd want audio too)
                 // For now, let's assume we want to mix with audio if mic is on
                 // But simply:
                 const newStream = new MediaStream([screenTrack]);
                 streamRef.current = newStream;
                 setStream(newStream);
                 setIsMediaActive(true);
            }

        } catch (err: any) {
            // User cancelled or error occurred
            if (err.name === 'NotAllowedError') {
                toast.info("Screen sharing was cancelled");
            } else if (err.name === 'NotSupportedError') {
                toast.error("Screen sharing is not supported on this device");
            } else {
                toast.error("Failed to start screen sharing");
            }
        }
    }
  };


  /* ===================== LEAVE CALL ===================== */

  const handleLeaveCall = useCallback(() => {
    isLeavingRef.current = true;
    if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
    }
    setIsScreenSharing(false);

    if (streamRef.current) stopAllMedia(streamRef.current);
    streamRef.current = null;
    setStream(null);
    setIsMediaActive(false);
    
    // Cleanup navigation or state if needed
    window.history.replaceState(null, "", "/");
    setTimeout(() => (isLeavingRef.current = false), 500);
  }, []);

  /* ===================== SAFETY ===================== */

  useEffect(() => {
    const exit = () => handleLeaveCall();
    window.addEventListener("beforeunload", exit);
    return () => window.removeEventListener("beforeunload", exit);
  }, [handleLeaveCall]);

  /* ===================== MEMO ===================== */

  const value = useMemo(
    () => ({
      isMuted,
      isCamOff,
      isMediaActive,
      stream,
      selectedDevice: selectedDevices,
      deviceList,
      ghostMode,
      startStream,
      handleToggleMic,
      handleToggleCam,
      handleToggleScreenShare, // Added
      handleLeaveCall,
      updateSelectedDevice,
      saveConfig,
      setGhostMode,
      isScreenSharing, // Added
    }),
    [isMuted, isCamOff, isMediaActive, stream, selectedDevices, deviceList, ghostMode, isScreenSharing]
  );

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
};

export const useMedia = () => {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error("useMedia must be used inside MediaProvider");
  return ctx;
};
