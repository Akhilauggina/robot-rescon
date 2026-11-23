import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Frame from '../components/Frame';
import Gauge from '../components/Gauge';
import { SimBanner } from '../components/SimTag';
import { useSim } from '../context/SimulationContext';
import { formatCoord, formatRange } from '../simulation/format';
import { WORLD } from '../simulation/world';

const tooltipStyle = {
  background: '#17211c',
  border: '1px solid #314038',
  borderRadius: 0,
  fontSize: 12,
  color: '#e7ece4',
};

function Trend({ data, dataKey, color, domain, name }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid stroke="#314038" vertical={false} />
        <XAxis dataKey="label" hide />
        <YAxis domain={domain} tick={{ fill: '#93a096', fontSize: 11 }} stroke="#314038" width={46} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area
          type="monotone"
          dataKey={dataKey}
          name={name}
          stroke={color}
          fill={color}
          fillOpacity={0.16}
          strokeWidth={1.6}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function SensorMonitoring() {
  const { snap } = useSim();
  const { sensors, robot } = snap;
  const rangePct = Math.max(4, Math.min(100, (sensors.distanceCm / 400) * 100));
  const dotX = (robot.x / WORLD.width) * 100;
  const dotY = (robot.y / WORLD.height) * 100;

  return (
    <div className="flex flex-col gap-3 p-3 lg:p-4">
      <header>
        <p className="font-mono text-[10px] tracking-[0.2em] text-olive">INSTRUMENT BUS</p>
        <h1 className="font-display text-4xl tracking-wide text-fog">Sensor Monitoring</h1>
        <p className="mt-1 max-w-3xl text-sm text-mute">
          Values drift inside fixed ranges and react when the robot enters the heat ward or the gas pocket.
          The virtual feed keeps moving while the drive is paused.
        </p>
      </header>
      <SimBanner>Virtual sensor data — not readings from MQ-2, DHT11, ultrasonic, or GPS hardware</SimBanner>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Frame title="MQ-2 gas sensor" bodyClassName="p-3">
          <Gauge
            label="Gas level"
            value={sensors.gas}
            min={0}
            max={600}
            display={sensors.gas}
            unit="ppm"
            hint={sensors.gasState}
            tone={sensors.gasState === 'Warning' ? 'alert' : 'lime'}
          />
          <Meter value={sensors.gas} max={600} tone={sensors.gasState === 'Warning' ? 'bg-alert' : 'bg-lime'} />
        </Frame>
        <Frame title="DHT11 temperature" bodyClassName="p-3">
          <Gauge
            label="Temperature"
            value={sensors.temp}
            min={20}
            max={42}
            display={sensors.temp.toFixed(1)}
            unit="°C"
            hint={sensors.tempState}
            tone={sensors.tempState === 'Elevated' ? 'warn' : 'lime'}
          />
          <Meter value={sensors.temp - 20} max={22} tone={sensors.tempState === 'Elevated' ? 'bg-warn' : 'bg-lime'} />
        </Frame>
        <Frame title="DHT11 humidity" bodyClassName="p-3">
          <Gauge
            label="Humidity"
            value={sensors.humidity}
            display={sensors.humidity.toFixed(0)}
            unit="% RH"
            hint="Nominal band 45–70"
            tone="sea"
          />
          <Meter value={sensors.humidity} max={100} tone="bg-sea" />
        </Frame>
        <Frame title="Ultrasonic sensor" bodyClassName="p-3">
          <p className="font-display text-3xl text-fog">{formatRange(sensors.distanceCm, sensors.distanceOpen)}</p>
          <p className="mt-1 text-sm text-mute">Distance to the nearest surface along the robot heading.</p>
          <div className="relative mt-4 h-8 border border-line bg-ink">
            <div className="absolute inset-y-0 left-0 bg-lime/25" style={{ width: `${rangePct}%` }} />
            <div className="absolute inset-y-0 w-px bg-lime" style={{ left: `${rangePct}%` }} />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-mute">
            <span>0</span>
            <span>400 cm</span>
          </div>
        </Frame>
        <Frame title="GPS" bodyClassName="p-3">
          <p className="font-mono text-sm leading-relaxed text-fog">{formatCoord(sensors.lat, sensors.lon)}</p>
          <p className="mt-1 text-sm text-mute">Simulated coordinates offset from the map pose. Not a satellite fix.</p>
          <div className="relative mt-3 h-24 border border-line bg-ink">
            <span
              className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-lime"
              style={{ left: `${dotX}%`, top: `${dotY}%` }}
            />
          </div>
        </Frame>
        <Frame title="Signal strength" bodyClassName="p-3">
          <Gauge
            label="Link"
            value={sensors.signal}
            display={sensors.signal}
            unit="%"
            hint={sensors.signal > 70 ? 'Strong' : sensors.signal > 45 ? 'Fair' : 'Weak'}
            tone={sensors.signal > 70 ? 'sea' : sensors.signal > 45 ? 'warn' : 'alert'}
          />
          <Meter value={sensors.signal} max={100} tone="bg-sea" />
        </Frame>
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <Frame title="Temperature history" className="h-56">
          <Trend data={snap.history} dataKey="temp" name="°C" color="#c6e070" domain={[24, 40]} />
        </Frame>
        <Frame title="Humidity history" className="h-56">
          <Trend data={snap.history} dataKey="humidity" name="% RH" color="#8fbfa8" domain={[40, 75]} />
        </Frame>
        <Frame title="Gas history" className="h-56">
          <Trend data={snap.history} dataKey="gas" name="ppm" color="#e0b15a" domain={[0, 600]} />
        </Frame>
      </div>
    </div>
  );
}

function Meter({ value, max, tone }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="mt-3 h-1.5 bg-ink">
      <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
