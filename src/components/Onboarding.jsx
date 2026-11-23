export default function Onboarding({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-lg border border-line bg-[#17211c] p-5 shadow-none">
        <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-lime" />
        <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-lime" />
        <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-lime" />
        <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-lime" />
        <p className="font-mono text-[10px] tracking-[0.2em] text-olive">SIMULATION BRIEFING</p>
        <h2 className="mt-1 font-display text-3xl tracking-wide text-fog">How to drive the robot</h2>
        <p className="mt-2 text-sm leading-relaxed text-mute">
          This is a software simulation of a rescue survey. Nothing on this page connects to a physical robot,
          camera, or sensor.
        </p>
        <ol className="mt-4 space-y-2 text-sm leading-relaxed text-fog/90">
          <li>1. Press Start simulation. The mission clock begins.</li>
          <li>2. W or Up drives forward. S or Down reverses. A / Left and D / Right rotate.</li>
          <li>3. The pale cone is the virtual camera. It turns with the robot.</li>
          <li>4. Drive toward a survivor marker. A simulated detection appears inside the cone.</li>
          <li>5. Walls and rubble block movement. Close approaches raise an obstacle warning.</li>
          <li>6. AI Detection can be switched off to pause new simulated acquisitions.</li>
        </ol>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={() => onClose(true)}>
            Begin demonstration
          </button>
          <button type="button" className="btn-ghost" onClick={() => onClose(false)}>
            Close for now
          </button>
        </div>
      </div>
    </div>
  );
}
