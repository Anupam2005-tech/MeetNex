import { useEffect, useRef, useState, useCallback } from "react";
import { FaMicrophone, FaVolumeUp, FaVideo as FaVideoIcon, FaShieldAlt } from "react-icons/fa";
import Dropdown from "../../components/ui/Dropdown";
import LocalVideo from "@/components/video/LocalVideo";
import AudioToggle from "@/components/ui/buttons/AudioToggle";
import VideoToggle from "@/components/ui/buttons/VideoToggle";
import { UserDetails } from "@/utils/userDetails";

import {
  toggleMic as logicToggleMic,
  toggleCamera as logicToggleCamera,
  isMicEnabled,
  isCameraEnabled,
  stopAllMedia,
} from "@/mediaControl/useMediaControls";

import {
  getExternalDevices,
  onDeviceChanges,
} from "@/mediaControl/useExternalCount";

const JoinMeetingPage = () => {
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const user = UserDetails();

  // --- DEVICE LISTS ---
  const [deviceLists, setDeviceLists] = useState<{
    mics: { id: string; label: string }[];
    speakers: { id: string; label: string }[];
    cameras: { id: string; label: string }[];
  }>({
    mics: [],
    speakers: [],
    cameras: []
  });

  // --- CURRENT SELECTIONS ---
  const [selectedMic, setSelectedMic] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("");

  /* ─────────────── 1. FETCH & SYNC HARDWARE ─────────────── */
  const refreshDevices = useCallback(async () => {
    const list = await getExternalDevices();
    
    const mics = list.mics.map(d => ({ id: d.deviceId, label: d.label }));
    const speakers = list.speakers.map(d => ({ id: d.deviceId, label: d.label }));
    const cameras = list.cameras.map(d => ({ id: d.deviceId, label: d.label }));

    setDeviceLists({ mics, speakers, cameras });

    if (mics.length > 0 && !selectedMic) setSelectedMic(mics[0].id);
    if (speakers.length > 0 && !selectedSpeaker) setSelectedSpeaker(speakers[0].id);
    if (cameras.length > 0 && !selectedCamera) setSelectedCamera(cameras[0].id);
  }, [selectedMic, selectedSpeaker, selectedCamera]);

  useEffect(() => {
    refreshDevices();
    return onDeviceChanges(refreshDevices);
  }, [refreshDevices]);

  /* ─────────────── 2. DEVICE SWITCHING LOGIC ─────────────── */
  useEffect(() => {
    const switchDevices = async () => {
      if (!selectedCamera && !selectedMic) return;

      try {
        stopAllMedia(streamRef.current || undefined);

        const newStream = await navigator.mediaDevices.getUserMedia({
          video: selectedCamera ? { deviceId: { exact: selectedCamera } } : true,
          audio: selectedMic ? { deviceId: { exact: selectedMic } } : true,
        });

        streamRef.current = newStream;
        setStream(newStream);
        
        setIsMuted(!isMicEnabled(newStream));
        setIsCameraOff(!isCameraEnabled(newStream));
      } catch (err) {
        console.error("Error switching devices:", err);
      }
    };

    switchDevices();
  }, [selectedCamera, selectedMic]);

  /* ─────────────── 3. UI HANDLERS ─────────────── */
  const handleToggleMic = () => {
    if (!streamRef.current) return;
    const enabled = logicToggleMic(streamRef.current);
    setIsMuted(!enabled);
  };

  const handleToggleCamera = async () => {
    if (!streamRef.current) return;
    const enabled = await logicToggleCamera(streamRef.current);
    setIsCameraOff(!enabled);
    setStream(new MediaStream(streamRef.current.getTracks()));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 ">
      <div className="w-full max-w-6xl bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-zinc-100 flex flex-col lg:flex-row overflow-hidden min-h-[680px]">
        
        {/* PREVIEW SECTION */}
        <div className="lg:w-[65%] p-10 lg:p-14 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-zinc-50">
          
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isCameraOff ? 'bg-zinc-200' : 'bg-emerald-400 animate-ping'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isCameraOff ? 'bg-zinc-400' : 'bg-emerald-500'}`}></span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                {isCameraOff ? "Camera Off" : "Live Studio"}
              </span>
            </div>
          </div>

          {/* ADDED 'group' class here to detect hover */}
          <div className="relative group overflow-hidden rounded-[36px]">
            <div className="relative aspect-video rounded-[36px] bg-zinc-950 overflow-hidden shadow-2xl border-[6px] border-white ring-1 ring-zinc-100">
              <LocalVideo stream={stream} isMuted={isMuted} isCameraOff={isCameraOff} />
              
              {/* DYNAMIC TOGGLE BUTTONS: Transitions handled via opacity and translate */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 drop-shadow-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-10">
                <AudioToggle isMuted={isMuted} onToggle={handleToggleMic} />
                <VideoToggle isCameraOff={isCameraOff} onToggle={handleToggleCamera} />
              </div>

              {/* Optional: Dark overlay on hover to make buttons pop */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>

          {/* HARDWARE SELECTORS */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Dropdown 
              icon={<FaMicrophone size={14} />} 
              options={deviceLists.mics} 
              value={selectedMic} 
              onChange={setSelectedMic} 
            />
            <Dropdown 
              icon={<FaVolumeUp size={14} />} 
              options={deviceLists.speakers} 
              value={selectedSpeaker} 
              onChange={setSelectedSpeaker} 
            />
            <Dropdown 
              icon={<FaVideoIcon size={14} />} 
              options={deviceLists.cameras} 
              value={selectedCamera} 
              onChange={setSelectedCamera} 
            />
          </div>
        </div>

        {/* JOIN PANEL */}
        <div className="lg:w-[35%] bg-[#F9FAFB] p-12 lg:p-20 flex flex-col justify-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border border-zinc-100">
                <FaShieldAlt className="text-emerald-500" size={10} />
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Secured Connection</span>
              </div>
              <h1 className="text-5xl font-black text-zinc-900 tracking-tight leading-[0.9]">
                Ready to <br />
                <span className="text-emerald-500">Join?</span>
              </h1>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Joining as a <span className="text-zinc-900 font-bold">{user?.firstname}{" "}{user?.lastname}</span>.
              </p>
            </div>

            <button className="w-full group relative active:scale-[0.98] transition-transform cursor-pointer">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-[24px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-zinc-900 text-white py-6 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                <FaVideoIcon className="text-emerald-400" />
                Join Meeting
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinMeetingPage;