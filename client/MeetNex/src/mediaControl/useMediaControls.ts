// mute mic
export function muteMic(stream?: MediaStream): boolean {
  if (!stream) return false;

  stream.getAudioTracks().forEach(track => {
    track.enabled = false;
  });

  return true;
}

// unmute mic
export function unmuteMic(stream?: MediaStream): boolean {
  if (!stream) return false;

  stream.getAudioTracks().forEach(track => {
    track.enabled = true;
  });

  return true;
}

// toggle mic
export function toggleMic(stream?: MediaStream): boolean {
  if (!stream) return false;

  let enabled = true;

  stream.getAudioTracks().forEach(track => {
    track.enabled = !track.enabled;
    enabled = track.enabled;
  });

  return enabled; // return new state
}

// toggle video
export function toggleVideo(stream?: MediaStream): boolean {
  if (!stream) return false;

  let enabled = true;

  stream.getVideoTracks().forEach(track => {
    track.enabled = !track.enabled;
    enabled = track.enabled;
  });

  return enabled;
}
