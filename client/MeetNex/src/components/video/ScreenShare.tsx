import { useRef } from "react";
import { useScreen } from "@/mediaControl/useScreen";

export default function ScreenShare() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const shareScreen = async () => {
    const screenStream = await useScreen(() => {
      console.log("Screen sharing stopped");
    });

    if (videoRef.current) {
      videoRef.current.srcObject = screenStream;
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={shareScreen}>Share Screen</button>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full rounded-lg"
      />
    </div>
  );
}
