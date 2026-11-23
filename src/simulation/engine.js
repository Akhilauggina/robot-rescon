import { UNIT_TO_M, TUNING } from './tuning.js';
import { HUMANS, ROBOT_START, obstacles, rooms, walls } from './world.js';
import {
  angDiff,
  blocked,
  castRay,
  clamp,
  hasLineOfSight,
  moveWithSlide,
  pointInRect,
} from './geometry.js';
import { round, wallClock } from './format.js';

function log(state, category, message, level) {
  state.logSeq += 1;
  state.logs = [
    ...state.logs,
    {
      id: state.logSeq,
      category,
      message,
      level,
      mission: state.missionTime,
      wall: wallClock(),
    },
  ].slice(-300);
}

function seedHistory() {
  const rows = [];
  for (let i = 32; i >= 1; i -= 1) {
    rows.push({
      label: `-${i}s`,
      temp: round(26.6 + Math.sin(i * 0.45) * 0.18, 1),
      humidity: round(57.5 + Math.cos(i * 0.33) * 0.45, 1),
      gas: Math.round(100 + Math.sin(i * 0.4) * 6),
      distance: 186,
    });
  }
  return rows;
}

export function createMissionState() {
  const state = {
    phase: 'ready',
    ai: true,
    hint: '',
    missionTime: 0,
    clock: 0,
    roomId: 'west',
    detectionCount: 0,
    obstacleCount: 0,
    detectionStatus: 'SEARCHING',
    warning: null,
    visited: { west: true },
    obstacleArmed: {},
    gasLogged: false,
    lowBatteryLogged: false,
    moveLogged: false,
    movingFor: 0,
    stillFor: 0,
    lastSensorLog: 0,
    histAcc: 0,
    logSeq: 0,
    logs: [],
    keys: new Set(),
    robot: {
      x: ROBOT_START.x,
      y: ROBOT_START.y,
      heading: ROBOT_START.heading,
      distance: 0,
      battery: 100,
      speed: 0,
      moving: false,
      drive: 'IDLE',
    },
    humans: HUMANS.map((human) => ({
      ...human,
      detected: false,
      confidence: 0,
      inView: false,
      detectedAt: 0,
    })),
    sensors: {
      temp: 26.7,
      humidity: 57.6,
      gas: 102,
      distanceCm: 186,
      distanceOpen: false,
      signal: 96,
      lat: 28.61394 + (ROBOT_START.y - 350) * 0.000009,
      lon: 77.20902 + (ROBOT_START.x - 500) * 0.000009,
      gasState: 'Normal',
      tempState: 'Normal',
    },
    history: seedHistory(),
  };

  log(state, 'SYSTEM', 'Simulation initialized — Sector 7-C loaded', 'ok');
  log(state, 'SENSOR', 'Virtual sensors online', 'info');
  log(state, 'VISION', 'Simulated detection standing by', 'info');
  return state;
}

export function makeSnapshot(state) {
  return {
    phase: state.phase,
    ai: state.ai,
    hint: state.hint,
    missionTime: state.missionTime,
    roomId: state.roomId,
    detectionCount: state.detectionCount,
    obstacleCount: state.obstacleCount,
    detectionStatus: state.detectionStatus,
    warning: state.warning ? { ...state.warning } : null,
    visited: state.visited,
    robot: { ...state.robot },
    humans: state.humans.map((human) => ({ ...human })),
    sensors: {
      temp: round(state.sensors.temp, 1),
      humidity: round(state.sensors.humidity, 1),
      gas: Math.round(state.sensors.gas),
      distanceCm: Math.round(state.sensors.distanceCm),
      distanceOpen: state.sensors.distanceOpen,
      signal: Math.round(state.sensors.signal),
      lat: state.sensors.lat,
      lon: state.sensors.lon,
      gasState: state.sensors.gasState,
      tempState: state.sensors.tempState,
    },
    history: state.history,
    logs: state.logs,
    humanTotal: state.humans.length,
  };
}

