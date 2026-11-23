import { useMemo, useState } from 'react';
import Frame from '../components/Frame';
import { useSim } from '../context/SimulationContext';
import { formatMission } from '../simulation/format';

const FILTERS = ['ALL', 'SYSTEM', 'NAV', 'VISION', 'HAZARD', 'SENSOR'];

const LEVEL = {
  ok: 'text-lime',
  info: 'text-sea',
  warn: 'text-warn',
  alert: 'text-alert',
};

export default function MissionLogs() {
  const { snap, clearLog } = useSim();
  const [filter, setFilter] = useState('ALL');
  const rows = useMemo(() => {
    const list = [...snap.logs].reverse();
    if (filter === 'ALL') return list;
    return list.filter((entry) => entry.category === filter);
  }, [filter, snap.logs]);

  return (
    <div className="flex flex-col gap-3 p-3 lg:p-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-olive">EVENT RECORDER</p>
          <h1 className="font-display text-4xl tracking-wide text-fog">Mission Logs</h1>
          <p className="mt-1 text-sm text-mute">
            {snap.logs.length} simulated events. Newest entries are listed first.
          </p>
        </div>
        <button type="button" className="btn-ghost" onClick={clearLog}>
          Clear log
        </button>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`border px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] ${
              filter === item ? 'border-lime/50 bg-lime/10 text-lime' : 'border-line text-mute hover:text-fog'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <Frame title="Live mission events">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="sticky top-0 border-b border-line bg-panel font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
              <tr>
                <th className="px-3 py-2 font-medium">Mission</th>
                <th className="px-3 py-2 font-medium">Clock</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Event</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-mute">
                    No events in this category.
                  </td>
                </tr>
              ) : (
                rows.map((entry) => (
                  <tr key={entry.id} className="border-b border-line/70">
                    <td className="px-3 py-2 font-mono text-[12px] text-mute">{formatMission(entry.mission)}</td>
                    <td className="px-3 py-2 font-mono text-[12px] text-mute">{entry.wall}</td>
                    <td className={`px-3 py-2 font-mono text-[11px] tracking-[0.12em] ${LEVEL[entry.level] || 'text-fog'}`}>
                      {entry.category}
                    </td>
                    <td className="px-3 py-2 text-fog/90">{entry.message}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Frame>
    </div>
  );
}
