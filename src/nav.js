import { Activity, Eye, Info, Navigation, Radar, ScrollText } from 'lucide-react';

export const NAV = [
  { to: '/', label: 'Mission Overview', icon: Radar, end: true },
  { to: '/simulation', label: 'Robot Simulation', icon: Navigation },
  { to: '/vision', label: 'AI Vision Simulation', icon: Eye },
  { to: '/sensors', label: 'Sensor Monitoring', icon: Activity },
  { to: '/logs', label: 'Mission Logs', icon: ScrollText },
  { to: '/project', label: 'Project Info', icon: Info },
];