function confidenceFor(dist, diff) {
  const distanceFactor = 1 - dist / TUNING.detectRange;
  const angleFactor = 1 - Math.abs(diff) / (TUNING.fov / 2);
  const wobble = Math.sin(dist * 0.17) * 1.4;
  return clamp(Math.round(71 + distanceFactor * 18 + angleFactor * 8 + wobble), 66, 97);
}

function updateSensors(state, dt) {
  const room = rooms.find((item) => pointInRect(state.robot.x, state.robot.y, item)) || null;
  if (room) state.roomId = room.id;
  const inHeat = room?.tone === 'heat';
  const inGas = room?.tone === 'gas';
  state.clock += dt;

  const targetTemp = 26.6 + (inHeat ? 8.4 : 0) + Math.sin(state.clock * 0.17) * 0.2;
  const targetHum = 57.4 - (inHeat ? 6.5 : 0) + (inGas ? 3.5 : 0) + Math.sin(state.clock * 0.13) * 0.55;
  const targetGas = (inGas ? 455 : 98) + Math.sin(state.clock * (inGas ? 0.85 : 0.22)) * (inGas ? 22 : 7);
  const blend = 1 - Math.exp(-dt * (inGas || inHeat ? 1.7 : 0.65));
  state.sensors.temp += (targetTemp - state.sensors.temp) * blend;
  state.sensors.humidity = clamp(
    state.sensors.humidity + (targetHum - state.sensors.humidity) * blend,
    30,
    90,
  );
  state.sensors.gas = Math.max(40, state.sensors.gas + (targetGas - state.sensors.gas) * blend);

  const ray = castRay(
    state.robot.x,
    state.robot.y,
    state.robot.heading,
    walls,
    obstacles,
    TUNING.cameraRange,
  );
  state.ray = ray;
  const cm = ray.kind ? Math.min(400, ray.dist * 2) : 400;
  state.sensors.distanceCm += (cm - state.sensors.distanceCm) * Math.min(1, dt * 8);
  state.sensors.distanceOpen = !ray.kind || cm >= 400;

  const far = Math.hypot(state.robot.x - ROBOT_START.x, state.robot.y - ROBOT_START.y);
  const targetSignal = clamp(97 - far * 0.034 + Math.sin(state.clock * 0.45) * 1.1, 34, 99);
  state.sensors.signal += (targetSignal - state.sensors.signal) * Math.min(1, dt * 2);
  state.sensors.lat = 28.61394 + (state.robot.y - 350) * 0.000009;
  state.sensors.lon = 77.20902 + (state.robot.x - 500) * 0.000009;
  state.sensors.gasState = state.sensors.gas >= 280 ? 'Warning' : 'Normal';
  state.sensors.tempState = state.sensors.temp >= 33 ? 'Elevated' : 'Normal';

  if (state.phase === 'running' && room && !state.visited[room.id]) {
    state.visited = { ...state.visited, [room.id]: true };
    log(state, 'NAV', `Environment scan — entered ${room.name}`, 'info');
  }

  if (state.phase === 'running' && inGas && !state.gasLogged) {
    state.gasLogged = true;
    log(state, 'HAZARD', 'Gas status warning — elevated reading in the current zone', 'warn');
  }
  if (!inGas && state.sensors.gas < 180) state.gasLogged = false;

  state.histAcc += dt;
  if (state.histAcc >= 1) {
    state.histAcc = 0;
    state.history = [
      ...state.history.slice(-47),
      {
        label: `${Math.floor(state.clock)}s`,
        temp: round(state.sensors.temp, 1),
        humidity: round(state.sensors.humidity, 1),
        gas: Math.round(state.sensors.gas),
        distance: Math.round(state.sensors.distanceCm),
      },
    ];
  }
}

