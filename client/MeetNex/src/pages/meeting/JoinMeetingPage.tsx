import { FaMicrophone, FaVideo as FaVideoIcon, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import Dropdown from "../../components/ui/Dropdown";
import { lazy, Suspense } from "react";
import AudioToggle from "@/components/ui/buttons/AudioToggle";
import VideoToggle from "@/components/ui/buttons/VideoToggle";
import Loader from "@/components/ui/Loader";
// 1. Import your custom Auth hook
import { useAppAuth } from "@/context/AuthContext"; 
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useMedia } from "@/context/MeetingContext";

// Lazy load LocalVideo
const LocalVideo = lazy(() => import("@/components/video/LocalVideo"));

const JoinMeetingPage = () => {
  const { user, isLoaded } = useAppAuth(); 
  const navigate = useNavigate();

  const {
    isMuted,
    isCamOff,
    deviceList,
    selectedDevice,
    updateSelectedDevice,
    handleToggleCam,
    handleToggleMic,
    startStream,
    isMediaActive, 
  } = useMedia();

  useEffect(() => {
    if (!isMediaActive) startStream();
  }, [startStream, isMediaActive]);

  const handleJoin = () => {
    const roomId = "meeting-123"; 
    navigate(`/room/${roomId}?type=sfu`, { replace: true }); 
  };

  // 3. Handle the "Authenticating" state for a premium feel
  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F5F5F7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Verifying Identity</p>
        </div>
      </div>
    );
  }

  const formatOptions = (devices: any[]) => 
    devices.map(device => ({
      id: device.deviceId,
      label: device.label || "System Default"
    }));

  return (
    <div className="h-screen w-full bg-white flex overflow-hidden  antialiased">
      
      {/* LEFT SIDE: THE STUDIO */}
      <div className="w-[55%] h-full bg-[#F5F5F7] flex flex-col items-center justify-center p-12 border-r border-zinc-200">
        <div className="w-full max-w-xl space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${isCamOff ? 'bg-zinc-400' : 'bg-emerald-500 animate-pulse'}`} />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Studio Preview</span>
            </div>
          </div>

          <div className="relative group rounded-[24px] bg-black shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border-[3px] border-white ring-1 ring-zinc-200">
            <div className="aspect-video w-full">
              <Suspense fallback={<Loader />}>
                <LocalVideo />
              </Suspense>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <AudioToggle isMuted={isMuted} onToggle={handleToggleMic} />
              <div className="w-[1px] h-3 bg-white/20" />
              <VideoToggle isCameraOff={isCamOff} onToggle={handleToggleCam} />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-xl border border-zinc-200 p-1 flex items-center">
              <Dropdown
                icon={<FaMicrophone className="text-zinc-400" size={10} />}
                options={formatOptions(deviceList.mics)}
                value={selectedDevice.micId}
                onChange={(id) => updateSelectedDevice("micId", id)}
              />
            </div>
            <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-xl border border-zinc-200 p-1 flex items-center">
              <Dropdown
                icon={<FaVideoIcon className="text-zinc-400" size={10} />}
                options={formatOptions(deviceList.cam)}
                value={selectedDevice.camId}
                onChange={(id) => updateSelectedDevice("camId", id)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: THE ACTION */}
      <div className="w-[45%] h-full flex flex-col justify-between p-16 bg-white">
        <div className="flex justify-end">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-50 rounded-full border border-zinc-100">
            <FaShieldAlt className="text-emerald-500" size={10} />
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Secure Entry</span>
          </div>
        </div>

        <div className="max-w-sm mx-auto w-full space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 leading-tight">Ready to <br/>connect?</h1>
            <p className="text-sm text-zinc-500 font-medium">Everything is set. Step inside.</p>
          </div>

          {/* 4. Use real user data from AuthContext */}
          <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
            {user?.imageUrl ? (
              <img 
                src={user.imageUrl} 
                alt="Profile" 
                className="h-10 w-10 rounded-xl object-cover shadow-sm ring-1 ring-zinc-200"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white text-sm font-bold">
                {user?.firstName?.[0]}
              </div>
            )}
            <div>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Verified User</p>
              <p className="text-sm font-semibold text-zinc-800">{user?.fullName}</p>
            </div>
          </div>

          <button 
            onClick={handleJoin}
            className="w-full h-12 bg-zinc-900 hover:bg-black text-white rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-zinc-200"
          >
            Join Meeting
            <FaArrowRight size={10} className="text-emerald-400" />
          </button>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-zinc-300 font-medium uppercase tracking-[0.2em]">
            Studio Session • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinMeetingPage;