import SimTag from './SimTag';

const TONES = {
  default: 'text-fog',
  ok: 'text-lime',
  warn: 'text-warn',
  alert: 'text-alert',
  sea: 'text-sea',
};

export default function Stat({ label, value, unit, hint, tone = 'default' }) {
  return (
    <div className="min-w-0 border border-line bg-ink/50 px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[10px] font-medium uppercase tracking-[0.16em] text-mute">{label}</p>
        <SimTag />
      </div>
      <p className={`mt-1 font-display text-[26px] leading-none tracking-wide ${TONES[tone]}`}>
        {value}
        {unit ? <span className="ml-1 font-sans text-[12px] tracking-normal text-mute">{unit}</span> : null}
      </p>
      {hint ? <p className="mt-1 truncate text-[11px] text-mute">{hint}</p> : null}
    </div>
  );
}
