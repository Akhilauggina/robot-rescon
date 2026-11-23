import { TUNING } from './tuning.js';
import { obstacles, rooms, scars, sills, walls, WORLD } from './world.js';

const ROOM_FILL = {
  room: '#18241e',
  heat: '#1b261c',
  corridor: '#131a17',
  hall: '#15201b',
  gas: '#241c14',
  rescue: '#132118',
};

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawMap(ctx, state) {
  ctx.clearRect(0, 0, WORLD.width, WORLD.height);
  ctx.fillStyle = '#101613';
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  for (let i = 0; i < rooms.length; i += 1) {
    const room = rooms[i];
    ctx.fillStyle = ROOM_FILL[room.tone] || ROOM_FILL.room;
    ctx.fillRect(room.x, room.y, room.w, room.h);
    if (room.tone === 'heat') {
      ctx.fillStyle = 'rgba(224, 177, 90, 0.045)';
      ctx.fillRect(room.x, room.y, room.w, room.h);
    }
    if (room.tone === 'gas') {
      ctx.fillStyle = 'rgba(217, 120, 98, 0.08)';
      ctx.fillRect(room.x, room.y, room.w, room.h);
    }
    if (room.tone === 'rescue') {
      ctx.save();
      ctx.beginPath();
      ctx.rect(room.x, room.y, room.w, room.h);
      ctx.clip();
      ctx.strokeStyle = 'rgba(198, 224, 112, 0.09)';
      ctx.lineWidth = 1;
      for (let x = -room.h; x < room.w; x += 16) {
        ctx.beginPath();
        ctx.moveTo(room.x + x, room.y);
        ctx.lineTo(room.x + x + room.h, room.y + room.h);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  ctx.strokeStyle = 'rgba(154, 165, 109, 0.045)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= WORLD.width; x += 40) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, WORLD.height);
  }
  for (let y = 0; y <= WORLD.height; y += 40) {
    ctx.moveTo(0, y);
    ctx.lineTo(WORLD.width, y);
  }
  ctx.stroke();

  ctx.fillStyle = 'rgba(198, 224, 112, 0.045)';
  for (let i = 0; i < sills.length; i += 1) {
    const sill = sills[i];
    ctx.fillRect(sill.x, sill.y, sill.w, sill.h);
  }

  ctx.strokeStyle = 'rgba(154, 165, 109, 0.18)';
  ctx.lineWidth = 1;
  for (let i = 0; i < scars.length; i += 1) {
    const [x1, y1, x2, y2] = scars[i];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  for (let i = 0; i < walls.length; i += 1) {
    const wall = walls[i];
    ctx.fillStyle = wall.id.startsWith('bound') ? '#3c4a40' : '#314239';
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    ctx.fillStyle = 'rgba(198, 224, 112, 0.18)';
    ctx.fillRect(wall.x, wall.y, wall.w, Math.min(2, wall.h));
  }

  const hotId = state.warning?.kind === 'obstacle' ? state.warning.id : null;
  for (let i = 0; i < obstacles.length; i += 1) {
    drawRubble(ctx, obstacles[i], obstacles[i].id === hotId);
  }

  const now = typeof performance !== 'undefined' ? performance.now() : 0;
  for (let i = 0; i < state.humans.length; i += 1) {
    drawHuman(ctx, state.humans[i], now);
  }

  drawFov(ctx, state.robot);
  drawRobot(ctx, state.robot, state.robot.drive === 'BLOCKED');
  drawLabels(ctx, state);
  drawScale(ctx);
}

function drawRubble(ctx, obstacle, hot) {
  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);
  ctx.beginPath();
  const steps = 8;
  for (let i = 0; i < steps; i += 1) {
    const angle = (i / steps) * Math.PI * 2 - 0.3;
    const mag = obstacle.r * (0.78 + ((i * 3) % 4) * 0.06);
    const x = Math.cos(angle) * mag;
    const y = Math.sin(angle) * mag * 0.92;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = hot ? '#6d5436' : '#3e4638';
  ctx.fill();
  ctx.lineWidth = hot ? 2.5 : 1.25;
  ctx.strokeStyle = hot ? '#e0b15a' : '#6a7560';
  ctx.stroke();
  ctx.restore();
}

function drawHuman(ctx, human, now) {
  ctx.save();
  ctx.translate(human.x, human.y);
  if (human.detected && human.detectedAt) {
    const age = (now - human.detectedAt) / 1000;
    if (age >= 0 && age < 1.7) {
      ctx.beginPath();
      ctx.arc(0, 0, 14 + age * 26, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(198, 224, 112, ${1 - age / 1.7})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  ctx.fillStyle = human.detected ? '#d7e7ae' : '#d2b48c';
  ctx.beginPath();
  ctx.ellipse(0, 3, 7.2, 5.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -6, 4.1, 0, Math.PI * 2);
  ctx.fill();

  if (human.inView) {
    ctx.strokeStyle = '#c6e070';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(-16, -20, 32, 36);
    ctx.fillStyle = '#c6e070';
    ctx.font = '600 12px Rajdhani, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('HUMAN DETECTED', -16, -28);
    ctx.font = '500 11px "IBM Plex Mono", monospace';
    ctx.fillText(`${human.confidence}% SIM`, -16, 28);
  } else if (human.detected) {
    ctx.strokeStyle = 'rgba(198, 224, 112, 0.85)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-13, -16, 26, 30);
    ctx.fillStyle = '#c6e070';
    ctx.font = '600 11px Rajdhani, sans-serif';
    ctx.fillText('MARKED', -13, -22);
  } else {
    ctx.strokeStyle = 'rgba(224, 177, 90, 0.7)';
    ctx.lineWidth = 1;
    ctx.strokeRect(-11, -14, 22, 26);
  }

  ctx.fillStyle = 'rgba(231, 236, 228, 0.72)';
  ctx.font = '500 11px "IBM Plex Mono", monospace';
  ctx.fillText(human.id, -12, human.inView ? 42 : 24);
  ctx.restore();
}

function drawFov(ctx, robot) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(robot.x, robot.y);
  ctx.arc(robot.x, robot.y, TUNING.detectRange, robot.heading - TUNING.fov / 2, robot.heading + TUNING.fov / 2);
  ctx.closePath();
  ctx.fillStyle = 'rgba(198, 224, 112, 0.1)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(198, 224, 112, 0.38)';
  ctx.lineWidth = 1.25;
  ctx.stroke();
  ctx.restore();
}

function drawRobot(ctx, robot, blockedDrive) {
  ctx.save();
  ctx.translate(robot.x, robot.y);
  ctx.rotate(robot.heading);
  ctx.fillStyle = '#101613';
  ctx.fillRect(-16, -14, 32, 5);
  ctx.fillRect(-16, 9, 32, 5);
  ctx.strokeStyle = '#667056';
  ctx.lineWidth = 1;
  for (let x = -14; x <= 12; x += 5) {
    ctx.beginPath();
    ctx.moveTo(x, -13);
    ctx.lineTo(x, -10);
    ctx.moveTo(x, 10);
    ctx.lineTo(x, 13);
    ctx.stroke();
  }
  roundRect(ctx, -13, -9, 28, 18, 2);
  ctx.fillStyle = '#24362c';
  ctx.fill();
  ctx.strokeStyle = blockedDrive ? '#e0b15a' : '#c6e070';
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(15, -6);
  ctx.lineTo(23, 0);
  ctx.lineTo(15, 6);
  ctx.closePath();
  ctx.fillStyle = '#c6e070';
  ctx.fill();
  ctx.fillStyle = '#101613';
  ctx.fillRect(1, -2, 7, 4);
  ctx.restore();
}

function drawLabels(ctx, state) {
  ctx.textAlign = 'left';
  ctx.font = '600 13px Rajdhani, sans-serif';
  for (let i = 0; i < rooms.length; i += 1) {
    const room = rooms[i];
    const current = state.roomId === room.id;
    ctx.fillStyle = current ? '#c6e070' : 'rgba(154, 165, 109, 0.8)';
    ctx.fillText(room.name.toUpperCase(), room.x + 10, room.y + 20);
  }
}

function drawScale(ctx) {
  const y = WORLD.height - 26;
  ctx.strokeStyle = '#c6e070';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(22, y);
  ctx.lineTo(122, y);
  ctx.moveTo(22, y - 4);
  ctx.lineTo(22, y + 4);
  ctx.moveTo(122, y - 4);
  ctx.lineTo(122, y + 4);
  ctx.stroke();
  ctx.fillStyle = '#c6e070';
  ctx.font = '500 12px "IBM Plex Mono", monospace';
  ctx.fillText('2 m', 52, y - 6);
}
