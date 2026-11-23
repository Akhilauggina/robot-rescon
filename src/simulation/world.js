export const SITE = {
  code: 'Sector 7-C',
  title: 'Collapsed East Wing',
  version: '1.0',
};

export const WORLD = { width: 1000, height: 700 };

export const ROBOT_START = { x: 100, y: 300, heading: 0 };

export const walls = [
  { id: 'bound-n', x: 0, y: 0, w: 1000, h: 12 },
  { id: 'bound-s', x: 0, y: 688, w: 1000, h: 12 },
  { id: 'bound-w', x: 0, y: 0, w: 12, h: 700 },
  { id: 'bound-e', x: 988, y: 0, w: 12, h: 700 },

  { id: 'sp-w-n', x: 220, y: 12, w: 12, h: 188 },
  { id: 'sp-w-a', x: 220, y: 212, w: 12, h: 40 },
  { id: 'sp-w-b', x: 220, y: 360, w: 12, h: 90 },
  { id: 'sp-w-s', x: 220, y: 462, w: 12, h: 226 },

  { id: 'sp-e-n', x: 770, y: 12, w: 12, h: 188 },
  { id: 'sp-e-a', x: 770, y: 212, w: 12, h: 50 },
  { id: 'sp-e-b', x: 770, y: 370, w: 12, h: 80 },
  { id: 'sp-e-s', x: 770, y: 462, w: 12, h: 113 },

  { id: 'h1-a', x: 12, y: 200, w: 100, h: 12 },
  { id: 'h1-b', x: 340, y: 200, w: 240, h: 12 },
  { id: 'h1-c', x: 680, y: 200, w: 90, h: 12 },
  { id: 'h1-d', x: 900, y: 200, w: 88, h: 12 },

  { id: 'h2-a', x: 12, y: 450, w: 90, h: 12 },
  { id: 'h2-b', x: 360, y: 450, w: 180, h: 12 },
  { id: 'h2-c', x: 650, y: 450, w: 120, h: 12 },
  { id: 'h2-d', x: 900, y: 450, w: 88, h: 12 },

  { id: 'h3-a', x: 12, y: 575, w: 140, h: 12 },
  { id: 'h3-b', x: 260, y: 575, w: 220, h: 12 },
  { id: 'h3-c', x: 640, y: 575, w: 120, h: 12 },
  { id: 'h3-d', x: 860, y: 575, w: 128, h: 12 },
];

export const rooms = [
  { id: 'nw', name: 'NW Ward', x: 12, y: 12, w: 208, h: 188, tone: 'room' },
  { id: 'north', name: 'North Ward', x: 232, y: 12, w: 538, h: 188, tone: 'heat' },
  { id: 'ne', name: 'NE Ward', x: 782, y: 12, w: 206, h: 188, tone: 'room' },
  { id: 'west', name: 'West Corridor', x: 12, y: 212, w: 208, h: 238, tone: 'corridor' },
  { id: 'hall', name: 'Central Hall', x: 232, y: 212, w: 538, h: 238, tone: 'hall' },
  { id: 'east', name: 'East Access', x: 782, y: 212, w: 206, h: 238, tone: 'corridor' },
  { id: 'sw', name: 'SW Room', x: 12, y: 462, w: 208, h: 113, tone: 'room' },
  { id: 'south', name: 'South Passage', x: 232, y: 462, w: 538, h: 113, tone: 'hall' },
  { id: 'gas', name: 'Gas Pocket', x: 782, y: 462, w: 206, h: 113, tone: 'gas' },
  { id: 'rescue', name: 'Extraction Zone', x: 12, y: 587, w: 976, h: 101, tone: 'rescue' },
];

export const sills = [
  { x: 112, y: 198, w: 108, h: 16 },
  { x: 232, y: 198, w: 108, h: 16 },
  { x: 580, y: 198, w: 100, h: 16 },
  { x: 782, y: 198, w: 118, h: 16 },
  { x: 214, y: 252, w: 24, h: 108 },
  { x: 764, y: 262, w: 24, h: 108 },
  { x: 102, y: 444, w: 118, h: 18 },
  { x: 232, y: 444, w: 128, h: 18 },
  { x: 540, y: 444, w: 110, h: 18 },
  { x: 782, y: 444, w: 118, h: 18 },
  { x: 152, y: 569, w: 108, h: 18 },
  { x: 480, y: 569, w: 160, h: 18 },
  { x: 760, y: 569, w: 100, h: 18 },
];

export const HUMANS = [
  { id: 'H-01', callsign: 'Survivor Alpha', x: 92, y: 108 },
  { id: 'H-02', callsign: 'Survivor Bravo', x: 500, y: 278 },
  { id: 'H-03', callsign: 'Survivor Charlie', x: 900, y: 108 },
  { id: 'H-04', callsign: 'Survivor Delta', x: 108, y: 520 },
  { id: 'H-05', callsign: 'Survivor Echo', x: 460, y: 96 },
];

export const obstacles = [
  { id: 'R-01', label: 'Collapsed slab', x: 630, y: 246, r: 26 },
  { id: 'R-02', label: 'Rubble pile', x: 400, y: 392, r: 30 },
  { id: 'R-03', label: 'Fallen beam', x: 154, y: 146, r: 18 },
  { id: 'R-04', label: 'Masonry', x: 868, y: 518, r: 24 },
  { id: 'R-05', label: 'Debris mound', x: 520, y: 512, r: 22 },
  { id: 'R-06', label: 'Rebar cluster', x: 710, y: 640, r: 20 },
  { id: 'R-07', label: 'Ceiling debris', x: 650, y: 128, r: 16 },
];

export const scars = [
  [48, 70, 120, 54],
  [70, 250, 150, 274],
  [360, 300, 430, 286],
  [540, 360, 610, 348],
  [820, 280, 900, 320],
  [300, 620, 390, 652],
  [140, 490, 190, 530],
];
