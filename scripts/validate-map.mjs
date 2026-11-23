import { TUNING } from '../src/simulation/tuning.js';
import { HUMANS, obstacles, walls, WORLD } from '../src/simulation/world.js';
import { blocked } from '../src/simulation/geometry.js';
import { createMissionState, poseBlocked, updateMission } from '../src/simulation/engine.js';

const radius = TUNING.robotRadius;
let failed = 0;

function check(name, condition, detail = '') {
  if (condition) {
    console.log(`ok  ${name}`);
    return;
  }
  failed += 1;
  console.error(`FAIL ${name} ${detail}`);
}

function insideWorld(x, y) {
  return x > radius && y > radius && x < WORLD.width - radius && y < WORLD.height - radius;
}

const start = createMissionState();
check('start is clear', !poseBlocked(start.robot.x, start.robot.y));
check('start inside world', insideWorld(start.robot.x, start.robot.y));

for (const human of HUMANS) {
  const onWall = walls.some(
    (wall) => human.x >= wall.x && human.x <= wall.x + wall.w && human.y >= wall.y && human.y <= wall.y + wall.h,
  );
  const onRubble = obstacles.some((item) => Math.hypot(item.x - human.x, item.y - human.y) < item.r + 10);
  check(`${human.id} is in open space`, !onWall && !onRubble, `wall=${onWall} rubble=${onRubble}`);
}

function reachable(targets) {
  const step = 8;
  const key = (x, y) => `${Math.round(x / step)},${Math.round(y / step)}`;
  const queue = [[start.robot.x, start.robot.y]];
  const seen = new Set([key(start.robot.x, start.robot.y)]);
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  const found = new Set();
  while (queue.length) {
    const [x, y] = queue.shift();
    for (const target of targets) {
      if (!found.has(target.id) && Math.hypot(target.x - x, target.y - y) <= 36) found.add(target.id);
    }
    if (found.size === targets.length) break;
    for (const [dx, dy] of dirs) {
      const nx = x + dx * step;
      const ny = y + dy * step;
      const id = key(nx, ny);
      if (seen.has(id)) continue;
      if (!insideWorld(nx, ny)) continue;
      if (blocked(nx, ny, radius, walls, obstacles)) continue;
      seen.add(id);
      queue.push([nx, ny]);
    }
  }
  return found;
}

const reached = reachable(HUMANS);
for (const human of HUMANS) {
  check(`${human.id} reachable`, reached.has(human.id));
}

const north = createMissionState();
north.phase = 'running';
north.robot.heading = -Math.PI / 2;
north.keys.add('w');
for (let i = 0; i < 240; i += 1) updateMission(north, 1 / 60);
check('north wall blocks the robot', north.robot.y > 218 && north.robot.y < 260, `y=${north.robot.y.toFixed(1)}`);
check('north stop is not inside geometry', !poseBlocked(north.robot.x, north.robot.y));

const east = createMissionState();
east.phase = 'running';
east.keys.add('w');
for (let i = 0; i < 150; i += 1) updateMission(east, 1 / 60);
check('forward drive enters the hall', east.robot.x > 260, `x=${east.robot.x.toFixed(1)}`);
check('drive pose stays legal', !poseBlocked(east.robot.x, east.robot.y), `x=${east.robot.x.toFixed(1)} y=${east.robot.y.toFixed(1)}`);
check('survivor in the hall is detected', east.detectionCount >= 1, `count=${east.detectionCount}`);
check('detection status is live', east.detectionStatus === 'HUMAN DETECTED' || east.humans.some((h) => h.detected));
check('mission log records the detection', east.logs.some((entry) => entry.message.includes('Human detected')));

const paused = createMissionState();
paused.phase = 'running';
paused.keys.add('w');
updateMission(paused, 1 / 60);
const xBefore = paused.robot.x;
paused.phase = 'paused';
for (let i = 0; i < 30; i += 1) updateMission(paused, 1 / 60);
check('pause holds position', Math.abs(paused.robot.x - xBefore) < 0.01);

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nMap, collision, and detection checks passed.');
