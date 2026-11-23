import CameraView from '../components/CameraView';
import Frame from '../components/Frame';
import { SimBanner } from '../components/SimTag';
import { useSim } from '../context/SimulationContext';

const STEPS = [
  ['SEARCHING', 'The cone sweeps open floor. No survivor is inside the simulated view.'],
  ['HUMAN DETECTED', 'A marker enters range and line of sight. A box and confidence value appear.'],
  ['TARGET MARKED', 'That survivor stays marked on the map after the robot looks away.'],
];

export default function AIVision() {
  const { snap, setAi } = useSim();

  return (
    <div className="flex flex-col gap-3 p-3 lg:p-4">
      <header>
        <p className="font-mono text-[10px] tracking-[0.2em] text-olive">VISION PIPE · EDUCATIONAL MODEL</p>
        <h1 className="font-display text-4xl tracking-wide text-fog">AI Vision Simulation</h1>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-mute">
          Detections use distance, viewing angle, and line of sight inside this page. They are not the output of
          YOLO or any neural network.
        </p>
      </header>
      <SimBanner>Simulated AI detection — not real model inference</SimBanner>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.75fr)]">
        <Frame
          title="Virtual camera / simulation"
          className="h-[460px]"
          right={snap.ai ? snap.detectionStatus : 'DETECTION OFF'}
        >
          <CameraView />
        </Frame>
        <div className="flex flex-col gap-3">
          <Frame title="Detection status" bodyClassName="p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-2xl tracking-wide text-lime">
                {snap.ai ? snap.detectionStatus : 'STANDBY'}
              </p>
              <button
                type="button"
                role="switch"
                aria-checked={snap.ai}
                className={`btn ${snap.ai ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setAi(!snap.ai)}
              >
                AI detection {snap.ai ? 'on' : 'off'}
              </button>
            </div>
            <p className="mt-2 text-sm text-mute">
              {snap.detectionCount} of {snap.humanTotal} simulated survivors marked this mission.
            </p>
            <ol className="mt-3 space-y-2">
              {STEPS.map(([name, copy]) => (
                <li key={name} className="border border-line px-3 py-2">
                  <p className={`font-mono text-[11px] tracking-[0.14em] ${snap.detectionStatus === name && snap.ai ? 'text-lime' : 'text-olive'}`}>
                    {name}
                  </p>
                  <p className="text-sm text-mute">{copy}</p>
                </li>
              ))}
            </ol>
          </Frame>
        </div>
      </div>

      <Frame title="Search targets" bodyClassName="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
            <tr>
              <th className="px-3 py-2 font-medium">ID</th>
              <th className="px-3 py-2 font-medium">Callsign</th>
              <th className="px-3 py-2 font-medium">State</th>
              <th className="px-3 py-2 font-medium">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {snap.humans.map((human) => (
              <tr key={human.id} className="border-b border-line/80">
                <td className="px-3 py-2 font-mono text-olive">{human.id}</td>
                <td className="px-3 py-2">{human.callsign}</td>
                <td className="px-3 py-2">
                  <span className={human.inView ? 'text-lime' : human.detected ? 'text-olive' : 'text-mute'}>
                    {human.inView ? 'In view' : human.detected ? 'Marked' : 'Unseen'}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-28 bg-ink">
                      <div className="h-full bg-lime" style={{ width: `${human.detected ? human.confidence : 0}%` }} />
                    </div>
                    <span className="font-mono text-[12px] text-mute">
                      {human.detected ? `${human.confidence}% sim` : '—'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Frame>
    </div>
  );
}
