import { useEffect, useRef } from "react";
import { userMedia } from "@/mediaControl/UseUserMedia";

export default function LocalVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getMediaDevices = async () => {
      try {
        const mediaStream = await userMedia();
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    getMediaDevices();
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="rounded-xl w-full"
    />
  );
}
