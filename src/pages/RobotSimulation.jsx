import { useEffect, useRef, useState } from 'react';
import CameraView from '../components/CameraView';
import DriveControls from '../components/DriveControls';
import Frame from '../components/Frame';
import MapView from '../components/MapView';
import Onboarding from '../components/Onboarding';
import { SimBanner } from '../components/SimTag';
import { useSim } from '../context/SimulationContext';
import { formatRange } from '../simulation/format';
import { UNIT_TO_M } from '../simulation/tuning';

const HELP_KEY = 'rescue-recon-briefing-v1';

export default function RobotSimulation() {
  const { snap, simRef, start, pause, setKey, clearKeys } = useSim();
  const [help, setHelp] = useState(() => {
    try {
      return localStorage.getItem(HELP_KEY) !== 'seen';
    } catch {
      return true;
    }
  });
  const helpRef = useRef(help);
  helpRef.current = help;

  useEffect(() => {
    const drive = new Set(['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright']);
    const onDown = (event) => {
      if (helpRef.current || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.code === 'Space') {
        if (event.repeat) return;
        event.preventDefault();
        if (simRef.current.phase === 'running') pause();
        else start();
        return;
      }
      const key = event.key.toLowerCase();
      if (!drive.has(key)) return;
      event.preventDefault();
      setKey(key, true);
    };
    const onUp = (event) => {
      const key = event.key.toLowerCase();
      if (drive.has(key)) setKey(key, false);
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', clearKeys);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', clearKeys);
      clearKeys();
    };
  }, [clearKeys, pause, setKey, simRef, start]);

  const closeHelp = (remember) => {
    if (remember) {
      try {
        localStorage.setItem(HELP_KEY, 'seen');
      } catch {
        /* ignore private-mode storage failures */
      }
    }
    setHelp(false);
  };

  const warning = snap.warning;

  return (
    <div className="flex h-full min-h-[760px] flex-col gap-3 p-3 lg:min-h-0">
      <div className="flex flex-wrap items-center gap-2">
        <SimBanner>Simulated AI detection — not real model inference</SimBanner>
        <button type="button" className="btn-ghost ml-auto h-8" onClick={() => setHelp(true)}>
          Controls
        </button>
      </div>

      {snap.hint ? (
        <p className="border border-warn/40 bg-warn/10 px-3 py-2 font-mono text-[12px] text-warn">{snap.hint}</p>
      ) : null}
      {warning?.kind === 'obstacle' ? (
        <p className="border border-warn/50 bg-warn/10 px-3 py-2 font-mono text-[12px] text-warn">
          Obstacle warning — {warning.label} · {(warning.dist * UNIT_TO_M).toFixed(2)} m · highlighted on the map
        </p>
      ) : null}
      {warning?.kind === 'wall' ? (
        <p className="border border-line bg-ink/60 px-3 py-2 font-mono text-[12px] text-olive">
          Structure nearby · {formatRange(warning.dist * 2, false)}
        </p>
      ) : null}

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,380px)]">
        <Frame
          title="Disaster floor — Sector 7-C"
          className="h-full min-h-[420px]"
          right={<span className="font-mono">N ↑ · survivors {snap.detectionCount}/{snap.humanTotal}</span>}
        >
          <MapView />
          <div className="pointer-events-none absolute left-2 top-2 flex flex-wrap gap-2">
            <Legend swatch="bg-[#d2b48c]" label="Search target" />
            <Legend swatch="bg-lime" label="Marked human" />
            <Legend swatch="bg-[#6d5436]" label="Rubble" />
            <Legend swatch="bg-lime/40" label="Camera cone" />
          </div>
        </Frame>

        <div className="flex min-h-0 flex-col gap-3">
          <Frame title="Forward view" className="h-[250px] shrink-0">
            <CameraView />
          </Frame>
          <DriveControls />
          <div className="grid grid-cols-3 gap-2">
            <Mini label="Status" value={snap.detectionStatus} />
            <Mini label="Obstacles" value={String(snap.obstacleCount)} />
            <Mini label="Battery" value={`${Math.round(snap.robot.battery)}%`} />
          </div>
        </div>
      </div>

      {help ? <Onboarding onClose={closeHelp} /> : null}
    </div>
  );
}

function Legend({ swatch, label }) {
  return (
    <span className="flex items-center gap-1.5 bg-ink/80 px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-fog">
      <span className={`h-2 w-2 ${swatch}`} />
      {label}
    </span>
  );
}

function Mini({ label, value }) {
  return (
    <div className="border border-line bg-panel/90 px-2 py-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">{label}</p>
      <p className="truncate font-display text-lg leading-tight text-fog">{value}</p>
    </div>
  );
}
