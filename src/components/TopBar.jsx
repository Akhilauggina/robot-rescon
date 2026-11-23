import { BatteryMedium, Clock, Menu, Pause, Play, Radio, RotateCcw } from 'lucide-react';
import { useSim } from '../context/SimulationContext';
import { formatMission } from '../simulation/format';

function phaseCopy(phase) {
  if (phase === 'running') return 'SIMULATION ACTIVE';
  if (phase === 'paused') return 'SIMULATION PAUSED';
  return 'STANDBY';
}

export default function TopBar({ onMenu }) {
  const { snap, start, pause, reset } = useSim();
  const running = snap.phase === 'running';
  const batteryTone = snap.robot.battery < 15 ? 'text-alert' : snap.robot.battery < 35 ? 'text-warn' : 'text-lime';

  return (
    <header className="z-20 shrink-0 border-b border-line bg-[#121916]/95">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2">
        <button type="button" className="btn-ghost h-8 px-2 lg:hidden" onClick={onMenu} aria-label="Open navigation">
          <Menu size={16} />
        </button>

        <div className="mr-auto min-w-0">
          <p className="font-display text-sm tracking-[0.18em] text-fog">SECTOR 7-C</p>
          <p className="font-mono text-[10px] tracking-[0.12em] text-mute">COLLAPSED EAST WING · VIRTUAL SITE</p>
        </div>

        <div
          className={`flex items-center gap-2 border px-2 py-1 font-mono text-[10px] tracking-[0.14em] ${
            running
              ? 'border-lime/40 text-lime'
              : snap.phase === 'paused'
                ? 'border-warn/50 text-warn'
                : 'border-line text-olive'
          }`}
        >
          <span className={`h-1.5 w-1.5 ${running ? 'status-dot bg-lime' : 'bg-current'}`} />
          {phaseCopy(snap.phase)}
        </div>

        <div className="hidden items-center gap-1.5 font-mono text-[12px] text-fog sm:flex">
          <Clock size={14} className="text-olive" />
          {formatMission(snap.missionTime)}
        </div>
        <div className={`hidden items-center gap-1.5 font-mono text-[12px] md:flex ${batteryTone}`}>
          <BatteryMedium size={15} />
          {Math.round(snap.robot.battery)}%
        </div>
        <div className="hidden items-center gap-1.5 font-mono text-[12px] text-sea lg:flex">
          <Radio size={14} />
          {snap.sensors.signal}%
        </div>

        <div className="flex items-center gap-1.5">
          <button type="button" className="btn-primary h-8" onClick={start} disabled={running}>
            <Play size={13} />
            {snap.phase === 'paused' ? 'Resume' : 'Start'}
          </button>
          <button type="button" className="btn-warn h-8" onClick={pause} disabled={!running}>
            <Pause size={13} />
            Pause
          </button>
          <button type="button" className="btn-ghost h-8" onClick={reset}>
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
      </div>
    </header>
  );
}
