import { Link } from 'react-router-dom';
import Frame from '../components/Frame';

const OBJECTIVES = [
  'Simulated remote environment observation',
  'Human detection concept demonstration',
  'Environmental monitoring',
  'Obstacle awareness',
  'Centralized monitoring dashboard',
  'Rescue-team situational awareness',
];

const NOW = [
  ['Site map', 'Top-down collapsed wing with rooms, doors, rubble, and an extraction zone.'],
  ['Drive', 'Keyboard and on-screen controls with collision against walls and debris.'],
  ['Virtual camera', 'A rendered forward view that follows the robot heading.'],
  ['Detection', 'Geometric field-of-view check with a simulated confidence value.'],
  ['Sensors', 'MQ-2, DHT11, ultrasonic, GPS, and link values generated in the browser.'],
  ['Mission log', 'Timestamped events for motion, detections, hazards, and system state.'],
];

const LATER = [
  'Physical robot prototype',
  'Actual sensor integration',
  'Thermal camera',
  'Advanced navigation',
  'Hardware communication',
];

export default function ProjectInfo() {
  return (
    <div className="flex flex-col gap-3 p-3 lg:p-4">
      <header className="border border-line bg-panel/95 px-4 py-4">
        <p className="font-mono text-[10px] tracking-[0.2em] text-olive">ACADEMIC MINI-PROJECT</p>
        <h1 className="mt-1 font-display text-4xl tracking-wide text-fog sm:text-[42px]">
          RESCUE RECON — SEMI-AUTONOMOUS ROBOT
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-mute">
          A monitoring console for a rescue-robot concept. This build is the software simulation used for review.
          It does not operate machinery.
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-2">
        <Frame title="Problem statement" bodyClassName="p-4">
          <p className="text-sm leading-relaxed text-fog/90">
            Rescue teams face difficulties when entering hazardous areas such as collapsed buildings and disaster
            zones. Remote observation and identification of people and environmental hazards can help rescue teams
            assess the situation before committing people to a space.
          </p>
        </Frame>
        <Frame title="Proposed system" bodyClassName="p-4">
          <p className="text-sm leading-relaxed text-fog/90">
            A semi-autonomous rescue robot concept combining camera observation, AI-based human detection,
            environmental sensors, obstacle awareness, and remote monitoring. The operator watches one console
            instead of separate tools.
          </p>
        </Frame>
      </div>

      <Frame title="Software architecture of this demonstration" bodyClassName="p-4">
        <svg viewBox="0 0 860 168" className="h-auto w-full" role="img" aria-label="Simulation architecture">
          <rect x="1" y="48" width="150" height="64" fill="#101613" stroke="#9aa56d" />
          <text x="76" y="76" textAnchor="middle" fill="#e7ece4" fontFamily="Rajdhani, sans-serif" fontSize="16">
            Operator
          </text>
          <text x="76" y="96" textAnchor="middle" fill="#93a096" fontFamily="IBM Plex Mono, monospace" fontSize="10">
            REVIEW CONSOLE
          </text>
          <path d="M151 80 H210" stroke="#c6e070" />
          <rect x="210" y="28" width="180" height="104" fill="#17211c" stroke="#c6e070" />
          <text x="300" y="72" textAnchor="middle" fill="#e7ece4" fontFamily="Rajdhani, sans-serif" fontSize="16">
            Rescue Recon
          </text>
          <text x="300" y="94" textAnchor="middle" fill="#c6e070" fontFamily="IBM Plex Mono, monospace" fontSize="10">
            BROWSER SIMULATION
          </text>
          <path d="M390 80 H450" stroke="#9aa56d" />
          {[
            ['Map and drive', 450, 8],
            ['Vision simulation', 450, 60],
            ['Virtual sensors', 450, 112],
          ].map(([label, x, y]) => (
            <g key={label}>
              <rect x={x} y={y} width="180" height="44" fill="#101613" stroke="#314038" />
              <text x={x + 90} y={y + 27} textAnchor="middle" fill="#e7ece4" fontFamily="Rajdhani, sans-serif" fontSize="15">
                {label}
              </text>
            </g>
          ))}
          <path d="M630 30 H690 V80 H750" stroke="#9aa56d" fill="none" />
          <path d="M630 82 H750" stroke="#9aa56d" />
          <path d="M630 134 H690 V80" stroke="#9aa56d" fill="none" />
          <rect x="750" y="52" width="100" height="56" fill="#101613" stroke="#9aa56d" />
          <text x="800" y="84" textAnchor="middle" fill="#e7ece4" fontFamily="Rajdhani, sans-serif" fontSize="15">
            Mission log
          </text>
        </svg>
      </Frame>

      <div className="grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
        <Frame title="Objectives" bodyClassName="p-4">
          <ol className="space-y-2">
            {OBJECTIVES.map((item, index) => (
              <li key={item} className="flex gap-3 text-sm text-fog/90">
                <span className="font-mono text-olive">{String(index + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ol>
        </Frame>
        <Frame title="In this build" bodyClassName="p-0">
          <table className="w-full text-left text-sm">
            <tbody>
              {NOW.map(([name, copy]) => (
                <tr key={name} className="border-b border-line/80">
                  <th className="w-40 px-4 py-3 text-left font-medium text-olive">{name}</th>
                  <td className="px-4 py-3 text-fog/90">{copy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Frame>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Frame title="Technologies" bodyClassName="p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] tracking-[0.16em] text-lime">RUNNING IN THE BROWSER</p>
              <ul className="mt-2 space-y-1 text-sm text-fog/90">
                <li>React and Vite</li>
                <li>JavaScript</li>
                <li>Tailwind CSS</li>
                <li>Canvas simulation</li>
                <li>Recharts</li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.16em] text-olive">CONCEPT ONLY — NOT EXECUTING</p>
              <ul className="mt-2 space-y-1 text-sm text-mute">
                <li>Artificial intelligence</li>
                <li>Machine learning</li>
                <li>Computer vision</li>
                <li>Python concept</li>
                <li>YOLO concept</li>
                <li>Physical sensor simulation targets</li>
              </ul>
            </div>
          </div>
        </Frame>
        <Frame title="Future scope — not in this demonstration" bodyClassName="p-4">
          <ul className="space-y-2">
            {LATER.map((item) => (
              <li key={item} className="border border-line px-3 py-2 text-sm text-mute">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-fog/80">
            Hardware would be a later phase: a physical chassis, real MQ-2, DHT11, ultrasonic, and positioning
            hardware, plus a vision model. This website stops at the monitoring simulation so the review can be
            shown on a laptop with no robot in the room.
          </p>
        </Frame>
      </div>

      <Frame title="Suggested demonstration sequence" bodyClassName="p-4">
        <ol className="grid gap-2 text-sm text-fog/90 md:grid-cols-2">
          <li className="border border-line px-3 py-2">1. Mission Overview — live simulated status and the site map.</li>
          <li className="border border-line px-3 py-2">2. Robot Simulation — start, then drive through the central doorway.</li>
          <li className="border border-line px-3 py-2">3. Acquire Survivor Bravo and show the detection box and camera.</li>
          <li className="border border-line px-3 py-2">4. Turn into rubble for an obstacle warning.</li>
          <li className="border border-line px-3 py-2">5. Sensor Monitoring — enter the north ward or gas pocket.</li>
          <li className="border border-line px-3 py-2">6. Mission Logs — read the events created during the run.</li>
        </ol>
        <Link to="/simulation" className="btn-primary mt-4">
          Open robot simulation
        </Link>
      </Frame>
    </div>
  );
}
