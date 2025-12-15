export async function getExternalDeviceCount() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();

    return {
      cameras: devices.filter(d => d.kind === "videoinput").length,
      mics: devices.filter(d => d.kind === "audioinput").length,
      speakers: devices.filter(d => d.kind === "audiooutput").length,
    };
  } catch (err) {
    throw new Error("Failed to fetch devices");
  }
}

export function onDeviceChanges(callback: () => void) {
  navigator.mediaDevices.ondevicechange = callback;

  return () => {
    navigator.mediaDevices.ondevicechange = null;
  };
}
