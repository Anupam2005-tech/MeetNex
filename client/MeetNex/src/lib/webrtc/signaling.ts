// utils/webrtc/setSignaling.ts
import { Socket } from "socket.io-client";

type OfferPayload = {
  from: string;
  offer: RTCSessionDescriptionInit;
};

type AnswerPayload = {
  from: string;
  answer: RTCSessionDescriptionInit;
};

type IcePayload = {
  from: string;
  candidate: RTCIceCandidateInit;
};

export function setSignaling(
  socket: Socket,
  pc: RTCPeerConnection,
  peerId: string
) {

  socket.on("offer", async ({ from, offer }: OfferPayload) => {
    console.log("Received offer from", from);

    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("answer", {
      to: from,
      answer: pc.localDescription,
    });
  });

  socket.on("answer", async ({ answer }: AnswerPayload) => {
    console.log("Received answer");

    await pc.setRemoteDescription(new RTCSessionDescription(answer));
  });

  socket.on("ice-candidate", async ({ candidate }: IcePayload) => {
    if (!candidate) return;
    console.log("Received ICE candidate");
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  });

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        to: peerId,
        candidate: event.candidate,
      });
    }
  };

  return () => {
    socket.off("offer");
    socket.off("answer");
    socket.off("ice-candidate");
    pc.onicecandidate = null;
  };
}
