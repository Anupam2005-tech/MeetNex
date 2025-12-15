export async function userMedia(): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 60 },
        facingMode: "user",
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    return stream;
  } catch (err) {
    throw new Error("Permission denied");
  }
}