function scanHumans(state) {
  const { robot } = state;
  let seeing = false;

  if (!state.ai) {
    for (let i = 0; i < state.humans.length; i += 1) state.humans[i].inView = false;
    state.detectionStatus = state.humans.some((human) => human.detected) ? 'TARGET MARKED' : 'SEARCHING';
    return;
  }

  for (let i = 0; i < state.humans.length; i += 1) {
    const human = state.humans[i];
    const dx = human.x - robot.x;
    const dy = human.y - robot.y;
    const dist = Math.hypot(dx, dy);
    const diff = angDiff(Math.atan2(dy, dx), robot.heading);
    const visible =
      dist <= TUNING.detectRange &&
      Math.abs(diff) <= TUNING.fov / 2 &&
      hasLineOfSight(robot.x, robot.y, human.x, human.y, walls, obstacles);

    human.inView = visible;
    if (!visible) continue;
    seeing = true;
    human.confidence = confidenceFor(dist, diff);
    if (!human.detected) {
      human.detected = true;
      human.detectedAt = typeof performance !== 'undefined' ? performance.now() : Date.now();
      state.detectionCount += 1;
      log(
        state,
        'VISION',
        `Human detected — ${human.callsign} · simulated confidence ${human.confidence}%`,
        'ok',
      );
      log(state, 'VISION', `Human location marked — ${human.id} ${human.callsign}`, 'ok');
    }
  }

  if (seeing) state.detectionStatus = 'HUMAN DETECTED';
  else if (state.humans.some((human) => human.detected)) state.detectionStatus = 'TARGET MARKED';
  else state.detectionStatus = 'SEARCHING';
}

function scanObstacles(state) {
  const ray = state.ray;
  if (ray?.kind === 'obstacle' && ray.dist < TUNING.obstacleWarn) {
    state.warning = {
      kind: 'obstacle',
      id: ray.id,
      label: ray.label,
      dist: ray.dist,
    };
    if (state.obstacleArmed[ray.id] !== false) {
      state.obstacleArmed[ray.id] = false;
      state.obstacleCount += 1;
      log(
        state,
        'HAZARD',
        `Obstacle detected — ${ray.label} at ${(ray.dist * UNIT_TO_M).toFixed(2)} m`,
        'warn',
      );
    }
  } else if (ray?.kind === 'wall' && ray.dist < 32) {
    state.warning = { kind: 'wall', id: 'wall', label: 'Structure', dist: ray.dist };
  } else {
    state.warning = null;
  }

  for (let i = 0; i < obstacles.length; i += 1) {
    const obstacle = obstacles[i];
    const dist = Math.hypot(obstacle.x - state.robot.x, obstacle.y - state.robot.y);
    if (dist > obstacle.r + TUNING.obstacleRearm) state.obstacleArmed[obstacle.id] = true;
  }
}

function trackMotionLog(state, dt) {
  if (state.robot.moving) {
    state.stillFor = 0;
    state.movingFor += dt;
    if (!state.moveLogged && state.movingFor > 0.4) {
      state.moveLogged = true;
      log(state, 'NAV', 'Robot moving', 'info');
    }
  } else {
    state.movingFor = 0;
    state.stillFor += dt;
    if (state.stillFor > 2.4) state.moveLogged = false;
  }
}

