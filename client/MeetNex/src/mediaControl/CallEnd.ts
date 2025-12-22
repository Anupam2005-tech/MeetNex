export const CallEnd = (stream?:MediaStream) => {
 if(!stream) return false
 stream.getTracks().forEach((track)=>{
  track.stop()
 })
};