export interface MediaDeviceOption {
  deviceId: string;
  label: string;
}

export async function getExternalDevices(): Promise<{
  cameras: MediaDeviceOption[];
  mics: MediaDeviceOption[];
  speakers: MediaDeviceOption[];
}> {
  const devices = await navigator.mediaDevices.enumerateDevices();

  return {
    cameras: devices
      .filter(d => d.kind === "videoinput")
      .map(d => ({
        deviceId: d.deviceId,
        label: d.label || "Camera",
      })),

    mics: devices
      .filter(d => d.kind === "audioinput")
      .map(d => ({
        deviceId: d.deviceId,
        label: d.label || "Microphone",
      })),

    speakers: devices
      .filter(d => d.kind === "audiooutput")
      .map(d => ({
        deviceId: d.deviceId,
        label: d.label || "Speaker",
      })),
  };
}

export function onDeviceChanges(callback: () => void) {
  navigator.mediaDevices.addEventListener("devicechange", callback);
  return () =>
    navigator.mediaDevices.removeEventListener("devicechange", callback);
}
