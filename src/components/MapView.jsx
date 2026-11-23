import { useEffect, useRef } from 'react';
import { useSim } from '../context/SimulationContext';
import { drawMap } from '../simulation/drawMap';
import { WORLD } from '../simulation/world';

export default function MapView() {
  const { simRef } = useSim();
  const hostRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    let frame = 0;

    const paint = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const bufferW = Math.floor(width * dpr);
      const bufferH = Math.floor(height * dpr);
      if (canvas.width !== bufferW || canvas.height !== bufferH) {
        canvas.width = bufferW;
        canvas.height = bufferH;
      }
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const scale = Math.min((width - 8) / WORLD.width, (height - 8) / WORLD.height);
      ctx.translate((width - WORLD.width * scale) / 2, (height - WORLD.height * scale) / 2);
      ctx.scale(scale, scale);
      drawMap(ctx, simRef.current);
      frame = requestAnimationFrame(paint);
    };

    frame = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(frame);
  }, [simRef]);

  return (
    <div ref={hostRef} className="absolute inset-0 bg-ink">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
