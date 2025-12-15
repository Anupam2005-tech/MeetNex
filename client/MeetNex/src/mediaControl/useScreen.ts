export async function useScreen(
  onStop?: () => void
): Promise<MediaStream> {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false, 
    });

    const [videoTrack] = screenStream.getVideoTracks();

    videoTrack.onended = () => {
      onStop?.();
    };

    return screenStream;
  } catch (error) {
    throw new Error("Permission denied");
  }
}
