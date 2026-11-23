import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Pause, Play, RotateCcw } from 'lucide-react';
import { useSim } from '../context/SimulationContext';
import { formatHeading } from '../simulation/format';
import { rooms } from '../simulation/world';
import { UNIT_TO_M } from '../simulation/tuning';

function HoldButton({ k, label, children }) {
  const { setKey } = useSim();
  const release = () => setKey(k, false);
  return (
    <button
      type="button"
      aria-label={label}
      className="grid h-11 w-11 place-items-center border border-line bg-ink text-fog hover:border-olive active:border-lime active:bg-lime/10"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        setKey(k, true);
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      {children}
    </button>
  );
}

export default function DriveControls() {
  const { snap, start, pause, reset, setAi } = useSim();
  const running = snap.phase === 'running';
  const room = rooms.find((item) => item.id === snap.roomId);
  const speed = (snap.robot.speed * UNIT_TO_M).toFixed(2);
  const traveled = (snap.robot.distance * UNIT_TO_M).toFixed(1);

  return (
    <div className="border border-line bg-panel/95">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2">
        <button type="button" className="btn-primary" onClick={start} disabled={running}>
          <Play size={14} />
          {snap.phase === 'paused' ? 'Resume' : 'Start simulation'}
        </button>
        <button type="button" className="btn-warn" onClick={pause} disabled={!running}>
          <Pause size={14} />
          Pause
        </button>
        <button type="button" className="btn-ghost" onClick={reset}>
          <RotateCcw size={14} />
          Reset
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={snap.ai}
          onClick={() => setAi(!snap.ai)}
          className={`ml-auto flex h-9 items-center gap-3 border px-3 font-mono text-[11px] tracking-[0.12em] ${
            snap.ai ? 'border-lime/50 text-lime' : 'border-line text-mute'
          }`}
        >
          AI DETECTION
          <span className={`px-1.5 py-0.5 ${snap.ai ? 'bg-lime/15' : 'bg-white/5'}`}>{snap.ai ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <div className="grid gap-3 px-3 py-3 sm:grid-cols-[auto_1fr]">
        <div className="grid grid-cols-3 gap-1.5 justify-items-center">
          <span />
          <HoldButton k="w" label="Drive forward">
            <ArrowUp size={16} />
          </HoldButton>
          <span />
          <HoldButton k="a" label="Rotate left">
            <ArrowLeft size={16} />
          </HoldButton>
          <HoldButton k="s" label="Reverse">
            <ArrowDown size={16} />
          </HoldButton>
          <HoldButton k="d" label="Rotate right">
            <ArrowRight size={16} />
          </HoldButton>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 self-center font-mono text-[12px]">
          <p className="text-mute">Drive</p>
          <p className="text-right text-fog">{snap.robot.drive}</p>
          <p className="text-mute">Speed</p>
          <p className="text-right text-fog">{speed} m/s</p>
          <p className="text-mute">Distance</p>
          <p className="text-right text-fog">{traveled} m</p>
          <p className="text-mute">Heading</p>
          <p className="text-right text-fog">{formatHeading(snap.robot.heading)}</p>
          <p className="text-mute">Zone</p>
          <p className="truncate text-right text-fog">{room ? room.name : 'Boundary'}</p>
          <p className="text-mute">Battery</p>
          <p className="text-right text-lime">{Math.round(snap.robot.battery)}%</p>
        </div>
      </div>
      <p className="border-t border-line px-3 py-2 font-mono text-[10px] tracking-[0.08em] text-mute">
        W / ↑ forward · S / ↓ reverse · A / ← and D / → rotate · Space pauses · Hold the pad on touch screens
      </p>
    </div>
  );
}
