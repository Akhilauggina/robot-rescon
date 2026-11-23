export default function Frame({ title, right, children, className = '', bodyClassName = '' }) {
  return (
    <section className={`relative flex min-h-0 flex-col border border-line bg-panel/95 ${className}`}>
      <span className="pointer-events-none absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-olive/80" />
      <span className="pointer-events-none absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-olive/80" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-olive/80" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-olive/80" />
      {title ? (
        <header className="flex h-9 shrink-0 items-center justify-between gap-3 border-b border-line px-3">
          <h2 className="truncate font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-olive">
            {title}
          </h2>
          {right ? <div className="shrink-0 text-[11px] text-mute">{right}</div> : null}
        </header>
      ) : null}
      <div className={`relative min-h-0 flex-1 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
