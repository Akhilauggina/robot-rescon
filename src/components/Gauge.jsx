const TONES = {
  lime: '#c6e070',
  sea: '#8fbfa8',
  warn: '#e0b15a',
  alert: '#d97862',
};

export default function Gauge({ value, min = 0, max = 100, display, unit, label, hint, tone = 'lime' }) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  const length = Math.PI * 46;
  const color = TONES[tone] || TONES.lime;

  return (
    <div>
      <svg viewBox="0 0 120 78" className="mx-auto h-[92px] w-full max-w-[220px]" aria-hidden>
        <path d="M14 68 A46 46 0 0 1 106 68" fill="none" stroke="#24302a" strokeWidth="8" />
        <path
          d="M14 68 A46 46 0 0 1 106 68"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${pct * length} ${length}`}
          strokeLinecap="butt"
        />
      </svg>
      <p className="-mt-3 text-center text-[10px] uppercase tracking-[0.16em] text-mute">{label}</p>
      <p className="text-center font-display text-[30px] leading-none tracking-wide text-fog">
        {display}
        {unit ? <span className="ml-1 font-sans text-xs tracking-normal text-mute">{unit}</span> : null}
      </p>
      {hint ? <p className="mt-1 text-center text-[11px] text-mute">{hint}</p> : null}
    </div>
  );
}
