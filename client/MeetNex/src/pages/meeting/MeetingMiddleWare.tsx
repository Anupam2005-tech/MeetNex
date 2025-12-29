// import { useState } from "react";
// import { useParams, Navigate } from "react-router-dom";
// import JoinMeetingPage from "@/pages/meeting/JoinMeetingPage";
// import RoomPage from "@/pages/meeting/RoomPage";

// /**
//  * Types for the media state captured in the Green Room
//  */
// interface MediaPreparation {
//   stream: MediaStream | null;
//   isMuted: boolean;
//   isCameraOff: boolean;
// }

// const MeetingGatekeeper = () => {
//   // 1. Extract Room ID from the URL (/room/:roomId)
//   const { roomId } = useParams<{ roomId: string }>();

//   // 2. Track if the user has clicked 'Join'
//   const [hasJoined, setHasJoined] = useState(false);

//   // 3. Store the hardware state from the Green Room to pass to the Live Room
//   const [preparations, setPreparations] = useState<MediaPreparation>({
//     stream: null,
//     isMuted: false,
//     isCameraOff: false,
//   });

//   /**
//    * Called by JoinMeetingPage when the user is ready.
//    * We lift the state here so the stream doesn't die during unmounting.
//    */
//   const handleJoinSuccess = (
//     stream: MediaStream | null, 
//     muted: boolean, 
//     cameraOff: boolean
//   ) => {
//     setPreparations({
//       stream,
//       isMuted: muted,
//       isCameraOff: cameraOff,
//     });
//     setHasJoined(true);
//   };

//   // Safety check: If roomId is missing for some reason, redirect home
//   if (!roomId) {
//     return <Navigate to="/home" replace />;
//   }

//   /**
//    * VIEW 1: GREEN ROOM (Setup Phase)
//    * Rendered initially so user can test hardware.
//    */
//   if (!hasJoined) {
//     return (
//       <JoinMeetingPage 
//         roomId={roomId} 
//         onJoinSuccess={handleJoinSuccess} 
//       />
//     );
//   }

//   /**
//    * VIEW 2: LIVE ROOM (Active Meeting)
//    * Rendered only after clicking 'Join'. 
//    * Receives the 'warmed up' stream from the Green Room.
//    */
//   return (
//     <RoomPage 
//       roomId={roomId} 
//       initialStream={preparations.stream} 
//       initialMuted={preparations.isMuted}
//       initialCameraOff={preparations.isCameraOff}
//     />
//   );
// };

// export default MeetingGatekeeper;