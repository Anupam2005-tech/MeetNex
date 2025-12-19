
export async function mergeStream(
  screenStream: MediaStream,
  userStream: MediaStream
): Promise<MediaStream> {
  const screenVideoTrack = screenStream.getVideoTracks()[0];
  const micAudioTrack = userStream.getAudioTracks()[0];

  return new MediaStream([screenVideoTrack, micAudioTrack]);
}
