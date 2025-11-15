import { useEffect, useRef, type RefObject } from "react";

interface Props {
  videoRef: RefObject<HTMLVideoElement | null>;
  enabled: boolean;
}

export function useCanvasRenderer({ videoRef, enabled = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;

    let ctx: CanvasRenderingContext2D | null = null;
    let rafId: number | null = null;
    let sizeSet = false;

    function draw() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video === null || canvas === null) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      if (ctx === null) ctx = canvas.getContext("2d");
      if (!ctx) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      if (!sizeSet && video.videoWidth > 0 && video.videoHeight > 0) {
        const cropHeight = Math.floor(video.videoHeight * 0.25);
        const cropWidth = video.videoWidth;

        canvas.width = cropWidth;
        canvas.height = cropHeight;

        sizeSet = true;
      }

      if (!ctx) ctx = canvas.getContext("2d");
      if (!ctx) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      if (video.readyState >= 2) {
        const sw = video.videoWidth;
        const sh = video.videoHeight * 0.25; // 25%
        const sx = 0;
        const sy = video.videoHeight * 0.375; // centro

        const dw = canvas.width;
        const dh = canvas.height;

        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, dw, dh);
      }

      rafId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [videoRef, enabled]);

  return { canvasRef };
}
