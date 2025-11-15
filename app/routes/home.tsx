import { useState } from "react";
import { useBarcodeDetector } from "~/hooks/useBarcodeDetector";
import { useCanvasRenderer } from "~/hooks/useCanvasRenderer";
import { useMediaDevices } from "~/hooks/useMediaDevices";

export default function Home() {
  const [enabled, setEnabled] = useState(true);
  const { videoRef } = useMediaDevices({ enabled, onError, onUnavailable });
  const { canvasRef } = useCanvasRenderer({ videoRef, enabled });

  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [error, setError] = useState(false);
  const [barcode, setBarcode] = useState("");

  function onError(error: unknown) {
    setError(true);
    setEnabled(false);
  }

  function onUnavailable() {
    setCameraAvailable(false);
    setEnabled(false);
  }

  function handleToggleCamera() {
    setError(false);
    setEnabled(!enabled);
  }

  useBarcodeDetector({ enabled, canvasRef, onDetected, interval: 500 });

  function onDetected(code: string) {
    setBarcode(code);
  }

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: "none" }}
      />
      {enabled && cameraAvailable && (
        <div className="relative w-full">
          <canvas ref={canvasRef} />

          <div
            className="
              absolute 
              top-1/2 left-0 w-full h-[2px]
              bg-red-500 opacity-80 z-10
            "
            style={{ transform: "translateY(-1px)" }}
          />
        </div>
      )}
      {!cameraAvailable && (
        <p className="text-red-500">
          No hay cámara trasera disponible en este dispositivo
        </p>
      )}
      {error && <p className="text-red-500">Error de cámara</p>}
      barcode {barcode}
      <button onClick={handleToggleCamera} disabled={!cameraAvailable}>
        {enabled ? "apagar" : "prender"}
      </button>
    </div>
  );
}
