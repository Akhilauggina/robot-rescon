export default function SimTag({ children = 'SIM' }) {
  return (
    <span className="border border-olive/40 px-1 py-px font-mono text-[9px] tracking-[0.14em] text-olive">
      {children}
    </span>
  );
}

export function SimBanner({ children }) {
  return (
    <div className="flex items-center gap-2 border border-olive/35 bg-olive/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-lime">
      <span className="h-1.5 w-1.5 bg-lime" />
      {children}
    </div>
  );
}
