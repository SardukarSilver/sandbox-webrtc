import React, { useEffect, useState } from "react";

interface JoinScreenProps {
  onJoin: (camera: string, mic: string) => void;
}

const JoinScreen: React.FC<JoinScreenProps> = ({ onJoin }) => {
  const [deviceType, setDeviceType] = useState("");
  const [browser, setBrowser] = useState("");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [camera, setCamera] = useState<string>("");
  const [mic, setMic] = useState<string>("");

  useEffect(() => {
    const detectDeviceAndBrowser = () => {
      const ua = navigator.userAgent;
      // Detect device type
      if (/android/i.test(ua)) {
        setDeviceType("Android");
      } else if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
        setDeviceType("iOS");
      } else {
        setDeviceType("Desktop");
      }

      // Detect browser
      if (ua.indexOf("Chrome") > -1) {
        setBrowser("Chrome");
      } else if (ua.indexOf("Safari") > -1) {
        setBrowser("Safari");
      } else if (ua.indexOf("Firefox") > -1) {
        setBrowser("Firefox");
      } else if (ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1) {
        setBrowser("Internet Explorer");
      } else if (ua.indexOf("Edge") > -1) {
        setBrowser("Edge");
      } else {
        setBrowser("Unknown");
      }
    };

    detectDeviceAndBrowser();
    getMediaDevices();
  }, []);

  const getMediaDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    setDevices(devices);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">
        You are joining from {deviceType} device using {browser} browser
      </h1>
      <div className="flex items-center mb-4">
        <label className="block text-lg mb-2" htmlFor="camera-select">
          Camera:
        </label>
        <select
          id="camera-select"
          className="p-2 border rounded-md"
          onChange={(e) => setCamera(e.target.value)}
          value={camera}
        >
          {devices
            .filter((device) => device.kind === "videoinput")
            .map((device, index) => (
              <option key={index} value={device.deviceId}>
                {device.label || `Camera ${index + 1}`}
              </option>
            ))}
        </select>
      </div>
      <div className="flex mb-4">
        <label className="block text-lg mb-2" htmlFor="mic-select">
          Microphone:
        </label>
        <select
          id="mic-select"
          className="p-2 border rounded-md"
          onChange={(e) => setMic(e.target.value)}
          value={mic}
        >
          {devices
            .filter((device) => device.kind === "audioinput")
            .map((device, index) => (
              <option key={index} value={device.deviceId}>
                {device.label || `Microphone ${index + 1}`}
              </option>
            ))}
        </select>
      </div>
      <button
        className="px-6 py-2 bg-blue-500 text-white rounded-md"
        onClick={() => onJoin(camera, mic)}
      >
        Join
      </button>
    </div>
  );
};

export default JoinScreen;
