import { useEffect, useRef } from "react";

interface Props {
  constraints?: MediaStreamConstraints;
  enabled: boolean;
  onError?: (error: unknown) => unknown;
  onUnavailable?: () => unknown;
}

export function useMediaDevices({
  enabled,
  constraints = { video: { facingMode: "environment" }, audio: false },
  onError = () => {},
  onUnavailable = () => {},
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let localStream: MediaStream | null = null;

    async function checkCameraAvailability() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some((d) => d.kind === "videoinput");
    }

    async function startCamera() {
      if (!enabled) return;

      localStream = await navigator.mediaDevices.getUserMedia(constraints);
      const video = videoRef.current;

      if (video !== null) {
        video.srcObject = localStream;
        video.onloadeddata = () => {
          video.play();
        };
      }
    }

    async function program() {
      const cameraAvailability = await checkCameraAvailability();
      if (!cameraAvailability) return onUnavailable();

      await startCamera();
    }

    program().catch((error) => onError(error));

    return () => {
      const video = localStream;
      if (video) video.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [enabled, constraints]);

  return { videoRef };
}
