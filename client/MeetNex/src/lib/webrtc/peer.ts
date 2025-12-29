const ICE_SERVERS: RTCConfiguration = {
    iceServers: [
        {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
            ],
        },
    ],
};
export function createPeerConnection(localStream: MediaStream,
    onIceCandidate: (candidate: RTCIceCandidate) => void,
    onTrack: (stream: MediaStream) => void,
) {

    const pc = new RTCPeerConnection(ICE_SERVERS)

    localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream)
    });

    pc.onicecandidate = event => {
        if (event.candidate) {
            onIceCandidate(event.candidate)
        }
    }
    pc.ontrack = event => {
        onTrack(event.streams[0]);
    };
    return pc
}