export function updateMission(state, dt) {
  const keys = state.keys;
  const driveKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
  const wantsDrive = driveKeys.some((key) => keys.has(key));
  if (wantsDrive && state.phase !== 'running') state.hint = 'Start the simulation to enable drive';
  else if (state.phase === 'running') state.hint = '';

  if (state.phase === 'running') {
    state.missionTime += dt;
    let turn = 0;
    let throttle = 0;
    if (keys.has('a') || keys.has('arrowleft')) turn -= 1;
    if (keys.has('d') || keys.has('arrowright')) turn += 1;
    if (keys.has('w') || keys.has('arrowup')) throttle += 1;
    if (keys.has('s') || keys.has('arrowdown')) throttle -= TUNING.reverseScale;

    state.robot.heading += turn * TUNING.turnSpeed * dt;
    if (state.robot.heading > Math.PI) state.robot.heading -= Math.PI * 2;
    if (state.robot.heading < -Math.PI) state.robot.heading += Math.PI * 2;

    const power = state.robot.battery <= 0 ? 0 : 0.55 + 0.45 * (state.robot.battery / 100);
    const step = throttle * TUNING.moveSpeed * power * dt;

    if (state.robot.battery <= 0 && throttle !== 0 && !state.lowBatteryLogged) {
      state.lowBatteryLogged = true;
      log(state, 'SYSTEM', 'Battery depleted — drive disabled until reset', 'alert');
    }

    if (step !== 0 && state.robot.battery > 0) {
      const dx = Math.cos(state.robot.heading) * step;
      const dy = Math.sin(state.robot.heading) * step;
      const next = moveWithSlide(
        state.robot.x,
        state.robot.y,
        dx,
        dy,
        TUNING.robotRadius,
        walls,
        obstacles,
      );
      const moved = Math.hypot(next.x - state.robot.x, next.y - state.robot.y);
      state.robot.x = next.x;
      state.robot.y = next.y;
      state.robot.distance += moved;
      state.robot.speed = dt > 0 ? moved / dt : 0;
      state.robot.moving = moved > 0.6;
      state.robot.drive = moved > 0.6 ? 'MOVING' : 'BLOCKED';
      state.robot.battery = Math.max(0, state.robot.battery - TUNING.batteryDrainMove * dt);
    } else {
      state.robot.speed = 0;
      state.robot.moving = false;
      state.robot.drive = 'IDLE';
      state.robot.battery = Math.max(0, state.robot.battery - TUNING.batteryDrainIdle * dt);
    }

    if (turn !== 0) {
      state.robot.battery = Math.max(0, state.robot.battery - TUNING.batteryDrainIdle * dt);
    }
  } else {
    state.robot.speed = 0;
    state.robot.moving = false;
    state.robot.drive = state.phase === 'paused' ? 'PAUSED' : 'IDLE';
  }

  updateSensors(state, dt);

  if (state.phase === 'running') {
    scanHumans(state);
    scanObstacles(state);
    trackMotionLog(state, dt);
    if (state.missionTime - state.lastSensorLog > 42) {
      state.lastSensorLog = state.missionTime;
      log(
        state,
        'SENSOR',
        `Sensor values updated — ${state.sensors.temp.toFixed(1)}°C, ${state.sensors.humidity.toFixed(0)}% RH, gas ${Math.round(state.sensors.gas)} ppm`,
        'info',
      );
    }
  } else {
    for (let i = 0; i < state.humans.length; i += 1) state.humans[i].inView = false;
    state.warning = null;
    state.detectionStatus = state.humans.some((human) => human.detected) ? 'TARGET MARKED' : 'SEARCHING';
  }
}

export function commandStart(state) {
  if (state.phase === 'running') return;
  const resumed = state.phase === 'paused';
  state.phase = 'running';
  state.hint = '';
  log(state, 'SYSTEM', resumed ? 'Simulation resumed' : 'Robot started', 'ok');
  if (state.ai) log(state, 'VISION', 'Environment scan started', 'ok');
}

export function commandPause(state) {
  if (state.phase !== 'running') return;
  state.phase = 'paused';
  state.robot.moving = false;
  state.robot.speed = 0;
  state.robot.drive = 'PAUSED';
  log(state, 'SYSTEM', 'Mission paused', 'warn');
}

export function commandReset(state) {
  const keys = state.keys;
  keys.clear();
  const fresh = createMissionState();
  fresh.keys = keys;
  Object.keys(state).forEach((key) => {
    delete state[key];
  });
  Object.assign(state, fresh);
  log(state, 'SYSTEM', 'Simulation reset', 'warn');
}

export function commandClearLog(state) {
  state.logs = [];
  log(state, 'SYSTEM', 'Mission log cleared', 'info');
}

export function commandAi(state, enabled) {
  if (state.ai === enabled) return;
  state.ai = enabled;
  if (!enabled) {
    for (let i = 0; i < state.humans.length; i += 1) state.humans[i].inView = false;
    state.detectionStatus = state.humans.some((human) => human.detected) ? 'TARGET MARKED' : 'SEARCHING';
    log(state, 'VISION', 'AI detection disabled', 'warn');
    return;
  }
  log(state, 'VISION', 'AI detection enabled', 'ok');
  if (state.phase === 'running') log(state, 'VISION', 'Environment scan started', 'ok');
}

export function poseBlocked(x, y) {
  return blocked(x, y, TUNING.robotRadius, walls, obstacles);
}
