import { angDiff, hasLineOfSight } from './geometry.js';
import { castRay } from './geometry.js';
import { TUNING } from './tuning.js';
import { obstacles, walls } from './world.js';

function shadeColor(kind, dist, id) {
  const shade = Math.max(0.2, Math.min(1, 1.2 - dist / 420));
  let shift = 0;
  if (id) {
    for (let i = 0; i < id.length; i += 1) shift += id.charCodeAt(i);
    shift = (shift % 16) - 8;
  }
  const base = kind === 'obstacle' ? [112, 90, 62] : [62, 82, 70];
  const r = Math.floor((base[0] + shift) * shade);
  const g = Math.floor((base[1] + shift * 0.3) * shade);
  const b = Math.floor((base[2] - 4) * shade);
  return `rgb(${r}, ${g}, ${b})`;
}

export function drawCamera(ctx, width, height, state) {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#121816');
  sky.addColorStop(0.46, '#243028');
  sky.addColorStop(0.5, '#1a2420');
  sky.addColorStop(1, '#0d110f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(198, 224, 112, 0.16)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.5);
  ctx.lineTo(width, height * 0.5);
  ctx.stroke();

  const { robot, ai } = state;
  const fov = TUNING.fov;
  const depths = new Float32Array(width);
  const column = 2;

  for (let x = 0; x < width; x += column) {
    const offset = x / width - 0.5;
    const angle = robot.heading + offset * fov;
    const hit = castRay(robot.x, robot.y, angle, walls, obstacles, TUNING.cameraRange);
    const corrected = Math.max(10, hit.dist * Math.cos(angle - robot.heading));
    depths[x] = corrected;
    if (!hit.kind) continue;
    const slice = Math.min(height * 0.92, (height * 210) / corrected);
    const top = (height - slice) / 2;
    ctx.fillStyle = shadeColor(hit.kind, corrected, hit.id);
    ctx.fillRect(x, top, column, slice);
    if (x >= column && Math.abs(corrected - depths[x - column]) > 16) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(x, top, 1, slice);
    }
  }

  const sprites = [];
  for (let i = 0; i < state.humans.length; i += 1) {
    const human = state.humans[i];
    const dx = human.x - robot.x;
    const dy = human.y - robot.y;
    const dist = Math.hypot(dx, dy);
    const diff = angDiff(Math.atan2(dy, dx), robot.heading);
    if (Math.abs(diff) > fov / 2 || dist < 18 || dist > TUNING.cameraRange) continue;
    if (!hasLineOfSight(robot.x, robot.y, human.x, human.y, walls, obstacles)) continue;
    sprites.push({ human, dist, diff });
  }
  sprites.sort((a, b) => b.dist - a.dist);

  for (let i = 0; i < sprites.length; i += 1) {
    const { human, dist, diff } = sprites[i];
    const screenX = (0.5 + diff / fov) * width;
    drawSurvivor(ctx, screenX, height, dist, human, ai && human.inView);
  }
}

function drawSurvivor(ctx, screenX, viewH, dist, human, boxed) {
  const height = Math.min(viewH * 0.7, (viewH * 170) / Math.max(dist, 28));
  const width = height * 0.4;
  const feet = viewH * 0.5 + height * 0.46;
  const top = feet - height;
  const fade = Math.max(0.35, 1 - dist / 520);
  ctx.save();
  ctx.globalAlpha = fade;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(screenX, feet, width * 0.42, Math.max(3, height * 0.035), 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = human.detected ? '#d5e6ad' : '#cbb89a';
  const headR = width * 0.28;
  ctx.beginPath();
  ctx.arc(screenX, top + headR + 1, headR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(screenX - width * 0.22, top + headR * 2, width * 0.44, height * 0.4);
  ctx.fillRect(screenX - width * 0.2, top + height * 0.62, width * 0.14, height * 0.28);
  ctx.fillRect(screenX + width * 0.06, top + height * 0.62, width * 0.14, height * 0.28);

  if (boxed) {
    ctx.globalAlpha = 1;
    const boxX = screenX - width * 0.72;
    const boxY = Math.max(28, top - 4);
    const boxW = width * 1.44;
    const boxH = Math.max(36, Math.min(viewH - 30, feet + 8) - boxY);
    ctx.strokeStyle = '#c6e070';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(boxX, boxY, boxW, boxH);
    ctx.fillStyle = 'rgba(16, 22, 19, 0.82)';
    ctx.fillRect(boxX + 1, boxY + 1, boxW - 2, 16);
    ctx.fillStyle = '#c6e070';
    ctx.font = '600 12px Rajdhani, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('HUMAN DETECTED', boxX + 4, boxY + 12);
    ctx.font = '500 10px "IBM Plex Mono", monospace';
    ctx.fillText(`${human.id}  ${human.confidence}% SIM`, boxX + 4, boxY + boxH - 6);
  }
  ctx.restore();
}
