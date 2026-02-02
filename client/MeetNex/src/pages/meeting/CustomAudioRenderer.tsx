import { useEffect, useRef } from 'react';
import { useRoomContext, useRemoteParticipants } from '@livekit/components-react';
import { useMedia } from '@/context/MeetingContext';

/**
 * Custom audio renderer that supports speaker selection via setSinkId
 */
export const CustomAudioRenderer = () => {
  const room = useRoomContext();
  const participants = useRemoteParticipants();
  const { selectedDevice } = useMedia();
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  useEffect(() => {
    if (!room) return;

    const updateAudioElements = () => {
      // Clean up old audio elements
      audioElementsRef.current.forEach((audio, identity) => {
        if (!participants.find(p => p.identity === identity)) {
          audio.pause();
          audio.srcObject = null;
          audio.remove();
          audioElementsRef.current.delete(identity);
        }
      });

      // Create or update audio elements for each participant
      participants.forEach((participant) => {
        let audioElement = audioElementsRef.current.get(participant.identity);
        
        if (!audioElement) {
          audioElement = document.createElement('audio');
          audioElement.autoplay = true;
          document.body.appendChild(audioElement);
          audioElementsRef.current.set(participant.identity, audioElement);
        }

        // Get audio track
        const audioTrack = participant.audioTrackPublications.values().next().value?.audioTrack;
        
        if (audioTrack) {
          const mediaStream = new MediaStream([audioTrack.mediaStreamTrack]);
          audioElement.srcObject = mediaStream;
          
          // Apply speaker selection if supported
          if (selectedDevice.speakerId && 'setSinkId' in audioElement) {
            (audioElement as any).setSinkId(selectedDevice.speakerId).catch((err: Error) => {
              console.warn('Failed to set audio output device:', err);
            });
          }
        }
      });
    };

    updateAudioElements();

    // Listen for participant changes
    room.on('participantConnected', updateAudioElements);
    room.on('participantDisconnected', updateAudioElements);
    room.on('trackSubscribed', updateAudioElements);
    room.on('trackUnsubscribed', updateAudioElements);

    return () => {
      room.off('participantConnected', updateAudioElements);
      room.off('participantDisconnected', updateAudioElements);
      room.off('trackSubscribed', updateAudioElements);
      room.off('trackUnsubscribed', updateAudioElements);
      
      // Cleanup all audio elements
      audioElementsRef.current.forEach((audio) => {
        audio.pause();
        audio.srcObject = null;
        audio.remove();
      });
      audioElementsRef.current.clear();
    };
  }, [room, participants, selectedDevice.speakerId]);

  // Update speaker for existing audio elements when selection changes
  useEffect(() => {
    if (!selectedDevice.speakerId) return;

    audioElementsRef.current.forEach((audioElement) => {
      if ('setSinkId' in audioElement) {
        (audioElement as any).setSinkId(selectedDevice.speakerId).catch((err: Error) => {
          console.warn('Failed to update audio output device:', err);
        });
      }
    });
  }, [selectedDevice.speakerId]);

  return null; // This component doesn't render anything
};
