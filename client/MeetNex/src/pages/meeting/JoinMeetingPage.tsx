import { FaMicrophone, FaVideo as FaVideoIcon, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import Dropdown from "../../components/ui/Dropdown";
import { lazy, Suspense, useState } from "react";
import AudioToggle from "@/components/ui/buttons/AudioToggle";
import VideoToggle from "@/components/ui/buttons/VideoToggle";
import Loader from "@/components/ui/Loader";
import { useAppAuth } from "@/context/AuthContext"; 
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom"; 
import { useMedia } from "@/context/MeetingContext";
import { createMeeting, joinMeeting, type ApiError } from "@/utils/api";

const LocalVideo = lazy(() => import("@/components/video/LocalVideo"));

const JoinMeetingPage = () => {
  const { user, isLoaded } = useAppAuth(); 
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const meetingType = searchParams.get('type')?.toUpperCase() || 'P2P';
  // Default to OPEN so shared links work immediately
  const visibility = searchParams.get('visibility')?.toUpperCase() || 'OPEN';
  
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    handleLeaveCall,
    ghostMode, // Added for Ghost Mode
  } = useMedia();

  // Apply Ghost Mode settings on mount
  useEffect(() => {
    if (ghostMode && !isMuted) {
      handleToggleMic(); // Turn off mic if Ghost Mode is enabled
    }
    if (ghostMode && !isCamOff) {
      handleToggleCam(); // Turn off camera if Ghost Mode is enabled
    }
  }, [ghostMode]); // Only run when ghostMode changes

  useEffect(() => {
    if (!isMediaActive) startStream();
  }, [startStream, isMediaActive]);

  const handleJoin = async () => {
    setError(null);
    setIsCreating(true);
    
    try {
      let targetRoomId = roomId;
      
      if (!roomId) {
        const meetingResponse = await createMeeting({
          type: meetingType as "P2P" ||"SFU",
          visibility: visibility as 'OPEN' | 'PRIVATE',
        });
        targetRoomId = meetingResponse.roomId;
      } else {
        await joinMeeting({ roomId });
      }
      
      // Stop the local preview stream before joining the room
      // This prevents the camera light from staying on due to a background stream
      handleLeaveCall();

      // ✅ IMPORTANT: Removed userId from query params to keep URL clean
      navigate(`/room/${targetRoomId}?type=${meetingType.toLowerCase()}&visibility=${visibility}`, { 
        state: { joined: true },
        replace: true 
      });
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to process meeting. Please try again.';
      setError(errorMessage);
      // console.error('Meeting operation error:', err);
    } finally {
      setIsCreating(false);
    }
  };

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
    <div className="h-screen w-full bg-white flex flex-col md:flex-row overflow-y-auto md:overflow-hidden antialiased">
      
      {/* LEFT SIDE: STUDIO */}
      <div className="w-full md:w-[55%] h-auto md:h-full bg-[#F5F5F7] flex flex-col items-center justify-center p-6 md:p-12 border-b md:border-b-0 md:border-r border-zinc-200 order-2 md:order-1">
        <div className="w-full max-w-xl space-y-6 pt-8 md:pt-0">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${isCamOff ? 'bg-zinc-400' : 'bg-emerald-500 animate-pulse'}`} />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Studio Preview</span>
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-100 px-2 py-1 rounded">
              {meetingType}
            </span>
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

      {/* RIGHT SIDE: ACTION */}
      <div className="w-full md:w-[45%] h-auto md:h-full flex flex-col justify-between p-6 md:p-16 bg-white order-1 md:order-2">
        <div className="flex justify-end">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-50 rounded-full border border-zinc-100">
            <FaShieldAlt className="text-emerald-500" size={10} />
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Secure Entry</span>
          </div>
        </div>

        <div className="max-w-sm mx-auto w-full space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 leading-tight">Ready to <br/>connect?</h1>
            <p className="text-sm text-zinc-500 font-medium">
              {roomId ? `Joining ${meetingType} meeting...` : `Starting ${meetingType} session.`}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs font-semibold text-red-600">{error}</p>
            </div>
          )}

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
            disabled={isCreating}
            className="w-full h-12 bg-zinc-900 hover:bg-black disabled:bg-zinc-400 text-white rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-zinc-200 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {roomId ? 'Joining Meeting...' : 'Creating Meeting...'}
              </>
            ) : (
              <>
                {roomId ? 'Join Meeting' : 'Create & Join'}
                <FaArrowRight size={10} className="text-emerald-400" />
              </>
            )}
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