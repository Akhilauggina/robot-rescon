import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Frame from '../components/Frame';
import MapView from '../components/MapView';
import Stat from '../components/Stat';
import StatusArt from '../components/StatusArt';
import { SimBanner } from '../components/SimTag';
import { useSim } from '../context/SimulationContext';
import { NAV } from '../nav';
import { formatHeading, formatMission, formatRange } from '../simulation/format';
import { rooms, SITE } from '../simulation/world';
import { UNIT_TO_M } from '../simulation/tuning';

function driveLabel(snap) {
  if (snap.phase === 'paused') return 'PAUSED';
  if (snap.phase !== 'running') return 'STANDBY';
  if (snap.robot.battery <= 0) return 'NO POWER';
  if (snap.robot.drive === 'BLOCKED') return 'PATH BLOCKED';
  if (snap.robot.drive === 'MOVING') return 'MOVING';
  return 'HOLDING';
}

export default function MissionOverview() {
  const { snap } = useSim();
  const progress = Math.round((snap.detectionCount / snap.humanTotal) * 100);
  const room = rooms.find((item) => item.id === snap.roomId);
  const recent = [...snap.logs].slice(-5).reverse();
  const tone = snap.phase === 'running' ? 'ok' : snap.phase === 'paused' ? 'warn' : 'default';

  return (
    <div className="flex flex-col gap-3 p-3 lg:p-4">
      <section className="relative border border-line bg-panel/95 px-4 py-4">
        <span className="pointer-events-none absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-olive/80" />
        <span className="pointer-events-none absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-olive/80" />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-olive">
              {SITE.code} · {SITE.title}
            </p>
            <h1 className="mt-1 font-display text-4xl tracking-[0.08em] text-fog sm:text-5xl">RESCUE RECON</h1>
            <p className="mt-2 text-sm text-mute sm:text-base">Semi-Autonomous Rescue Monitoring System</p>
          </div>
          <div className="max-w-sm text-sm leading-relaxed text-mute">
            Academic demonstration of a remote rescue survey. The robot, camera, detections, and sensor values
            are generated in the browser.
          </div>
        </div>
      </section>

      <SimBanner>Simulation data — no hardware connected and no live sensor feed</SimBanner>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        <Stat label="Robot status" value={driveLabel(snap)} hint={formatHeading(snap.robot.heading)} tone={tone} />
        <Stat label="Mission progress" value={progress} unit="%" hint={`${snap.detectionCount}/${snap.humanTotal} marked`} tone="ok" />
        <Stat label="Humans detected" value={snap.detectionCount} hint="Simulated acquisitions" tone="ok" />
        <Stat label="Obstacle count" value={snap.obstacleCount} hint="Approach events" tone={snap.obstacleCount ? 'warn' : 'default'} />
        <Stat
          label="Temperature"
          value={snap.sensors.temp.toFixed(1)}
          unit="°C"
          hint={snap.sensors.tempState}
          tone={snap.sensors.tempState === 'Elevated' ? 'warn' : 'default'}
        />
        <Stat label="Humidity" value={snap.sensors.humidity.toFixed(0)} unit="% RH" hint="DHT11 simulation" />
        <Stat
          label="Gas status"
          value={snap.sensors.gasState}
          hint={`${snap.sensors.gas} ppm · MQ-2`}
          tone={snap.sensors.gasState === 'Warning' ? 'alert' : 'ok'}
        />
        <Stat
          label="Distance"
          value={formatRange(snap.sensors.distanceCm, snap.sensors.distanceOpen)}
          hint="Ultrasonic simulation"
        />
        <Stat label="Signal strength" value={snap.sensors.signal} unit="%" hint="Simulated link budget" tone="sea" />
        <Stat label="Mission timer" value={formatMission(snap.missionTime)} hint={room ? room.name : 'Boundary'} />
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)]">
        <Frame title="Environment overview" className="h-[460px]" right="North up · 2 m scale">
          <MapView />
        </Frame>
        <div className="grid gap-3">
          <Frame title="Robot status" className="h-[168px]" bodyClassName="p-2">
            <StatusArt heading={snap.robot.heading} active={snap.phase === 'running'} />
          </Frame>
          <Frame title="Zone register" bodyClassName="p-3">
            <div className="mb-3">
              <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
                <span>Search progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-ink">
                <div className="h-full bg-lime" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {rooms.map((item) => {
                const current = snap.roomId === item.id;
                const visited = snap.visited[item.id];
                const label = current ? 'Current' : visited ? 'Visited' : 'Unexplored';
                return (
                  <div key={item.id} className="border border-line bg-ink/40 px-2 py-1.5">
                    <p className="truncate text-[12px] text-fog">{item.name}</p>
                    <p className={`font-mono text-[10px] tracking-[0.12em] ${current ? 'text-lime' : visited ? 'text-olive' : 'text-mute'}`}>
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
          </Frame>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Frame title="Recent activity" bodyClassName="p-3">
          <ul className="space-y-2">
            {recent.map((entry) => (
              <li key={entry.id} className="border-l border-olive/40 pl-2">
                <p className="font-mono text-[10px] text-mute">
                  {formatMission(entry.mission)} · {entry.category}
                </p>
                <p className="text-sm text-fog/90">{entry.message}</p>
              </li>
            ))}
          </ul>
        </Frame>
        <Frame title="Quick navigation" bodyClassName="p-3">
          <div className="grid gap-2">
            {NAV.filter((item) => item.to !== '/').map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center justify-between border border-line px-3 py-2 text-sm text-fog hover:border-olive/70"
                >
                  <span className="flex items-center gap-2">
                    <Icon size={15} className="text-olive" />
                    {item.label}
                  </span>
                  <ChevronRight size={14} className="text-mute" />
                </Link>
              );
            })}
          </div>
        </Frame>
        <Frame title="Sensor status" bodyClassName="p-3">
          <dl className="space-y-2 text-sm">
            <Row label="MQ-2 gas" value={`${snap.sensors.gasState} · ${snap.sensors.gas} ppm`} warn={snap.sensors.gasState === 'Warning'} />
            <Row label="DHT11 thermal" value={`${snap.sensors.tempState} · ${snap.sensors.temp.toFixed(1)}°C`} warn={snap.sensors.tempState === 'Elevated'} />
            <Row label="DHT11 humidity" value={`${snap.sensors.humidity.toFixed(0)}% RH`} />
            <Row label="Ultrasonic" value={formatRange(snap.sensors.distanceCm, snap.sensors.distanceOpen)} />
            <Row label="Link" value={`${snap.sensors.signal}% simulated`} />
            <Row label="Distance traveled" value={`${(snap.robot.distance * UNIT_TO_M).toFixed(1)} m`} />
          </dl>
          <p className="mt-3 font-mono text-[10px] tracking-[0.12em] text-mute">VIRTUAL SENSOR DATA</p>
        </Frame>
      </div>
    </div>
  );
}

function Row({ label, value, warn = false }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line/80 py-1.5">
      <dt className="text-mute">{label}</dt>
      <dd className={`font-mono text-[12px] ${warn ? 'text-warn' : 'text-fog'}`}>{value}</dd>
    </div>
  );
}
