export default function StatusArt({ heading, active }) {
  const deg = (heading * 180) / Math.PI;
  return (
    <svg viewBox="0 0 280 150" className="h-full w-full" role="img" aria-label="Robot status graphic">
      <rect x="0.5" y="0.5" width="279" height="149" fill="#101613" stroke="#314038" />
      <g className="radar-sweep" style={{ transformBox: 'view-box', transformOrigin: '78px 75px' }}>
        <path d="M78 75 L128 42 A 58 58 0 0 1 132 108 Z" fill="rgba(198,224,112,0.13)" />
      </g>
      <circle cx="78" cy="75" r="58" fill="none" stroke="rgba(154,165,109,0.35)" />
      <circle cx="78" cy="75" r="36" fill="none" stroke="rgba(154,165,109,0.25)" />
      <path d="M78 17 V75 M20 75 H78" stroke="rgba(154,165,109,0.25)" />
      <g transform={`rotate(${deg} 78 75)`}>
        <rect x="62" y="64" width="34" height="8" fill="#1a2420" stroke="#667056" />
        <rect x="62" y="78" width="34" height="8" fill="#1a2420" stroke="#667056" />
        <rect x="66" y="68" width="28" height="14" fill="#24362c" stroke="#c6e070" />
        <path d="M94 70 L104 75 L94 80 Z" fill="#c6e070" />
      </g>
      <text x="150" y="28" fill="#9aa56d" fontFamily="Rajdhani, sans-serif" fontSize="13" letterSpacing="1.5">
        UNIT RR-01
      </text>
      <text x="150" y="52" fill="#e7ece4" fontFamily="Rajdhani, sans-serif" fontSize="22">
        {active ? 'SURVEYING' : 'HOLDING'}
      </text>
      <text x="150" y="78" fill="#93a096" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        TRACKED CHASSIS
      </text>
      <text x="150" y="96" fill="#93a096" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        FORWARD CAMERA
      </text>
      <text x="150" y="114" fill="#c6e070" fontFamily="IBM Plex Mono, monospace" fontSize="11">
        {active ? 'DRIVE LINK LIVE' : 'DRIVE LINK STANDBY'}
      </text>
    </svg>
  );
}
