import { useEffect } from 'react'
import {
  useRoomContext,
} from '@livekit/components-react'
import {
  RoomEvent,
  Track,
  Participant,
  RemoteTrackPublication,
} from 'livekit-client'
import { toast } from 'sonner'

export function MeetingEventManager() {
  const room = useRoomContext()
  // We can track participant counts or specific events here
  // But purely relying on Room events is often cleaner for "toasts"

// Use refs if needed in future
/* const lastStateRef = useRef<any>({}) */

  useEffect(() => {
    if (!room) return

    const handleParticipantConnected = (participant: Participant) => {
      toast.success(`${participant.name || participant.identity} joined the meeting`)
    }

    const handleParticipantDisconnected = (participant: Participant) => {
      toast.info(`${participant.name || participant.identity} left the meeting`)
    }

    // When a track is subscribed/published (e.g. screen share)
    const handleTrackPublished = (
      publication: RemoteTrackPublication,
      participant: Participant
    ) => {
      if (publication.source === Track.Source.ScreenShare) {
        toast.info(`${participant.name || participant.identity} started sharing screen`)
      }
    }

    const handleTrackUnpublished = (
      publication: RemoteTrackPublication,
      participant: Participant
    ) => {
      if (publication.source === Track.Source.ScreenShare) {
        toast.info(`${participant.name || participant.identity} stopped sharing screen`)
      }
    }

    // Subscribe to events
    room.on(RoomEvent.ParticipantConnected, handleParticipantConnected)
    room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected)
    room.on(RoomEvent.TrackPublished, handleTrackPublished)
    room.on(RoomEvent.TrackUnpublished, handleTrackUnpublished)

    return () => {
      // Cleanup
      room.off(RoomEvent.ParticipantConnected, handleParticipantConnected)
      room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected)
      room.off(RoomEvent.TrackPublished, handleTrackPublished)
      room.off(RoomEvent.TrackUnpublished, handleTrackUnpublished)
    }
  }, [room])

  return null // Headless component
}
