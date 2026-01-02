import React, {
  useCallback,
  useRef,
  createContext,
  useEffect,
  useState,
  useMemo,
  useContext,
} from "react";

import {
  toggleMic,
  toggleCamera,
  stopAllMedia,
} from "@/mediaControl/useMediaControls";

import {
  getExternalDevices,
  onDeviceChanges,
  type MediaDeviceOption,
} from "@/mediaControl/useExternalCount";

import { mergeStream } from "@/mediaControl/mergeStream";
import { useScreen } from "@/mediaControl/useScreen";

/* ===================== PERSISTENCE HELPERS ===================== */

const getStoredValue = (key: string, defaultValue: any) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

/* ===================== TYPES ===================== */

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
  screenStream: MediaStream | null;
  selectedDevice: SelectedDevices;
  deviceList: DeviceLists;

  startStream: () => Promise<void>;
  handleToggleMic: () => Promise<void>;
  handleToggleCam: () => Promise<void>;
  handleToggleScreenShare: () => Promise<void>;
  handleLeaveCall: () => void;
  updateSelectedDevice: (type: keyof SelectedDevices, id: string) => void;
  saveConfig: () => Promise<void>; // Added for your Settings Modal UI
}

const MediaContext = createContext<MediaContextType | null>(null);

/* ===================== PROVIDER ===================== */

export const MediaProvider = ({ children }: { children: React.ReactNode }) => {
  const streamRef = useRef<MediaStream | null>(null);
  const isLeavingRef = useRef(false); 
  
  const [isMediaActive, setIsMediaActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCameraOff] = useState(false);

  const [deviceList, setDeviceList] = useState<DeviceLists>({
    mics: [],
    speakers: [],
    cam: [],
  });

  // 1. PERSISTENCE: Initialize selectedDevices from LocalStorage
  const [selectedDevices, setSelectedDevices] = useState<SelectedDevices>(() => {
    return getStoredValue("meet_selected_devices", {
      micId: "",
      camId: "",
      speakerId: "",
    });
  });

  // 2. AUTO-SAVE: Write to LocalStorage whenever devices change
  useEffect(() => {
    localStorage.setItem("meet_selected_devices", JSON.stringify(selectedDevices));
  }, [selectedDevices]);

  /* ===================== DEVICE ENUMERATION ===================== */

  const refreshDevice = useCallback(async () => {
    const devices = await getExternalDevices();
    setDeviceList({
      mics: devices.mics,
      cam: devices.cameras,
      speakers: devices.speakers,
    });

    setSelectedDevices((prev) => ({
      camId: prev.camId || devices.cameras[0]?.deviceId || "",
      speakerId: prev.speakerId || devices.speakers[0]?.deviceId || "",
      micId: prev.micId || devices.mics[0]?.deviceId || "",
    }));
  }, []);

  useEffect(() => {
    refreshDevice();
    const removeListener = onDeviceChanges(refreshDevice);
    return () => {
      if (typeof removeListener === "function") removeListener();
    };
  }, [refreshDevice]);

  /* ===================== START MEDIA ===================== */

  const startStream = useCallback(async () => {
    if (isLeavingRef.current) return;

    try {
      // Use the current state of selectedDevices (which might have come from Storage)
      const constraints: MediaStreamConstraints = {
        audio: selectedDevices.micId ? { deviceId: { exact: selectedDevices.micId } } : true,
        video: isCamOff ? false : (selectedDevices.camId ? { deviceId: { exact: selectedDevices.camId } } : true),
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (isLeavingRef.current) {
          newStream.getTracks().forEach(t => t.stop());
          return;
      }

      if (isMuted) {
        newStream.getAudioTracks().forEach(track => track.enabled = false);
      }

      if (streamRef.current) {
        stopAllMedia(streamRef.current);
      }

      streamRef.current = newStream;
      setStream(newStream);
      
      await refreshDevice();
      setIsMediaActive(true);
    } catch (err) {
      console.error("Failed to get media:", err);
    }
  }, [selectedDevices.micId, selectedDevices.camId, isCamOff, isMuted, refreshDevice]);

  useEffect(() => {
    if (isMediaActive && !isLeavingRef.current) {
      startStream();
    }
  }, [selectedDevices.micId, selectedDevices.camId]);

  /* ===================== ACTIONS ===================== */

  const handleToggleMic = async () => {
    if (!streamRef.current) return;
    const enabled = toggleMic(streamRef.current);
    setIsMuted(!enabled);
  };

  const handleToggleCam = async () => {
    if (!streamRef.current) return;
    const enabled = await toggleCamera(streamRef.current);
    setIsCameraOff(!enabled);
  };

  const handleToggleScreenShare = useCallback(async () => {
    if (screenStream) {
      stopAllMedia(screenStream);
      setScreenStream(null);
      return;
    }
    try {
      const screen = await useScreen(() => setScreenStream(null));
      if (streamRef.current) {
        const merged = await mergeStream(screen, streamRef.current);
        setScreenStream(merged);
      } else {
        setScreenStream(screen);
      }
    } catch (err) {
      console.warn("Screen share error", err);
    }
  }, [screenStream]);

  const updateSelectedDevice = (type: keyof SelectedDevices, id: string) => {
    setSelectedDevices((prev) => ({ ...prev, [type]: id }));
  };

  const saveConfig = async () => {
    return new Promise<void>((resolve) => setTimeout(resolve, 800));
  };

  /* ===================== LEAVE CALL ===================== */

  const handleLeaveCall = useCallback(() => {
    isLeavingRef.current = true;
    setIsMediaActive(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop(); 
        track.enabled = false;
      });
      streamRef.current = null;
    }

    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
    }

    setStream(null);
    setScreenStream(null);
    window.history.replaceState(null, "", "/");

    setTimeout(() => {
      isLeavingRef.current = false;
    }, 1000);
  }, [screenStream]);

  /* ===================== BROWSER NAVIGATION SAFETY ===================== */

  useEffect(() => {
    const handleGlobalExit = () => handleLeaveCall();
    window.addEventListener("popstate", handleGlobalExit);
    window.addEventListener("beforeunload", handleGlobalExit);

    return () => {
      window.removeEventListener("popstate", handleGlobalExit);
      window.removeEventListener("beforeunload", handleGlobalExit);
    };
  }, [handleLeaveCall]);

  /* ===================== MEMO ===================== */

  const value = useMemo(() => ({
    isMuted,
    isCamOff,
    isMediaActive,
    stream,
    screenStream,
    selectedDevice: selectedDevices,
    deviceList,
    startStream,
    handleToggleMic,
    handleToggleCam,
    handleToggleScreenShare,
    handleLeaveCall,
    updateSelectedDevice,
    saveConfig,
  }), [
    isMuted, 
    isCamOff, 
    isMediaActive, 
    stream, 
    screenStream, 
    selectedDevices, 
    deviceList, 
    startStream, 
    handleToggleScreenShare, 
    handleLeaveCall
  ]);

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
};

export const useMedia = () => {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error("useMedia must be used inside MediaProvider");
  return ctx;
};