export function round(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function formatMission(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const hh = String(Math.floor(total / 3600)).padStart(2, '0');
  const mm = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const ss = String(total % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function compassDeg(heading) {
  const deg = (heading * 180) / Math.PI;
  const wrapped = ((deg % 360) + 360) % 360;
  return Math.round((wrapped + 90) % 360) % 360;
}

const CARDINALS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export function cardinal(heading) {
  return CARDINALS[Math.round(compassDeg(heading) / 45) % 8];
}

export function formatHeading(heading) {
  return `${String(compassDeg(heading)).padStart(3, '0')}° ${cardinal(heading)}`;
}

export function formatCoord(lat, lon) {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(5)}° ${ns}   ${Math.abs(lon).toFixed(5)}° ${ew}`;
}

export function formatRange(cm, open) {
  if (open || cm >= 399) return '> 400 cm';
  return `${Math.round(cm)} cm`;
}

export function wallClock() {
  return new Date().toLocaleTimeString('en-GB', { hour12: false });
}
