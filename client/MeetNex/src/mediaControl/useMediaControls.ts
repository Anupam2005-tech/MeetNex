/* =====================================================
   AUDIO (MIC) CONTROLS
   ===================================================== */

// Mute microphone (SOFT)
export function muteMic(stream?: MediaStream): boolean {
  if (!stream) return false;

  const tracks = stream.getAudioTracks();
  if (!tracks.length) return false;

  tracks.forEach(track => (track.enabled = false));
  return true;
}

// Unmute microphone (SOFT)
export function unmuteMic(stream?: MediaStream): boolean {
  if (!stream) return false;

  const tracks = stream.getAudioTracks();
  if (!tracks.length) return false;

  tracks.forEach(track => (track.enabled = true));
  return true;
}

// Toggle microphone (SOFT)
export function toggleMic(stream?: MediaStream): boolean {
  if (!stream) return false;

  const track = stream.getAudioTracks()[0];
  if (!track) return false;

  track.enabled = !track.enabled;
  return track.enabled;
}

// Check mic state
export function isMicEnabled(stream?: MediaStream): boolean {
  if (!stream) return false;
  const track = stream.getAudioTracks()[0];
  return !!track?.enabled;
}

/* =====================================================
   VIDEO (CAMERA) CONTROLS — ZOOM / MEET LEVEL
   ===================================================== */

/**
 * Turn camera OFF completely (LED OFF)
 */
export function stopCamera(stream?: MediaStream): boolean {
  if (!stream) return false;

  const tracks = stream.getVideoTracks();
  if (!tracks.length) return false;

  tracks.forEach(track => {
    track.stop();              // 🔥 releases hardware
    stream.removeTrack(track); // remove from stream
  });

  return true;
}

export async function restartCamera(
  stream?: MediaStream
): Promise<boolean> {
  if (!stream) return false;

  try {
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    const newTrack = newStream.getVideoTracks()[0];
    if (!newTrack) return false;

    stream.addTrack(newTrack);
    return true;
  } catch (err) {
    console.error("Camera restart failed:", err);
    return false;
  }
}
 
export async function toggleCamera(
  stream?: MediaStream
): Promise<boolean> {
  if (!stream) return false;

  const hasVideo = stream.getVideoTracks().length > 0;

  if (hasVideo) {
    stopCamera(stream);
    return false;
  } else {
    return await restartCamera(stream);
  }
}

// Check camera state
export function isCameraEnabled(stream?: MediaStream): boolean {
  if (!stream) return false;
  return stream.getVideoTracks().length > 0;
}

/* =====================================================
   FULL MEDIA CLEANUP (LEAVE CALL)
   ===================================================== */

export function stopAllMedia(stream?: MediaStream): void {
  if (!stream) return;

  stream.getTracks().forEach(track => {
    track.stop();
  });
}
