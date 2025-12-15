// mute function
export function muteMic(stream?: MediaStream) {
  if (!stream) return;

  stream.getAudioTracks().forEach(track => {
    track.enabled = false;
  });
}

// unMute function
export function unmuteMic(stream?: MediaStream) {
  if (!stream) return;

  stream.getAudioTracks().forEach(track => {
    track.enabled = true;
  });
}

// audio toggle 
export function toggleMic(stream?: MediaStream) {
  if (!stream) return;

  stream.getAudioTracks().forEach(track => {
    track.enabled = !track.enabled;
  });
}

// video toggle
export function toggleVideo(stream?:MediaStream){
    if(!stream) return

    stream.getVideoTracks().forEach(track=>{
        track.enabled=!track.enabled
    })
}