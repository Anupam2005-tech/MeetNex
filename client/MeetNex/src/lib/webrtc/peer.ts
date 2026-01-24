// utils/webrtc/createPeerConnection.ts

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export function createPeerConnection(
  localStream: MediaStream,
  onRemoteStream: (stream: MediaStream) => void
) {
  const pc = new RTCPeerConnection(ICE_SERVERS);

  // Add local tracks
  localStream.getTracks().forEach(track => {
    pc.addTrack(track, localStream);
  });

  // Receive remote stream
  pc.ontrack = (event) => {
    console.log("Remote stream received");
    onRemoteStream(event.streams[0]);
  };

  return pc;
}
