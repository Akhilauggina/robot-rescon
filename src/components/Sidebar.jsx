import { NavLink } from 'react-router-dom';
import { NAV } from '../nav';
import { SITE } from '../simulation/world';

export default function Sidebar({ open }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col border-r border-line bg-[#121916] transition-transform duration-200 lg:static lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="border-b border-line px-4 py-4">
        <div className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden>
            <rect x="1" y="1" width="30" height="30" fill="none" stroke="#9aa56d" />
            <path d="M16 5 L25 16 L16 27 L7 16 Z" fill="none" stroke="#c6e070" strokeWidth="1.4" />
            <circle cx="16" cy="16" r="2.2" fill="#c6e070" />
          </svg>
          <div>
            <p className="font-display text-[18px] font-semibold leading-none tracking-[0.16em] text-fog">
              RESCUE RECON
            </p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-mute">MONITORING SUITE</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-3" aria-label="Primary">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 border-l-2 px-3 py-2.5 text-[13px] tracking-wide transition-colors ${
                  isActive
                    ? 'border-lime bg-lime/10 text-lime'
                    : 'border-transparent text-fog/85 hover:border-olive/50 hover:bg-white/[0.03] hover:text-fog'
                }`
              }
            >
              <Icon size={16} strokeWidth={1.75} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-line px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="status-dot h-1.5 w-1.5 bg-lime" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-olive">Simulation Mode</p>
        </div>
        <p className="mt-1 font-display text-sm tracking-[0.12em] text-fog">SOFTWARE ONLY</p>
        <p className="mt-3 font-mono text-[11px] text-mute">System Version {SITE.version}</p>
        <p className="font-mono text-[10px] text-mute/80">{SITE.code}</p>
      </div>
    </aside>
  );
}
