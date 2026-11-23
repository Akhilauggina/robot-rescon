import { useEffect, useRef } from 'react';
import { useSim } from '../context/SimulationContext';
import { drawCamera } from '../simulation/drawCamera';
import { formatHeading, formatRange } from '../simulation/format';

export default function CameraView() {
  const { simRef, snap } = useSim();
  const hostRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    let frame = 0;

    const paint = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(2, Math.floor(rect.width));
      const height = Math.max(2, Math.floor(rect.height));
      const bufferW = Math.floor(width * dpr);
      const bufferH = Math.floor(height * dpr);
      if (canvas.width !== bufferW || canvas.height !== bufferH) {
        canvas.width = bufferW;
        canvas.height = bufferH;
      }
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawCamera(ctx, width, height, simRef.current);
      frame = requestAnimationFrame(paint);
    };

    frame = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(frame);
  }, [simRef]);

  const alert = snap.detectionStatus === 'HUMAN DETECTED';

  return (
    <div ref={hostRef} className="absolute inset-0 bg-ink">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="scanlines pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.38)_100%)]" />
      <div className="pointer-events-none absolute left-2 top-2 font-mono text-[10px] tracking-[0.14em] text-lime">
        CAM-01 · VIRTUAL CAMERA / SIMULATION
      </div>
      <div className="pointer-events-none absolute right-2 top-2 font-mono text-[10px] tracking-[0.12em] text-fog/80">
        {formatHeading(snap.robot.heading)}
      </div>
      <div className="pointer-events-none absolute bottom-2 left-2 font-mono text-[10px] tracking-[0.12em] text-fog/75">
        RANGE {formatRange(snap.sensors.distanceCm, snap.sensors.distanceOpen)}
      </div>
      <div
        className={`pointer-events-none absolute bottom-2 right-2 font-mono text-[10px] tracking-[0.14em] ${
          alert ? 'text-lime' : 'text-olive'
        }`}
      >
        {snap.ai ? snap.detectionStatus : 'DETECTION OFF'}
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-lime/80" />
        <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-lime/80" />
        <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-lime/80" />
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-lime/80" />
        <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 bg-lime" />
      </div>
    </div>
  );
}
