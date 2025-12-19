export const CallEnd = (
  userStreamRef: React.RefObject<MediaStream | null>,
  screenStream: MediaStream | null
) => {
  // 1. Stop the main camera/mic stream
  if (userStreamRef.current) {
    userStreamRef.current.getTracks().forEach((track) => {
      track.stop();
    });
    userStreamRef.current = null;
  }

  // 2. Stop the screen sharing stream if it exists
  if (screenStream) {
    screenStream.getTracks().forEach((track) => track.stop());
  }
};