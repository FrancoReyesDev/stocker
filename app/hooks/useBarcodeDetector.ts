import { useEffect } from "react";

interface Options {
  enabled: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onDetected: (code: string) => void;
  interval?: number; // ms entre lecturas, default 150
}

export function useBarcodeDetector({
  enabled,
  canvasRef,
  onDetected,
  interval = 150,
}: Options) {
  useEffect(() => {
    if (!enabled) return;

    let active = true;

    async function scan() {
      const canvas = canvasRef.current;
      if (!canvas || !active) return;
      const Quagga = (await import("@ericblade/quagga2")).default;

      Quagga.decodeSingle(
        {
          src: canvas.toDataURL("image/png"),
          numOfWorkers: 0, // Safari iOS necesita 0 workers
          locate: true,
          inputStream: {
            size: 640, // parámetros internos de quagga, no afecta tu canvas
          },
          decoder: {
            readers: ["ean_reader", "code_128_reader"],
          },
        },
        (result) => {
          if (!active) return;

          if (result && result.codeResult) {
            onDetected(result.codeResult.code ?? "");
          }
        }
      );

      setTimeout(scan, interval);
    }

    scan();

    return () => {
      active = false;
    };
  }, [enabled, canvasRef, onDetected, interval]);
}
