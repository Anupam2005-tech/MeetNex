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
  /* ================= OFFER ================= */
  socket.on("offer", async ({ from, offer }: OfferPayload) => {
    try {
      // Prevent offer collision (glare)
      if (pc.signalingState !== "stable") {
        console.warn("Offer ignored, signaling not stable");
        return;
      }

      await pc.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", {
        to: from,
        answer: pc.localDescription,
      });
    } catch (err) {
      console.error("Error handling offer", err);
    }
  });

  /* ================= ANSWER ================= */
  socket.on("answer", async ({ answer }: AnswerPayload) => {
    try {
      if (pc.signalingState !== "have-local-offer") return;

      await pc.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    } catch (err) {
      console.error("Error handling answer", err);
    }
  });

  /* ================= ICE ================= */
  socket.on("ice-candidate", async ({ candidate }: IcePayload) => {
    try {
      if (!candidate) return;

      // If remote description not set yet, queue candidate
      if (!pc.remoteDescription) {
        await waitForRemoteDescription(pc);
      }

      await pc.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } catch (err) {
      console.error("ICE candidate error", err);
    }
  });

  /* ================= SEND ICE ================= */
  pc.onicecandidate = event => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        to: peerId,
        candidate: event.candidate,
      });
    }
  };

  /* ================= CLEANUP ================= */
  const cleanup = () => {
    socket.off("offer");
    socket.off("answer");
    socket.off("ice-candidate");
    pc.onicecandidate = null;
  };

  return cleanup;
}

/* ================= UTILS ================= */

function waitForRemoteDescription(pc: RTCPeerConnection): Promise<void> {
  return new Promise(resolve => {
    const check = () => {
      if (pc.remoteDescription) resolve();
      else setTimeout(check, 50);
    };
    check();
  });
}
